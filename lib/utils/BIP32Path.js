"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HARDENED_OFFSET = exports.splitPath = exports.buildPathBuffer = void 0;
const HARDENED_OFFSET = 0x80000000;
exports.HARDENED_OFFSET = HARDENED_OFFSET;
function buildPathBuffer(path, num) {
    const getHardenedValue = (pathLevel) => {
        if (pathLevel && pathLevel.isHardened)
            return pathLevel.value + HARDENED_OFFSET;
        else if (pathLevel && !pathLevel.isHardened)
            return pathLevel.value;
        else
            throw Error('Build path error');
    };
    const pathProps = splitPath(path);
    let pathNum = (num && num >= 1 && num < 6) ? num : pathProps.pathNum;
    const buf = Buffer.alloc(4 * pathNum);
    const { purpose, coinType, accountId, change, addressIndex } = pathProps;
    for (let i = 0; i < pathNum; i++) {
        // buffer need to start from 0 bytes
        switch (i) {
            case 0:
                buf.writeUInt32LE(getHardenedValue(purpose), i * 4);
                break;
            case 1:
                buf.writeUInt32LE(getHardenedValue(coinType), i * 4);
                break;
            case 2:
                buf.writeUInt32LE(getHardenedValue(accountId), i * 4);
                break;
            case 3:
                buf.writeUInt32LE(getHardenedValue(change), i * 4);
                break;
            case 4:
                buf.writeUInt32LE(getHardenedValue(addressIndex), i * 4);
                break;
        }
    }
    return { pathNum, pathBuffer: buf };
}
exports.buildPathBuffer = buildPathBuffer;
function splitPath(path) {
    const elements = path.split('/');
    const pathLen = elements.length;
    if (pathLen < 2 || pathLen > 6)
        throw Error('Invalid Path, only support 1 to 5 depth path');
    const pathProps = {};
    pathProps.pathNum = pathLen - 1;
    elements.forEach((element, index) => {
        if (index === 0)
            return;
        const props = {};
        const isHardened = (element.length > 1 && element[element.length - 1] === "'");
        if (isHardened) {
            props.value = parseInt(element.slice(0, -1), 10);
        }
        else {
            props.value = parseInt(element, 10);
        }
        props.isHardened = isHardened;
        props.depth = index;
        switch (index) {
            case 1:
                pathProps.purpose = props;
                break;
            case 2:
                pathProps.coinType = props;
                break;
            case 3:
                pathProps.accountId = props;
                break;
            case 4:
                pathProps.change = props;
                break;
            case 5:
                pathProps.addressIndex = props;
                break;
        }
    });
    return pathProps;
}
exports.splitPath = splitPath;
