import { Router, Request, Response } from 'express';
import { sendRes, isValidUserInput } from '../helpers';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export const postLogin = Router();

export const initLogin = (client: MongoClient) => {
    postLogin.post('/login', async (req: Request, res: Response) => {
        const { email, password } = req.body;
        // const db = client.db('users');
        // const users = db.collection('account_info');
        // const user = await users.findOne({ email });

        console.log('email: ', email, "password: ", password);

        // if (!user) {
        //     sendRes(res, false, null, 'Email or password is incorrect');
        //     return;
        // }

        // const passwordMatch = await bcrypt.compare(password, user.password);
        // if (!passwordMatch) {
        //     sendRes(res, false, null, 'Email or password is incorrect');
        //     return;
        // }

        // sendRes(res, true, { "userData": "Some user data!" });
    });
}
