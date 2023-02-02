import { Router, Request, Response } from 'express';
import { sendRes } from '../helpers';
import { MongoClient } from 'mongodb';

import * as argon2 from 'argon2';

export const postLogin = Router();

export const initLogin = (client: MongoClient) => {
    postLogin.post('/login', async (req: Request, res: Response) => {
        // the password from client is sent hashed and salted
        // it is sent as a textual representation of the hash+salt
        // sha512(password+salt); salt="derecks-notes"
        const { username, password } = (req.body as { username: string, password: string });

        // TODO: consider doing security checks here
        const db = client.db('users');
        const collection = db.collection('account_info');
        const user = await collection.findOne({ "email.address": username });

        // no match to that e-mail found
        if (!user) return sendRes(res, false, null, 'E-mail or password is incorrect');

        console.log(`Saved password: ${user.password}`);
        console.log(`Received password: ${password}`);

        // compare the password received to the registered password
        const passwordMatch = await argon2.verify(user.password, password, { type: argon2.argon2id, parallelism: 1 });

        console.log(`passwordMatch result: ${passwordMatch}`);

        // password does not match
        if (!passwordMatch) return sendRes(res, false, null, 'E-mail or password is incorrect');

        sendRes(res, true, { "userData": "Some user data!" });
    });
}