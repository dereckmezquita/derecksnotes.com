import { Router } from 'express';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import { adminWriteLimiter } from '@middleware/rateLimit';

import dashboardRouter from './dashboard';
import commentsRouter from './comments';
import usersRouter from './users';
import auditRouter from './audit';
import reportsRouter from './reports';
import notificationsRouter from './notifications';

/**
 * /api/v1/admin composite router. Cross-cutting concerns (authentication +
 * the admin-tighter rate limit) apply ONCE here, then each sub-router
 * declares its own permission gate via requirePermission(). Order matters:
 * the global error handler at the bottom catches anything a sub-router
 * forgot to handle locally.
 */
const router = Router();

router.use(authenticate());
router.use(adminWriteLimiter);

router.use(dashboardRouter);
router.use(commentsRouter);
router.use(usersRouter);
router.use(auditRouter);
router.use(reportsRouter);
router.use(notificationsRouter);

router.use(
  (
    err: Error,
    _req: AuthenticatedRequest,
    res: import('express').Response,
    _next: import('express').NextFunction
  ) => {
    console.error('Admin route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default router;
