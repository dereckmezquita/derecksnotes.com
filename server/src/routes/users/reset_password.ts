import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

import { checkEmail, checkUsername } from '../../modules/validators';

export const reset_password = Router();

export const init_reset_password = (client: MongoClient) => {
    reset_password.post('/users/reset_password', async (req: Request, res: Response) => {
        // get account info from user
        const { identifier } = req.body;

        // check input
        const check = checkEmail(identifier) || checkUsername(identifier);

        if (!check.success) return sendRes(res, false, null, check.error);

        // console.log(req.body);
        const db = client.db('users');
        const accounts = db.collection('accounts');

        // search for e-mail or username
        const user = await accounts.findOne({ $or: [{ "email.address": identifier }, { username: identifier }] }) as UserInfo | null;

        // if the user doesn't exist
        if (!user) return sendRes(res, false, null, 'User not found.');

        // if user exists; send e-mail reset password link
    });
}