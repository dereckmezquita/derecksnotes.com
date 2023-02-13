import { Router, Request, Response } from 'express';
import { sendRes } from '../helpers';
import { MongoClient } from 'mongodb';

export const getUserInfo = Router();

export const initUserInfo = (client: MongoClient) => {
    getUserInfo.post('/userinfo', async (req: Request, res: Response) => {
        // check if the user is logged in and has an active session
        if (!((req.session as SessionDataRes).authenticated)) {
            sendRes(res, false, null, 'You must be logged in to access this end point.');
            return;
        }

        const cookie = (req.session as SessionDataRes).user as UserCookie;

        // check if the user object exists in the session
        if (!cookie) {
            sendRes(res, false, null, 'User not found in session.');
            throw new Error('User not found in session.');
        }

        const db = client.db('users');

        // get account info
        const accounts = db.collection('accounts');
        const email = cookie.email;
        const username = cookie.username;
        const accountInfo = await accounts.findOne({ "email.address": email, username: username }) as UserInfo | null;

        // get the number of comments the user has made from the comments database
        const comments = db.collection('comments');

        // count the number of comments they have made
        const numComments = await comments.countDocuments({ username: username });

        if (!accountInfo) return sendRes(res, false, null, 'User not found in database.');

        // send back the required information
        sendRes(res, true, {
            username: accountInfo.username,
            email: accountInfo.email.address,
            profilePhoto: accountInfo.profilePhoto,
            numberOfComments: numComments
        });
    });
}
