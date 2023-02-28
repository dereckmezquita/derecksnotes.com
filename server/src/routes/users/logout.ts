import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';

export const logout = Router();

// logout end point
// ------------------------
// steps
// 1. destroy the session
logout.post('/users/logout', (req: Request, res: Response) => {
    // 1. destroy the session
    req.session.destroy((err) => {
        if (err) {
            sendRes(res, false, null, err.message);
        }

        sendRes(res, true, "Successfully logged out!");
    })
});