import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';

import { User, type IUser } from '../../db/models/User';
import { sendEmail } from '../../utils/sendEmail';
import { BASE_URL_SERVER, BASE_URL_CLIENT } from '../../utils/env';
import {
    SINGLE_HOUR,
    TOKEN_SIZE,
    EMAIL_VERIFICATION_VALIDITY_DAYS,
    PASSWORD_RESET_VALIDITY_HOURS,
    MAX_LOGIN_ATTEMPTS
} from '../../utils/constants';

const router = Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/auth/register', async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password } = req.body;
    const timeStamp: string = new Date().toISOString();

    try {
        // Validate request body
        if (!firstName || !username || !email || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                code: 'MISSING_FIELDS',
                fields: ['firstName', 'username', 'email', 'password']
            });
        }

        // Check if email or username already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({
                error: `User with this ${field} already exists`,
                code: 'USER_EXISTS',
                field
            });
        }

        // Check password strength (basic validation)
        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long',
                code: 'WEAK_PASSWORD'
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password,
            isVerified: false
        });

        // Generate verification token
        const verificationToken = crypto
            .randomBytes(TOKEN_SIZE)
            .toString('hex');
        const verificationTokenExpires = new Date(
            Date.now() + EMAIL_VERIFICATION_VALIDITY_DAYS * 24 * 60 * 60 * 1000
        );

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        // Send verification email
        const verificationLink = `${BASE_URL_SERVER}/auth/verify-email?token=${verificationToken}`;
        await sendEmail(
            email,
            "Dereck's Notes | Verify Your Email",
            `
            <h2>Welcome to Dereck's Notes!</h2>
            <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>This link will expire in ${EMAIL_VERIFICATION_VALIDITY_DAYS} days.</p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
            <p>Timestamp: ${timeStamp}</p>
            `
        );

        res.status(201).json({
            message: 'User registered successfully, verification email sent',
            timestamp: timeStamp
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            error: 'An error occurred during registration',
            code: 'SERVER_ERROR'
        });
    }
});

/**
 * Verify a user's email address
 * GET /api/auth/verify-email
 */
router.get('/auth/verify-email', async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
        });
    }

    try {
        const user = await User.findByVerificationToken(token);

        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired verification token',
                code: 'INVALID_TOKEN'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        // Automatically log the user in
        req.session.userId = user._id;

        // Redirect to profile page
        res.redirect(`${BASE_URL_CLIENT}/profile?verified=true`);
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({
            error: 'An error occurred during email verification',
            code: 'SERVER_ERROR'
        });
    }
});

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
router.post(
    '/auth/resend-verification',
    async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email is required',
                code: 'MISSING_FIELDS'
            });
        }

        try {
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                    code: 'USER_NOT_FOUND'
                });
            }

            if (user.isVerified) {
                return res.status(400).json({
                    error: 'Email already verified',
                    code: 'ALREADY_VERIFIED'
                });
            }

            // Generate new verification token
            const verificationToken = crypto
                .randomBytes(TOKEN_SIZE)
                .toString('hex');
            const verificationTokenExpires = new Date(
                Date.now() +
                    EMAIL_VERIFICATION_VALIDITY_DAYS * 24 * 60 * 60 * 1000
            );

            user.verificationToken = verificationToken;
            user.verificationTokenExpires = verificationTokenExpires;
            await user.save();

            // Send verification email
            const verificationLink = `${BASE_URL_SERVER}/auth/verify-email?token=${verificationToken}`;
            await sendEmail(
                email,
                "Dereck's Notes | Verify Your Email",
                `
            <h2>Email Verification</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>This link will expire in ${EMAIL_VERIFICATION_VALIDITY_DAYS} days.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            `
            );

            res.json({
                message: 'Verification email sent',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error resending verification email:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * User login with password
 * POST /api/auth/login
 */
router.post('/auth/login', async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    try {
        // Validate request
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required',
                code: 'MISSING_FIELDS'
            });
        }

        // Find user by email with password field included
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            '+password'
        );

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Check if account is locked
        if (user.isLocked()) {
            return res.status(401).json({
                error: 'Account is temporarily locked due to too many failed attempts',
                code: 'ACCOUNT_LOCKED',
                lockUntil: user.lockUntil
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Increment login attempts on failure
            await user.incrementLoginAttempts();

            // Check if we just locked the account
            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                return res.status(401).json({
                    error: 'Account is temporarily locked due to too many failed attempts',
                    code: 'ACCOUNT_LOCKED',
                    lockUntil: user.lockUntil
                });
            }

            return res.status(401).json({
                error: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS',
                attemptsLeft: MAX_LOGIN_ATTEMPTS - user.loginAttempts
            });
        }

        // Reset login attempts on successful login
        user.lastLogin = new Date();
        await user.resetLoginAttempts();

        // Set session
        req.session.userId = user._id;

        // Set cookie expiration for "remember me"
        if (rememberMe) {
            req.session.cookie.maxAge = 90 * 24 * 60 * 60 * 1000; // 90 days
        }

        return req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({
                    error: 'An error occurred during login',
                    code: 'SERVER_ERROR'
                });
            }

            console.log('Session saved with ID:', req.sessionID);
            console.log('Session data:', req.session);

            // Return user information (exclude sensitive fields)
            res.json({
                message: 'Logged in successfully',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified,
                    profilePhoto: user.profilePhoto,
                    role: user.role
                }
            });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            error: 'An error occurred during login',
            code: 'SERVER_ERROR'
        });
    }
});

/**
 * User logout
 * POST /api/auth/logout
 */
router.post('/auth/logout', (req: Request, res: Response) => {
    if (!req.session.userId) {
        return res.status(400).json({
            error: 'Not logged in',
            code: 'NOT_LOGGED_IN'
        });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({
                error: 'An error occurred during logout',
                code: 'SERVER_ERROR'
            });
        }

        // Clear cookies - use the correct cookie name
        res.clearCookie('derecksnotes.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

/**
 * Request password reset
 * POST /api/auth/reset-password-request
 */
router.post(
    '/auth/reset-password-request',
    async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email is required',
                code: 'MISSING_FIELDS'
            });
        }

        try {
            const user = await User.findByEmail(email);

            // Don't reveal if the user exists or not (security best practice)
            if (!user) {
                return res.json({
                    message:
                        'If your email is registered, you will receive a password reset link'
                });
            }

            // Generate a password reset token
            const resetToken = crypto.randomBytes(TOKEN_SIZE).toString('hex');
            const resetTokenExpires = new Date(
                Date.now() + SINGLE_HOUR * PASSWORD_RESET_VALIDITY_HOURS
            );

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpires;
            await user.save();

            // Send password reset email
            const resetUrl = `${BASE_URL_CLIENT}/reset-password/${resetToken}`;
            await sendEmail(
                email,
                "Dereck's Notes | Password Reset",
                `
            <h2>Password Reset Request</h2>
            <p>You are receiving this because you (or someone else) have requested to reset the password for your account.</p>
            <p>Please click on the following link to complete the process:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in ${PASSWORD_RESET_VALIDITY_HOURS} hour(s).</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
            );

            res.json({
                message:
                    'If your email is registered, you will receive a password reset link'
            });
        } catch (error) {
            console.error('Error during password reset request:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
router.post('/auth/reset-password', async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            error: 'Token and new password are required',
            code: 'MISSING_FIELDS'
        });
    }

    // Password strength validation
    if (newPassword.length < 8) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long',
            code: 'WEAK_PASSWORD'
        });
    }

    try {
        const user = await User.findByResetPasswordToken(token);

        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired reset token',
                code: 'INVALID_TOKEN'
            });
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Reset login attempts
        user.loginAttempts = 0;
        user.lockUntil = undefined;

        await user.save();

        // Auto login after password reset
        req.session.userId = user._id;

        res.json({
            message: 'Password has been reset successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                profilePhoto: user.profilePhoto,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            error: 'An error occurred',
            code: 'SERVER_ERROR'
        });
    }
});

/**
 * Change password (authenticated route)
 * POST /api/auth/change-password
 */
router.post('/auth/change-password', async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
        });
    }

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            error: 'Current password and new password are required',
            code: 'MISSING_FIELDS'
        });
    }

    // Password strength validation
    if (newPassword.length < 8) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long',
            code: 'WEAK_PASSWORD'
        });
    }

    try {
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Current password is incorrect',
                code: 'INVALID_PASSWORD'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            error: 'An error occurred',
            code: 'SERVER_ERROR'
        });
    }
});

export default router;
