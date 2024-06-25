import express, { type Request, type Response } from 'express';
import { authMiddleware } from '../../middleware/isAuth';

const router = express.Router();

router.get('/auth/protected', authMiddleware, (req: Request, res: Response) => {
    res.json({
        message: 'This is a protected route',
        userId: req.session.userId
    });
});

export default router;
