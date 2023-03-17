import { Router, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as argon2 from 'argon2';

import { sendRes } from '../../modules/helpers';
import { checkEmail } from '../../modules/validators';
import { geoLocate } from '../../modules/geoLocate';


export const login = Router();
// the password from client is sent hashed and salted
// it is sent as a textual representation of the hash+salt
// sha512(password+salt); salt="derecks-notes"

// login endpoint
// ------------------------
// steps
// 1. extract the data sent by the user
// 2. check that the e-mail is valid
// 3. check if the user has an active session (sessions saved in redis)
// 4. find the user in the database
    // 4.1 if the user doesn't exist, send error
    // 4.2 check if we have a password for the user
// 5. compare password received to registered password
    // 5.1 if the password does not match, send ambiguous error
// 6. if the password matches, create a session for the user
export const init_login = (db: Db) => {
    login.post('/users/login', async (req: Request, res: Response) => {
        // 1. extract the data sent by the user
        const { email, password } = (req.body as { email: string, password: string });

        // 2. check that the e-mail is valid
        const emailCheck = checkEmail(email);
        if (!emailCheck.success) return sendRes(res, false, null, emailCheck.error);

        // 3. check if the user has an active session (sessions saved in redis)
        if ((req.session as SessionData).authenticated) return sendRes(res, true, `User ${email} is already logged in.`);

        // TODO: store previous user passwords
        const collection = db.collection('user_accounts');

        // 4. find the user in the database
        const user = await collection.findOne<UserInfo>({ "email.address": email });

        // 4.1 if the user doesn't exist, send error
        if (!user) return sendRes(res, false, null, 'E-mail or password is incorrect');
        // 4.2 check if we have a password for the user
        if (!user.password) return sendRes(res, false, null, 'Do not have a valid password for user; please reset password.');

        // 5. compare password received to registered password
        const passwordCheck = await argon2.verify(user.password, password, { type: argon2.argon2id, parallelism: 1 });

        // 5.1 if the password does not match, send error
        if (!passwordCheck) return sendRes(res, false, null, 'E-mail or password is incorrect');

        // 6. construct new object SessionCookie which omits the password, email.verified, and email.verificationToken from UserInfo
        const session_cookie = user as SessionCookie;

        // 7. if the password matches, create a session for the user
        (req.session as SessionData).authenticated = true;

        (req.session as SessionData).user = session_cookie; // this is what gets saved client's cookies

        sendRes(res, true, "Successfully logged in!");

        // ----------------------------------------
        // update statistics in the database for the user
        const ip_address = req.headers['x-forwarded-for'] as string;
        const idx = user.metadata.geo_locations.findIndex((gl) => gl.ip_address === ip_address);

        if (idx !== -1) {
            // udpate the user's last connected date only for that IP address
            await collection.updateOne(
                { "email.address": email },
                {
                    $set: {
                        [`metadata.geo_locations.${idx}.last_used`]: new Date()
                    }
                }
            );
        } else {
            // add a new entry to the user's statistics
            await collection.updateOne(
                { "email.address": email },
                {
                    $push: {
                        "metadata.geo_locations": {
                            geo_locations: {
                                ...await geoLocate(ip_address),
                                first_used: new Date(),
                                last_used: new Date()
                            }
                        }
                    }
                }
            );
        }
    });
}