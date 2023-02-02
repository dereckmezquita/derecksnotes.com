import { Router, Request, Response } from 'express';
import { sendRes } from '../helpers';
import { MongoClient } from 'mongodb';

import * as argon2 from 'argon2';

export const postRegister = Router();

export const initRegister = (client: MongoClient) => {
    postRegister.post('/register', async (req: Request, res: Response) => {
        // get account info from user
        const user_info = req.body as UserInfo;

        const e_mail: string = user_info.email.address

        const db = client.db('users');
        const accounts = db.collection('account_info');
        const user = await accounts.findOne({ e_mail });

        // if a user with that e-mail already exists
        if (user) return sendRes(res, false, null, 'Username or e-mail already in use');

        // the user sends the password already salted and hashed with sha512
        // we will hash the hash with argon2 before insertion
        user_info.password = await argon2.hash(user_info.password, { type: argon2.argon2id, parallelism: 1 });

        // get the users IP address
        const ip_address: string = req.headers['x-forwarded-for'] as string;

        user_info.userStatistics.ip_addresses.push(ip_address);

        // update last login time
        user_info.userStatistics.last_login = new Date();

        // add the users IP address to the user_info object
        user_info.userStatistics.ip_addresses.push(ip_address as string);

        // insert the new user into the database
        await accounts.insertOne(user_info);
    });
}
