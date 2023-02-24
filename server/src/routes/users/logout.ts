import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';

export const logout = Router();

// make sure to regenerate the session id when logging out
logout.post('/users/logout', (req: Request, res: Response) => {
    // if logout successful, send back a success message
    req.session.destroy((err) => {
        if (err) {
            sendRes(res, false, null, err.message);
        }

        sendRes(res, true, "Successfully logged out!");
    })
});