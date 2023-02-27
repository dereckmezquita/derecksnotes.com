import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

export const accountInfo = Router();

export const initAccountInfo = (client: MongoClient) => {
    accountInfo.post('/users/account_info', async (req: Request, res: Response) => {
        // const ip_address = req.headers['x-forwarded-for'] as string;

        // check if the user is logged in and has an active session
        const session = req.session as SessionData;

        if (!session.authenticated) {
            return sendRes(res, false, undefined, "Please login.");
        }

        const cookie = (req.session as SessionData).user as SessionCookie;

        const email = cookie.email;
        const username = cookie.username;

        const db = client.db('users');
        const accounts = db.collection<UserInfo>('accounts');

        // get account info but only get the 10 most recent ip addresses; and don't get the user's password set it to undefined instead
        const info = accounts.findOne({ "email.address": email, username: username }, { projection: { password: 0, ip_addresses: { $slice: -10 } }});

        // we will get most recent user comments at a separate end point
        sendRes(res, true, info);
    });
}
