import { Router, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import * as argon2 from 'argon2';

import { sendRes } from '../../modules/helpers';
import { checkRegisterInfo } from '../../modules/validators';

export const register = Router();

export const initRegister = (client: MongoClient) => {
    register.post('/users/register', async (req: Request, res: Response) => {
        const { firstName, lastName, username, email, password } = req.body as RegisterMessage;

        // check the inputs provided from the client; they might try to hack the client to send requests
        const infoCheck = checkRegisterInfo(firstName, lastName, username, email);

        if (!infoCheck.success) return sendRes(res, false, null, infoCheck.error);

        const db = client.db('users');
        const collection = db.collection('accounts');
        const user = await collection.findOne({ "email.address": email }) as UserInfo | null;

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

        await collection.insertOne(user_info);

        sendRes(res, true, "You're now registered!");
    });
}