export function Integer(bytes, signed) {
    this.size = bytes;
    this.align = bytes;
    if (signed) {
        this.read = function (memory) {
            if (this.size === 1) {
                return memory.readS8();
            } else if (this.size === 2) {
                return memory.readS16();
            } else if (this.size === 4) {
                return memory.readS32();
            } else if (this.size === 8) {
                return memory.readS64();
            } else {
                return null;
            }
        };
    } else {
        this.read = function (memory) {
            switch (this.size) {
                case 1:
                    return memory.readU8();
                case 2:
                    return memory.readU16();
                case 4:
                    return memory.readU32();
                case 8:
                    return memory.readU64();
                default:
                    return null;
            }
        };
    }
}

export const Int = new Integer(Process.pointerSize, true);
export const Int8 = new Integer(1, true);
export const Int32 = new Integer(4, true);
export const UInt = new Integer(Process.pointerSize, false);
export const UInt8 = new Integer(1, false);
export const UInt16 = new Integer(2, false);
export const UInt32 = new Integer(4, false);

export const Float = {
    size: 4,
    align: 4,
    read: function (memory) {
        return memory.readFloat();
    }
};

export const Bool = {
    size: 1,
    align: 1,
    read: function (memory) {
        return memory.readU8() !== 0;
    }
};

export function Enum(enumerates) {
    this.size = Int.size;
    this.align = Int.align;
    this.enumerates = enumerates;
    this.read = function (memory) {
        const index = Int.read(memory);
        if (this.enumerates.hasOwnProperty(index)) {
            return this.enumerates[index];
        } else {
            return index;
        }
    }
}

export function Vector(type, length) {
    this.type = type;
    this.length = length;
    this.size = type.size * length;
    this.align = type.align;
    this.read = function (memory) {
        const array = [];
        const type = this.type;
        for (let i = 0; i < this.length; ++i) {
            array.push(type.read(memory.add(type.size * i)));
        }
        return array;
    }
}

export const CString = {
    size: Process.pointerSize,
    align: Process.pointerSize,
    read: function (memory) {
        return memory.readPointer();
    }
};

export const Pointer = {
    size: Process.pointerSize,
    align: Process.pointerSize,
    read: function (memory) {
        return memory.readPointer();
    }
};

export function Struct(define) {
    this.define = define;
    this.align = 1;
    this.read = function (memory) {
        const object = {};
        let offset = 0;
        for (const field in this.define) {
            if (this.define.hasOwnProperty(field)) {
                let type = this.define[field];
                let align = type.align;
                if (offset % align) {
                    offset += align - offset % align;
                }
                if (memory) {
                    object[field] = type.read(memory.add(offset));
                }
                offset += type.size;
                this.align = Math.max(this.align, align);
            }
        }
        if (offset % this.align) {
            offset += this.align - offset % this.align;
        }
        if (memory) {
            return object;
        } else {
            return offset;
        }
    };
    this.size = this.read(null);
}
