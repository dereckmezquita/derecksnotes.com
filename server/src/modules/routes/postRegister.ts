import { Router, Request, Response } from 'express';
import { sendRes, isValidUserInput } from '../helpers';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export const postRegister = Router();

export const initRegister = (client: MongoClient) => {
    postRegister.post('/register', async (req: Request, res: Response) => {
        // get account info from user
        const { username, email, password, firstName, lastName } = req.body;
        const db = client.db('users');
        const accounts = db.collection('account_info');
        const user = await accounts.findOne({ email });

        // -------------------------
        // security checks
        // -------------------------
        const validation: { success: boolean, error?: string } = isValidUserInput(username, email, password, firstName, lastName);

        if (!validation.success) {
            return sendRes(res, false, undefined, validation.error);
        }

        // immediately hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert the new user into the database
        await accounts.insertOne({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
    });
}
