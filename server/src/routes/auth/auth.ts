import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';

import { User, type IUser } from '../../db/models/User';
import { sendEmail } from '../../utils/sendEmail';
import { API_URL } from '../../utils/env';

const router = Router();

const hours: number = 3 * 60 * 60 * 1000; // 3 hour
const tokenSize: number = 64;

router.post('/auth/magic-link', async (req: Request, res: Response) => {
    const { email } = req.body;
    const timeStamp: string = new Date().toISOString();

    try {
        let user: IUser | null = await User.findByEmail(email);

        if (!user) {
            // If user doesn't exist, create a new user
            user = new User({
                email,
                username: email,
                isVerified: false
            }) as IUser;
        }

        // Generate a unique token and set its expiration
        const tempToken: string = crypto.randomBytes(tokenSize).toString('hex');
        const tempTokenExpires: Date = new Date(Date.now() + hours);

        user.tempToken = tempToken;
        user.tempTokenExpires = tempTokenExpires;
        await user.save();

        // Send the magic link email
        const magicLink: string = `${API_URL}/api/auth/magic-verify?token=${tempToken}`;
        await sendEmail(
            email,
            "Dereck's Notes | Magic Link",
            `Click the following link to sign in: <a href="${magicLink}">${magicLink}</a><br><br>If you didn't request this, you can safely ignore this email.<br><br>${timeStamp}`
        );

        // TODO: create shared interfaces for client and server
        res.json({
            message: 'Magic link sent to your email',
            timestamp: timeStamp
        }); //  as SuccessResponse
    } catch (error) {
        console.error('Error sending magic link:', error);
        res.status(500).json({ error: 'An error occurred' }); //  as ErrorResponse
    }
});

router.get('/auth/magic-verify', async (req, res) => {
    const { token } = req.query;

    try {
        const user: IUser | null = await User.findOne({
            tempToken: token,
            tempTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Clear the temp token
        user.tempToken = undefined;
        user.tempTokenExpires = undefined;
        // Verify the user
        user.isVerified = true;
        await user.save();

        req.session.userId = user._id;

        res.redirect(`${API_URL}/profile`);
    } catch (error) {
        console.error('Error verifying magic link:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user: IUser | null = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // TODO: review if this needs to be async
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user._id;

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/auth/is-logged-in', async (req, res) => {
    // we are using redis for sessions
    // session middleware automatically sent the session id to the client
    const { userId } = req.session;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    try {
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorised' });
        }

        const { _id, email, firstName, lastName } = user;
        res.json({
            message: 'Logged in',
            user: { _id, email, firstName, lastName }
        });
    } catch (error) {
        console.error('Error checking if logged in:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/auth/register', async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password } = req.body;

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

        await user.save();

        // You might want to send a verification email here

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/auth/reset-password', async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

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

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
