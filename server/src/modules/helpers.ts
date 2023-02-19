import { Response } from 'express';
import { logger } from './logger';

export function sendRes(res: Response, success: boolean, data?: any, errorMsg?: string): void {
    // Create a ServerRes object with the success flag, data, and error message
    const serverRes: ServerRes = {
        success: success,
        data: data,
        error: errorMsg
    };

    // Use the appropriate HTTP status code based on the success flag
    if (success) {
        res.status(200);
    } else {
        res.status(400);
    }

    // Send the response as JSON
    res.json(serverRes);

    // Log the response
    // logger.info(`Sent response: ${JSON.stringify(serverRes)}`);
}