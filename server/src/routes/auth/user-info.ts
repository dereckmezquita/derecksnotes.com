import { Router, type Request, type Response } from 'express';
import { User, type IUser } from '../../db/models/User';
import { Comment, type IComment } from '../../db/models/Comment';

import { authMiddleware } from '../../middleware/isAuth';

const router = Router();

router.get(
    '/auth/user-info',
    authMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.session.userId;

        try {
            const user: IUser | null = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            res.json({
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
            console.error('Error getting user info:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
);

export default router;
