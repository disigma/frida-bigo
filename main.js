const webpack = require("webpack");
const frida = require("frida");
const babel = require("babel-core");
const influx = require("influx");
const adb = require("adbkit");
const Promise = require("bluebird");

async function frida_server() {
    if (!process.env.hasOwnProperty("FRIDA_HOOK_DEVICE")) {
        process.env.FRIDA_HOOK_DEVICE = "";
    }

    const client = adb.createClient();

    const frida_servers = {
        "armeabi-v7a": __dirname + "/frida/frida-server-12.6.11-android-arm",
        "arm64-v8a": __dirname + "/frida/frida-server-12.6.11-android-arm64",
        "x86": __dirname + "/frida/frida-server-12.6.11-android-x86",
        "x86_64": __dirname + "/frida/frida-server-12.6.11-android-x86_64"
    };
    const frida_run_path = "/data/local/tmp/frida-server";

    const devices = await client.listDevices();
    for (let i = 0; i < devices.length; ++i) {
        const device = devices[i];
        if (process.env.FRIDA_HOOK_DEVICE && process.env.FRIDA_HOOK_DEVICE !== device.id) {
            console.log("[%s] skip device %s.", device.id, device.id);
            continue;
        }
        console.log("[%s] found device %s.", device.id, device.id);
        let stream = await client.shell(device.id, "su -c echo root");
        let output = await adb.util.readAll(stream);
        if (output.toString().trim() !== "root") {
            console.error("[%s] device not rooted.", device.id);
            continue;
        }
        stream = await client.shell(device.id, "ps | grep frida-server");
        output = await adb.util.readAll(stream);
        if (output.toString().trim()) {
            console.log("[%s] frida-server is already running.", device.id);
            continue;
        }
        stream = await client.shell(device.id, "getprop ro.product.cpu.abi");
        output = await adb.util.readAll(stream);
        const abi = output.toString().trim();
        console.log("[%s] abi is %s", device.id, abi);
        if (!frida_servers.hasOwnProperty(abi)) {
            console.error("[%s] device abi is not supported.", device.id);
            continue;
        }
        const success = await client.push(
            device.id,
            frida_servers[abi],
            frida_run_path,
            0o777
        ).then(function (transfer) {
            return new Promise((resolve) => {
                transfer.on("end", () => {
                    console.log("[%s] frida-server pushed.", device.id);
                    resolve(true);
                });
                transfer.on("error", error => {
                    console.error("[%s] %s", device.id, error);
                    resolve(false);
                });
            });
        });
        if (!success) {
            console.error("[%s] frida-server failed to install.", device.id);
            continue;
        }
        await client.shell(device.id, `su -c ${frida_run_path} -D`);
        stream = await client.shell(device.id, "ps | grep frida-server");
        output = await adb.util.readAll(stream);
        if (output.toString().trim()) {
            console.log("[%s] frida-server is running.", device.id);
        }
    }
}

async function run(code) {
    const device = await frida.getUsbDevice();
    console.log("USB device: ", device);
    if (!process.env.hasOwnProperty("FRIDA_HOOK_TARGET")) {
        process.env.FRIDA_HOOK_TARGET = "sg.bigo.live";
    }
    const session = await device.attach(process.env.FRIDA_HOOK_TARGET);
    console.log("Attached: ", session);
    session.detached.connect(function (reason) {
        console.log(`onDetached(reason=${reason})`);
    });
    const script = await session.createScript(code);
    const info = {
        "device_id": device.id,
        "device_name": device.name,
        "target": process.env.FRIDA_HOOK_TARGET
    };
    if (!process.env.hasOwnProperty("FRIDA_HOOK_INFLUXDB")) {
        process.env.FRIDA_HOOK_INFLUXDB = ""; // http://127.0.1.1:8086/frida
    }
    const client = process.env.FRIDA_HOOK_INFLUXDB ? new influx.InfluxDB(process.env.FRIDA_HOOK_INFLUXDB) : null;
    const flat_data = function (data, prefix = []) {
        const result = {};
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; ++i) {
                Object.assign(result, flat_data(data[i], [].concat(prefix).concat(i)));
            }
        } else if (typeof data == "object") {
            for (const name in data) {
                if (name === '__proto__') {
                    continue;
                }
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                Object.assign(result, flat_data(data[name], [].concat(prefix).concat(name)));
            }
        } else if (prefix.length) {
            result[prefix.join(".")] = data;
        } else {
            result["data"] = data;
        }
        return result;
    };
    console.log("Script created");
    script.logHandler = function (level, text) {
        let message = JSON.parse(text);
        console.log(message.name + ": ", message.value);
        if (client) {
            client.writePoints([{
                measurement: "frida",
                fields: Object.assign({}, info, flat_data(message.value)),
                tags: {event: message.name},
                timestamp: Date.now() * 1000000
            }]);
        }
    };
    script.message.connect(message => {
        console.log("Message: ", message);
    });
    await script.load();
    stop = function () {
        script.unload();
    };
    process.on("SIGTERM", stop);
    process.on("SIGINT", stop);
}

frida_server().then(() => {
    webpack({
        mode: "production",
        entry: __dirname + "/hook/hook.js"
    }).compile(function (error, compilation) {
        const result = babel.transform(
            compilation.assets["main.js"]["_value"],
            {presets: ['env']}
        );
        run(result.code).catch(error => console.error(error));
    });
}).catch(error => console.error(error));
