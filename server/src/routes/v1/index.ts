import { Router } from 'express';

import authRouter from './auth';
import usersRouter from './users';
import commentsRouter from './comments';
import reportsRouter from './reports';
import adminRouter from './admin';
import postsRouter from './posts';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);
router.use('/reports', reportsRouter);
router.use('/admin', adminRouter);
router.use('/posts', postsRouter);

export default router;
