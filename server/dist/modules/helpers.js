"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRes = void 0;
function sendRes(res, success, data, errorMsg) {
    // res is an express response object; use here send response
    const serverRes = {
        success: success,
        data: data,
        error: errorMsg
    };
    res.send(serverRes);
}
exports.sendRes = sendRes;
