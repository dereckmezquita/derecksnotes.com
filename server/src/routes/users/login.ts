import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

import { checkEmail } from '../../modules/validators';

import * as argon2 from 'argon2';
import { logger } from '../../modules/logger';

export const login = Router();

export const initLogin = (client: MongoClient) => {
    login.post('/users/login', async (req: Request, res: Response) => {
        // the password from client is sent hashed and salted
        // it is sent as a textual representation of the hash+salt
        // sha512(password+salt); salt="derecks-notes"
        const { email, password } = (req.body as { email: string, password: string });

        // check username sent by client
        const emailCheck = checkEmail(email);

        if (!emailCheck.success) return sendRes(res, false, null, emailCheck.error);

        // if they are already logged in and have an active session
        // sessions are saved to live memory
        if ((req.session as SessionDataRes).authenticated) {
            logger.info(`User ${email} is already logged in.`);
            sendRes(res, true, `User ${email} is already logged in.`);
            return;
        }

        const db = client.db('users');
        const accounts = db.collection('accounts');
        const user = await accounts.findOne({ "email.address": email }) as UserInfo | null;

        // no match to that e-mail found
        if (!user) return sendRes(res, false, null, 'E-mail or password is incorrect');

        // compare the password received to the registered password
        const passwordMatch = await argon2.verify(user.password, password, { type: argon2.argon2id, parallelism: 1 });

        console.log(`passwordMatch result: ${passwordMatch}`);

        // password does not match
        if (!passwordMatch) return sendRes(res, false, null, 'E-mail or password is incorrect');

        // password matches so we will modify the session object
        (req.session as SessionDataRes).authenticated = true;
        (req.session as SessionDataRes).user = { email: user.email.address, username: user.username } as UserCookie; // this is what gets saved client's cookies

        logger.info(`User ${user.email.address} has logged in.`);
        sendRes(res, true, "Successfully logged in!");

        // ----------------------------------------
        // update statistics in the database for the user
        // get the users IP address
        const ip_address = req.headers['x-forwarded-for'] as string;

        // if password matches update the user's last connected date
        // check if the user has connected from this IP address before
        const ip_address_index = user.userStatistics.ip_addresses.findIndex((ip_address_obj) => ip_address_obj.ip_address === ip_address);

        // if the user has connected from this IP address before
        if (ip_address_index !== -1) {
            // udpate the user's last connected date only for that IP address
            logger.info(`User ${user.email.address} has connected from an existing IP address: ${ip_address}.`);
            await accounts.updateOne(
                { "email.address": email },
                {
                    $set: { [`userStatistics.ip_addresses.${ip_address_index}.last_use`]: new Date() }
                }
            );
        } else {
            logger.info(`User ${user.email.address} has connected from a new IP address: ${ip_address}.`);
            user.userStatistics.ip_addresses.push({
                ip_address: ip_address,
                first_use: new Date(),
                last_use: new Date()
            });
        }
    });
}