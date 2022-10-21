"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRes = void 0;
function sendRes(res, success, data, errorMsg) {
    res.json({
        success: success,
        data: data,
        error: errorMsg
    });
}
exports.sendRes = sendRes;
