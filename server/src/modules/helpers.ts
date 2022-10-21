
import { Response } from 'express';

export function sendRes(res: Response, success: boolean, data?: any, errorMsg?: string) {
    res.json({
        success: success,
        data: data,
        error: errorMsg
    });
}
