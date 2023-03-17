import { Router, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as argon2 from 'argon2';

import { sendRes } from '../../modules/helpers';
import { checkRegisterInfo } from '../../modules/validators';
import { geoLocate } from '../../modules/geoLocate';

export const register = Router();


// user register through this end point
// ------------------------
// steps
// 1. extract the data sent by the user
// 2. check that the data is valid
// 3. check that e-mail and username sent over are unique
// 5. hash the password
// 6. create geo location object
// 7. create the user object
// 8. insert the user object into the database
export const init_register = (db: Db) => {
    register.post('/users/register', async (req: Request, res: Response) => {
        // 1. extract the data sent by the user
        const { firstName, lastName, username, email, password } = req.body as RegisterMessage;

        // 2. check that the data is valid
        const infoCheck = checkRegisterInfo(firstName, lastName, username, email);
        if (!infoCheck.success) return sendRes(res, false, null, infoCheck.error);

        const collection = db.collection('user_accounts');

        // 3. check that e-mail and username sent over are unique
        const user = await collection.findOne({ "email.address": email }) as UserInfo | null;
        const usernameCheck: Number = await collection.countDocuments({ username: username });

        if (user || usernameCheck !== 0) return sendRes(res, false, null, "Email or username already in use");

        // 5. hash the password
            // the user sends the password already salted and hashed with sha512
            // we will hash the hash with argon2 before insertion
        const hash = await argon2.hash(password, { type: argon2.argon2id, parallelism: 1 });

        // 6. create geo location object
        const ip_address = req.headers['x-forwarded-for'] as string;

        const datetime: Date = new Date();

        // 7. create user object
        const user_info: UserInfo = {
            name: {
                first: firstName,
                last: lastName
            },
            profilePhoto: `/site-images/user-defaults/profile-photos/default-profile-photo-${Math.floor(Math.random() * 4) + 1}-small.png`,
            email: {
                address: email,
                verified: false
            },
            username: username,
            password: hash,
            metadata: {
                geo_locations: [
                    {
                        first_used: datetime,
                        last_used: datetime,
                        ...await geoLocate(ip_address)
                    } as GeoLocation
                ],
                last_connected: datetime,
                numberOfComments: 0
            }
        };

        // 8. insert the user object into the database
        await collection.insertOne(user_info);

        sendRes(res, true, "You're now registered!");
    });
}