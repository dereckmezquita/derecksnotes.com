import { Router, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import * as argon2 from 'argon2';

import { sendRes } from '../../modules/helpers';
import { checkEmail } from '../../modules/validators';


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
        if ((req.session as SessionData).authenticated) {
            sendRes(res, true, `User ${email} is already logged in.`);
            return;
        }

        // TODO: store previous user passwords
        const db = client.db('users');
        const collection = db.collection('accounts');
        const user = await collection.findOne<UserInfo>({ "email.address": email });

        // no match to that e-mail found
        if (!user) return sendRes(res, false, null, 'E-mail or password is incorrect');
        if (!user.password) return sendRes(res, false, null, 'Do not have a valid password for user; please reset password.');

        // compare password received to registered password
        const passwordCheck = await argon2.verify(
            user.password, password, { type: argon2.argon2id, parallelism: 1 }
        );

        // password does not match
        if (!passwordCheck) return sendRes(res, false, null, 'E-mail or password is incorrect');

        // password matches so we will modify the session object
        (req.session as SessionData).authenticated = true;
        (req.session as SessionData).user = { email: user.email.address, username: user.username, profilePhoto: user.profilePhoto } as SessionCookie; // this is what gets saved client's cookies

        sendRes(res, true, "Successfully logged in!");

        // ----------------------------------------
        // update statistics in the database for the user
        const ip_address = req.headers['x-forwarded-for'] as string;
        const ip_address_index = user.userStatistics.ip_addresses.findIndex((ip_address_obj) => ip_address_obj.ip_address === ip_address);

        if (ip_address_index !== -1) {
            // udpate the user's last connected date only for that IP address
            await collection.updateOne(
                { "email.address": email },
                {
                    $set: { [`userStatistics.ip_addresses.${ip_address_index}.last_use`]: new Date() }
                }
            );
        }

        user.userStatistics.ip_addresses.push({
            ip_address: ip_address,
            first_use: new Date(),
            last_use: new Date()
        });
    });
}