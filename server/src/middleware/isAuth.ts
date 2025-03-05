import type { Request, Response, NextFunction } from 'express';
import { User } from '../db/models/User';

/**
 * Middleware to check if a user is authenticated through session
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('Auth middleware called');
    console.log('Session:', JSON.stringify(req.session));
    console.log('Cookies:', req.headers.cookie);

    const userId = req.session.userId;
    console.log('User ID from session:', userId);

    if (!userId) {
        console.log('No user ID found in session, returning 401');
        return res
            .status(401)
            .json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' });
    }

    try {
        const user = await User.findById(userId);
        console.log('User found:', user ? 'yes' : 'no');

        if (!user) {
            // Clear invalid session
            req.session.destroy((err) => {
                if (err)
                    console.error('Error destroying invalid session:', err);
            });
            return res
                .status(401)
                .json({ error: 'User not found', code: 'USER_NOT_FOUND' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({
            error: 'An error occurred',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Middleware to check if a user's email is verified
 */
export const isVerifiedMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || !req.user.isVerified) {
        return res.status(403).json({
            error: 'Email verification required',
            code: 'VERIFICATION_REQUIRED'
        });
    }
    next();
};

/**
 * Middleware to check if a user has admin privileges
 */
export const isAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Admin privileges required',
            code: 'ADMIN_REQUIRED'
        });
    }
    next();
};

/**
 * Combined middleware: Authentication + Email Verification
 */
export const isAuthAndVerifiedMiddleware = [
    authMiddleware,
    isVerifiedMiddleware
];
