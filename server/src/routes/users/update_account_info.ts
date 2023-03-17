import { Router, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as argon2 from 'argon2';

import { sendRes } from '../../modules/helpers';
import { checkRegisterInfo } from '../../modules/validators';
import { geoLocate } from '../../modules/geoLocate';

export const update_account_info = Router();

// allow users to update
// name, e-mail, username, password
// ------------------------
// steps
// 1. check if the user is logged in and has an active session
// 2. extract the data sent by the user
// 3. check that e-mail and username sent over are still unique
// 4. check that the password is correct; baisically the same as login
// 5. update the users geo location info
    // 5.1 check if current ip address is in the list; update if yes add if no
    // 5.2 update the last connected date
// 6. check the user's new info sent over; baisically the same as register
    // 6.1 if the user is updating their e-mail; reset the e-mail verification status
// 7. complete the updated_user object with info from the old user
// 8. update the user's info in the database

export const init_update_account_info = (db: Db) => {
    update_account_info.post('/users/update_account_info', async (req: Request, res: Response) => {
        // check if the user is logged in and has an active session
        const session = req.session as SessionData;
        
        // 1. check if the user is logged in and has an active session
        if (!session.authenticated) return sendRes(res, false, null, 'You must be logged in to update your account info.');

        const cookie = (req.session as SessionData).user as SessionCookie;
        const email = cookie.email;
        const username = cookie.username;

        const accounts = db.collection('user_accounts');
        const old_user = await accounts.findOne({ "email.address": email, username: username }) as UserInfo | null;

        if (!old_user) return sendRes(res, false, null, 'User not found in database.');

        // 2. extract the data sent by the user
        const updated_user = req.body as UserInfo;

        // 3. check that e-mail and username sent over are still unique
        const emailCheck: number = await accounts.countDocuments({ "email.address": updated_user.email });
        if (emailCheck !== 0) return sendRes(res, false, null, 'E-mail already in use.');
        const userNameCheck: number = await accounts.countDocuments({ username: updated_user.username });
        if (userNameCheck !== 0) return sendRes(res, false, null, 'Username already in use.');

        // 4. check that the password is correct; baisically the same as login
        const passwordCheck = await argon2.verify(old_user.password!, updated_user.password!);
        if (!passwordCheck) return sendRes(res, false, null, 'Incorrect password.');

        // 5. update the users geo location info
        const ip_address: string = req.headers['x-forwarded-for'] as string;
        const datetime: Date = new Date();
        const idx: number = old_user.metadata.geo_locations.findIndex(gl => gl.ip_address === ip_address);

        // 5.1 check if current ip address is in the list; update if yes add if no
        if (idx === -1) {
            old_user.metadata.geo_locations.push({
                first_used: datetime,
                last_used: datetime,
                ...await geoLocate(ip_address)
            } as GeoLocation);
        } else {
            old_user.metadata.geo_locations[idx].last_used = datetime;
        }

        // 5.2 update the last connected date
        old_user.metadata.last_connected = datetime;

        // 6. check the user's new info sent over; baisically the same as register
        // we need to receive all of these fields; client should send the old ones back even if not updated
        const check = checkRegisterInfo(
            updated_user.name!.first,
            updated_user.name!.last,
            updated_user.username,
            updated_user.email!.address
        ) as { success: boolean, error?: string };
        if (!check.success) return sendRes(res, false, null, check.error);

        // 6.1 if the user is updating their e-mail; reset the e-mail verification status
        if (updated_user.email!.address !== old_user.email!.address) {
            updated_user.email!.verified = false;
            // TODO: send e-mail verification e-mail
        }

        // 7. complete the updated_user object with info from the old user
        updated_user.metadata = old_user.metadata;

        // 8. update the user's info in the database
        await accounts.updateOne({ "email.address": email, username: username }, { $set: updated_user });
    });
}