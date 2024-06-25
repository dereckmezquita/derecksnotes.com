import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';

import { User, type IUser } from '../../db/models/User';
import { sendEmail } from '../../utils/sendEmail';
import { API_URL } from '../../utils/env';
import {
    SINGLE_HOUR,
    TOKEN_SIZE,
    TOKEN_VALIDITY_HOURS
} from '../../utils/constants';

const router = Router();

router.post('/auth/register', async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password } = req.body;
    const timeStamp: string = new Date().toISOString();

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            username,
            email,
            password,
            isVerified: false
        });

        // TODO: send verification e-mail
        const tempToken: string = crypto
            .randomBytes(TOKEN_SIZE)
            .toString('hex');
        const tempTokenExpires: Date = new Date(
            Date.now() + TOKEN_VALIDITY_HOURS
        );

        user.tempToken = tempToken;
        user.tempTokenExpires = tempTokenExpires;
        await user.save();

        const magicLink: string = `${API_URL}/api/auth/magic-verify?token=${tempToken}`;
        await sendEmail(
            email,
            "Dereck's Notes | Magic Link",
            `Click the following link to sign in: <a href="${magicLink}">${magicLink}</a><br><br>If you didn't request this, you can safely ignore this email.<br><br>${timeStamp}`
        );

        res.status(201).json({
            message: 'User registered successfully, verification e-mail sent',
            timestamp: timeStamp
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user: IUser | null = await User.findByEmail(email);

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user._id;

        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res
                .status(500)
                .json({ error: 'An error occurred during logout' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

router.post('/auth/reset-password', async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a password reset token
        const resetToken: string = crypto
            .randomBytes(TOKEN_SIZE)
            .toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + SINGLE_HOUR * 0.5); // 30 mins

        await user.save();

        // Send password reset email
        const resetUrl = `${API_URL}/reset-password/${resetToken}`;
        await sendEmail(
            email,
            "Dereck's Notes | Password Reset",
            `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        );

        res.json({ message: 'Password reset e-mail sent' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
