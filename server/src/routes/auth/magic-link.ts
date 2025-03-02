import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';

import { User, type IUser } from '../../db/models/User';
import { sendEmail } from '../../utils/sendEmail';
import { API_URL } from '../../utils/env';
import { TOKEN_SIZE, MAGIC_LINK_VALIDITY_HOURS } from '../../utils/constants';

const router = Router();

/**
 * Request a magic link for passwordless authentication
 * POST /api/auth/magic-link
 */
router.post('/auth/magic-link', async (req: Request, res: Response) => {
    const { email } = req.body;
    const timeStamp: string = new Date().toISOString();

    // Validate email
    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            error: 'Email is required',
            code: 'MISSING_FIELDS'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format',
            code: 'INVALID_EMAIL'
        });
    }

    try {
        let user: IUser | null = await User.findByEmail(email);
        let isNewUser = false;

        if (!user) {
            // Generate a unique username based on email
            const emailPrefix = email.split('@')[0];
            let username = emailPrefix.toLowerCase();

            // Check if username exists, if so add random numbers
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                username = `${username}${Math.floor(Math.random() * 1000)}`;
            }

            // If user doesn't exist, create a new user
            user = new User({
                email,
                username,
                firstName: 'Guest',
                isVerified: false // Start as unverified
            }) as IUser;

            isNewUser = true;
        }

        // Generate a unique token and set its expiration
        const tempToken: string = crypto
            .randomBytes(TOKEN_SIZE)
            .toString('hex');
        const tempTokenExpires: Date = new Date(
            Date.now() + MAGIC_LINK_VALIDITY_HOURS * 60 * 60 * 1000
        );

        user.tempToken = tempToken;
        user.tempTokenExpires = tempTokenExpires;
        await user.save();

        // Send the magic link email
        const magicLink: string = `${API_URL}/api/auth/magic-verify?token=${tempToken}`;

        const emailSubject = isNewUser
            ? "Dereck's Notes | Welcome & Sign In"
            : "Dereck's Notes | Magic Link";

        const emailContent = isNewUser
            ? `
            <h2>Welcome to Dereck's Notes!</h2>
            <p>An account has been created for you. Click the following link to sign in:</p>
            <p><a href="${magicLink}">${magicLink}</a></p>
            <p>This link will expire in ${MAGIC_LINK_VALIDITY_HOURS} hours.</p>
            <p>After signing in, you can update your profile information.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Timestamp: ${timeStamp}</p>
            `
            : `
            <h2>Magic Link Sign In</h2>
            <p>Click the following link to sign in:</p>
            <p><a href="${magicLink}">${magicLink}</a></p>
            <p>This link will expire in ${MAGIC_LINK_VALIDITY_HOURS} hours.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Timestamp: ${timeStamp}</p>
            `;

        await sendEmail(email, emailSubject, emailContent);

        res.json({
            message: 'Magic link sent to your email',
            isNewUser,
            timestamp: timeStamp
        });
    } catch (error) {
        console.error('Error sending magic link:', error);
        res.status(500).json({
            error: 'An error occurred while sending magic link',
            code: 'SERVER_ERROR'
        });
    }
});

/**
 * Verify a magic link token
 * GET /api/auth/magic-verify
 */
router.get('/auth/magic-verify', async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
        });
    }

    try {
        const user = await User.findByTempToken(token);

        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired token',
                code: 'INVALID_TOKEN'
            });
        }

        // Clear the temp token
        user.tempToken = undefined;
        user.tempTokenExpires = undefined;

        // Mark the user as verified
        user.isVerified = true;

        // Update last login time
        user.lastLogin = new Date();

        await user.save();

        // Create session
        req.session.userId = user._id;

        // Redirect to profile page
        // Use 302 redirect so browsers follow it
        res.redirect(302, `${API_URL}/profile?magic=success`);
    } catch (error) {
        console.error('Error verifying magic link:', error);
        res.status(500).json({
            error: 'An error occurred while verifying magic link',
            code: 'SERVER_ERROR'
        });
    }
});

export default router;
