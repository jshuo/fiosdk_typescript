"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCompressed = void 0;
function isHexEven(str) {
    const regex = /^[0-9a-fA-F]+[02468aceACE]$/;
    return regex.test(str);
}
function toCompressed(array) {
    const xOrdinate = array.slice(0, 32);
    const yOrdinate = array.slice(32, 64);
    let compressedPrefix;
    if (isHexEven(yOrdinate.toString('hex'))) {
        compressedPrefix = Buffer.from([0x02]);
    }
    else {
        compressedPrefix = Buffer.from([0x03]);
    }
    return Buffer.concat([compressedPrefix, xOrdinate]);
}
exports.toCompressed = toCompressed;
