import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

export const getUserInfo = Router();

type UserInfoRes = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profilePhoto?: string; // if user didn't upload a profile photo
    numberOfComments: number;
    lastConnected?: Date;
    current_ip: string;
};

export const initUserInfo = (client: MongoClient) => {
    getUserInfo.post('/users/userinfo', async (req: Request, res: Response) => {
        const ip_address = req.headers['x-forwarded-for'] as string;

        // check if the user is logged in and has an active session
        if (!((req.session as SessionDataRes).authenticated)) {
            const defaultUser: UserInfoRes = {
                firstName: "",
                lastName: "",
                username: "Guest",
                email: "",
                profilePhoto: `/site-images/user-defaults/profile-photos/default-profile-photo-${Math.floor(Math.random() * 4) + 1}-small.png`,
                numberOfComments: 0,
                lastConnected: undefined,
                current_ip: ip_address
            }

            console.log("User not loggedin; sending default user info.")
            return sendRes(res, true, defaultUser);
        }

        const cookie = (req.session as SessionDataRes).user as UserCookie;

        // if (!cookie) { }

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

        const userInfo: UserInfoRes = {
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            username: accountInfo.username,
            email: accountInfo.email.address,
            profilePhoto: accountInfo.profilePhoto,
            numberOfComments: numComments,
            lastConnected: accountInfo.userStatistics.last_connected,
            current_ip: ip_address
        }

        sendRes(res, true, );
    });
}
