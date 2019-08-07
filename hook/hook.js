import {ENCODER_OPTION, EncParamExt, SBitrateInfo, SWelsSvcCodingParam} from "./openh264";
import {x264_param_t} from "./x264";
import {Float} from "./struct";

const hooks = [{
    name: "_ZN7WelsEnc19CWelsH264SVCEncoder13InitializeExtEPK14TagEncParamExt",
    enter: function (args) {
        if (process.env.FRIDA_HOOK_DEBUG) {
            console.log(JSON.stringify({
                name: "EncParamExt(HEX)",
                value: hexdump(args[0], {length: EncParamExt.size, ansi: true})
            }));
        }
        console.log(JSON.stringify({
            name: "EncParamExt",
            value: EncParamExt.read(args[1])
        }));
    }
}, {
    name: "_ZN7WelsEnc22WelsEncoderParamAdjustEPPNS_13TagWelsEncCtxEPNS_21TagWelsSvcCodingParamE",
    enter: function (args) {
        if (process.env.FRIDA_HOOK_DEBUG) {
            console.log(JSON.stringify({
                name: "SWelsSvcCodingParam(HEX)",
                value: hexdump(args[1], {length: SWelsSvcCodingParam.size, ansi: true})
            }));
        }
        console.log(JSON.stringify({
            name: "SWelsSvcCodingParam",
            value: SWelsSvcCodingParam.read(args[1])
        }));
    }
}, {
    name: "_ZN7WelsEnc19CWelsH264SVCEncoder9SetOptionE14ENCODER_OPTIONPv",
    enter: function (args) {
        const option = ENCODER_OPTION.enumerates[args[1].toInt32()];
        if (option === "ENCODER_OPTION_BITRATE") {
            console.log(JSON.stringify({
                name: "SBitrateInfo",
                value: SBitrateInfo.read(args[2])
            }))
        } else if (option === "ENCODER_OPTION_FRAME_RATE") {
            console.log(JSON.stringify({
                name: "SFrameRate",
                value: {
                    "fps": Float.read(args[2])
                }
            }))
        } else {
            console.log(JSON.stringify({
                name: "ENCODER_OPTION",
                value: ENCODER_OPTION.enumerates[args[1].toInt32()]
            }));
        }
    }
}, {
    name: "x264_encoder_open_155",
    enter: function (args) {
        if (process.env.FRIDA_HOOK_DEBUG) {
            console.log(JSON.stringify({
                name: "x264_param_t(HEX)",
                value: hexdump(args[0], {length: x264_param_t.size, ansi: true})
            }));
        }
        console.log(JSON.stringify({
            name: "x264_param_t",
            value: x264_param_t.read(args[0])
        }));
    }
}];

for (let i = 0; i < hooks.length; ++i) {
    const address = Module.findExportByName(null, hooks[i].name);
    if (address) {
        console.log(JSON.stringify({
            name: "Hook",
            value: `${hooks[i].name}@${address}`
        }));
        Interceptor.attach(address, {
            onEnter: hooks[i].enter
        });
    }
}
