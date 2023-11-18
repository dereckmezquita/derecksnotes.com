import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '.env') });

const base_url: string = process.env.NEXT_PUBLIC_DEV_MODE === 'true' ?
    'https://test.derecksnotes.com' :
    'https://derecksnotes.com';

import isAuthenticated from '@utils/middleware/isAuthenticated';

import User, { UserDocument } from '@models/User';

const email_verification = Router();

email_verification.get('/email_verification_req', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const email = req.query.email;

        const user = await User.findOne<UserDocument>({ 'email.address': email });
    
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
    
        // Check if the user's email is already verified
        if (user.email.verified) {
            return res.status(400).json({ message: "Email is already verified." });
        }
    
        // Check if a verification request was made in the last 3 hours
        if (user.email.tokenExpiry && new Date(user.email.tokenExpiry).getTime() > Date.now() - (1 * 60 * 60 * 1000)) {
            const time_remaining = new Date(user.email.tokenExpiry).getTime() - Date.now();
            return res.status(400).json({ message: "A verification request was recently sent. Please check your email or try again later.", timeRemaining: time_remaining });
        }
    
        // Generate a verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const tokenExpiryTimestamp = Date.now() + 3_600_000 * 2; // 2 hours from now in milliseconds
        const tokenExpiry = new Date(tokenExpiryTimestamp);
    
        // Update user with verification token and expiry
        user.email.verificationToken = verificationToken;
        user.email.tokenExpiry = tokenExpiry;
        await user.save();
    
        // Send verification email
        let transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 25,
            secure: false,
            tls: { rejectUnauthorized: false }
        });


    
        const info = await transporter.sendMail({
            from: "'Dereck's Notes | Verification' <verify@derecksnotes.com>",
            to: user.email.address,
            subject: "Dn | e-mail verification",
            text: 
    `
    Please verify your email ${email} by clicking on the link: ${base_url}/api/interact/email_verification?token=${verificationToken}
    
    If you did not make this request please ignore this e-mail.
    `,
            html:
    `
    <p>Please verify your email ${email} by clicking on the link: <a href="${base_url}/api/interact/email_verification?token=${verificationToken}">Verify Email</a></p>
    
    If you did not make this request please ignore this e-mail.
    `
        });
    
        res.status(200).json({ message: "Verification email sent." });
    } catch (err) {
        res.status(400).json({ message: "Error processing e-mail verification request: ", error: err })
    }
});

// usage
// https://www.derecksnotes.com/api/interact/email_verification_req?email=dereck@mezquita.io

email_verification.get('/email_verification', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        // Find user by token and check if token is not expired
        const user = await User.findOne<UserDocument>({ 
            'email.verificationToken': token, 
            'email.tokenExpiry': { $gt: Date.now() } 
        });
    
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }
    
        // Verify the user's email
        user.email.verified = true;
        user.email.verificationToken = undefined;
        user.email.tokenExpiry = undefined;
        await user.save();
    
        res.status(200).json({ message: "Email verified successfully." });
    } catch (err) {
        res.status(400).json({ message: "An error occurred trying to verify token.", error: err })
    }
});

export default email_verification;