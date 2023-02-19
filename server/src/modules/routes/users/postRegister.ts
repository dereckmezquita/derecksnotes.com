import { Router, Request, Response } from 'express';
import { sendRes } from '../helpers';
import { MongoClient } from 'mongodb';

import { checkRegisterInfo } from '../validators';

import * as argon2 from 'argon2';

export const postRegister = Router();

export const initRegister = (client: MongoClient) => {
    postRegister.post('/register', async (req: Request, res: Response) => {
        // get account info from user
        const { firstName, lastName, username, email, password } = req.body;

        // check the inputs provided from the client; they might try to hack the client to send requests
        const infoCheck = checkRegisterInfo(firstName, lastName, username, email);

        if (!infoCheck.success) return sendRes(res, false, null, infoCheck.error);

        // console.log(req.body);
        const db = client.db('users');
        const accounts = db.collection('accounts');
        const user = await accounts.findOne({ "email.address": email }) as UserInfo | null;

        // if a user with that e-mail already exists
        if (user) return sendRes(res, false, null, 'Username or e-mail already in use.');

        // the user sends the password already salted and hashed with sha512
        // we will hash the hash with argon2 before insertion
        const hash = await argon2.hash(password, { type: argon2.argon2id, parallelism: 1 });

        // get the users IP address
        const ip_address = req.headers['x-forwarded-for'] as string;

        // insert the user into the database
        const user_info: UserInfo = {
            firstName: firstName,
            lastName: lastName,
            profilePhoto: undefined,
            username: username,
            password: hash,
            email: {
                address: email,
                verified: false
            },
            userStatistics: {
                ip_addresses: [
                    {
                        ip_address: ip_address,
                        first_use: new Date(),
                        last_use: new Date()
                    }
                ],
                last_connected: new Date()
            }
        };

        await accounts.insertOne(user_info);

        sendRes(res, true, "You're now registered!");
    });
}