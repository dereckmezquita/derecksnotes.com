import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

import { checkEmail, checkUsername } from '../../modules/validators';

export const postRegister = Router();

export const initRegister = (client: MongoClient) => {
    postRegister.post('/reset', async (req: Request, res: Response) => {
        // get account info from user
        const { identifier } = req.body;

        // check input
        const check = checkEmail(identifier) || checkUsername(identifier);

        if (!check.success) return sendRes(res, false, null, check.error);

        // console.log(req.body);
        const db = client.db('users');
        const accounts = db.collection('accounts');

        // we do two checks for username/e-mail; we don't know if they sent us a username or an e-mail to reset their password
        // check if the user exists by searching for e-mail and username
        const user = await accounts.findOne({ $or: [{ "email.address": identifier }, { username: identifier }] }) as UserInfo | null;

        // if the user doesn't exist
        if (!user) return sendRes(res, false, null, 'User not found.');

    });
}