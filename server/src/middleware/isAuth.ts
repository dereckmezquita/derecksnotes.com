import type { Request, Response, NextFunction } from 'express';
import { User } from '../db/models/User';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorised' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

export const isVerifiedMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user.isVerified) {
        return res.status(403).json({ error: 'User is not verified' });
    }
    next();
};

export const isAuthAndVerifiedMiddleware = [
    authMiddleware,
    isVerifiedMiddleware
];
