import { Router, type Request, type Response } from 'express';
import { User, type IUser } from '../../db/models/User';

const router = Router();

router.get('/auth/validate-session', async (req: Request, res: Response) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.json({ message: 'Session is valid' });
    } catch (error) {
        console.error('Error validating session:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
