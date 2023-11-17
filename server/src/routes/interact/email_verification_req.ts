import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import isAuthenticated from '@utils/middleware/isAuthenticated';

import User, { UserDocument } from '@models/User';

const email_verification = Router();

console.log("YHEKNSF")

email_verification.get('/email_verification_req', async (req: Request, res: Response) => {
    const email = req.query.email;

    const user = await User.findOne<UserDocument>({ 'email.address': email });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiryTimestamp = Date.now() + 3_600_000 * 2; // 2 hours from now in milliseconds

    // Convert the numeric timestamp to a Date object
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
Please verify your email ${email} by clicking on the link: https://derecksnotes.com/api/interact/email_verification?token=${verificationToken}

If you did not make this request please ignore this e-mail.
`,
        html:
`
<p>Please verify your email ${email} by clicking on the link: <a href="https://derecksnotes.com/api/interact/email_verification?token=${verificationToken}">Verify Email</a></p>

If you did not make this request please ignore this e-mail.
`
    });

    res.json({ message: "Verification email sent." });
});

// usage
// https://www.derecksnotes.com/api/interact/email_verification_req?email=dereck@mezquita.io

email_verification.get('/email_verification', async (req: Request, res: Response) => {
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

    res.json({ message: "Email verified successfully." });
});

export default email_verification;