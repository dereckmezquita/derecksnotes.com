import { Response } from 'express';

export function sendRes(res: Response, success: boolean, data?: any, errorMsg?: string): void {
    // res is an express response object; use here send response
    const serverRes: ServerRes = {
        success: success,
        data: data,
        error: errorMsg
    };
    
    res.send(serverRes);
}