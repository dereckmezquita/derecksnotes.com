import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

import { geoLocate } from '../../modules/geoLocate';

export const get_user_info = Router();

// get a user's account information typically for comments section
// steps
// 1. get the user's ip address and create a new date object
// 2. if not logged in
//     2.1 if not logged in create new default user info; includes:
//         2.1.1 profile photo
//         2.1.2 username
//         2.1.3 statistics
//             2.1.3.1 geo_location: first_used, last_used, GeoLocationRes
//         2.1.4 last_connected
// 3. get/send the user's info from the database; exclude password and only get the 10 most recent ip addresses
//     3.1 if the user is not found in the database send an error
// 5. update the user's last_connected date and geo_location if necessary
export const init_get_user_info = (client: MongoClient) => {
    get_user_info.post('/users/get_user_info', async (req: Request, res: Response) => {
        // 1. get the user's ip address and create a new date object
        const ip_address = req.headers['x-forwarded-for'] as string;
        const now: Date = new Date();

        // 2. if not logged in
        const session = req.session as SessionData;
        if (!session.authenticated) {
            // 2.1 if not logged in create new default user info; includes:
            const defaultUser: UserInfo = {
                profilePhoto: `/site-images/user-defaults/profile-photos/default-profile-photo-${Math.floor(Math.random() * 4) + 1}-small.png`,
                username: "Guest",
                metadata: {
                    geo_location: [
                        {
                            first_used: now,
                            last_used: now,
                            ...await geoLocate(ip_address)
                        }
                    ],
                    last_connected: now
                }
            }

            console.log("User not loggedin; sending default user info.")
            return sendRes(res, true, defaultUser);
        }

        const cookie = (req.session as SessionData).user as SessionCookie;
        const email = cookie.email;
        const username = cookie.username;

        const db = client.db('users');
        const accounts = db.collection('accounts');

        // 3. get/send the user's info from the database; exclude password and only get the 10 most recent ip addresses
        const userInfo = accounts.findOne<UserInfo>(
            { "email.address": email, username: username },
            { projection: {
                password: 0,
                ip_addresses: { $slice: -10 }
            }}
        );
        if (!userInfo) return sendRes(res, false, null, 'User not found in database.');
        sendRes(res, true, userInfo);

        // 5. update the user's last_connected date and geo_location if necessary
        // const idx = userInfo.metadata.geo_location.findIndex((gl) => gl.ip_address === ip_address);
    });
}

// `/site-images/user-content/profile-photos/${username}.jpg`