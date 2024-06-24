import type { Request, Response, NextFunction } from 'express';
import { User } from '../db/models/User';

async function isAuth(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            ok: false,
            msg: 'Not authenticated'
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Not authenticated'
            });
        }

        req.user = user;
        next();
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });
    }
}
