import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';

import { User, type IUser } from '../../db/models/User';
import { sendEmail } from '../../utils/sendEmail';
import { API_URL } from '../../utils/env';
import { TOKEN_SIZE, TOKEN_VALIDITY_HOURS } from '../../utils/constants';

const router = Router();

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
                isVerified: true
            }) as IUser;
        }

        // Generate a unique token and set its expiration
        const tempToken: string = crypto
            .randomBytes(TOKEN_SIZE)
            .toString('hex');
        const tempTokenExpires: Date = new Date(
            Date.now() + TOKEN_VALIDITY_HOURS
        );

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

router.get('/auth/magic-verify', async (req: Request, res: Response) => {
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

        res.json({ message: 'Magic link verified' });
        res.redirect(`${API_URL}/profile`);
    } catch (error) {
        console.error('Error verifying magic link:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
