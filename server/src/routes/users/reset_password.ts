import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { Db } from 'mongodb';

import { checkEmail, checkUsername } from '../../modules/validators';

export const reset_password = Router();

// user reset password through this end point
// ------------------------
// steps
// 1. extract the data sent by the user
    // 1.1 we allow the user to send either the e-mail or the username
// 2. check that the data is valid
// 3. search for the user in the database; either e-mail or username
// 4. if the user doesn't exist, send error
// 5. if the user exists, send e-mail reset password link
export const init_reset_password = (db: Db) => {
    reset_password.post('/users/reset_password', async (req: Request, res: Response) => {
        // 1. extract the data sent by the user
        const { identifier } = req.body;

        // 2. check that the data is valid
        const check = checkEmail(identifier) || checkUsername(identifier);
        if (!check.success) return sendRes(res, false, null, check.error);

        const accounts = db.collection('user_accounts');

        // 3. search for the user in the database; either e-mail or username
        const user = await accounts.findOne({ $or: [{ "email.address": identifier }, { username: identifier }] }) as UserInfo | null;

        // 4. if the user doesn't exist, send error
        if (!user) return sendRes(res, false, null, 'User not found.');

        // 5. if the user exists, send e-mail reset password link
    });
}