import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import commentRoutes from './comments';
import postRoutes from './posts';
import adminRoutes from './admin';
import searchRoutes from './search';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);
router.use('/posts', postRoutes);
router.use('/admin', adminRoutes);
router.use('/search', searchRoutes);

export default router;
