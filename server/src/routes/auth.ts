import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import { authLimiter } from '@middleware/rateLimit';
import * as authService from '@services/auth';
import * as userService from '@services/users';
import { config } from '@lib/env';
import { db, schema } from '@db/index';
import { eq, desc } from 'drizzle-orm';

const router = Router();

const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  email: z.string().email().optional()
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

router.post(
  '/register',
  authLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }

      const { username, password, email } = parsed.data;

      if (!(await userService.isUsernameAvailable(username))) {
        res.status(409).json({ error: 'Username already taken' });
        return;
      }

      if (email) {
        const existingEmail = await db.query.users.findFirst({
          where: eq(schema.users.email, email)
        });
        if (existingEmail) {
          res.status(409).json({
            error: 'Email already registered'
          });
          return;
        }
      }

      const user = await userService.createUser({
        username,
        password,
        email
      });

      const session = await authService.createSession(
        user.id,
        req.headers['user-agent'],
        req.ip
      );

      res.cookie('sessionId', session.token, {
        httpOnly: true,
        secure: config.secureCookies,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post('/login', authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues
      });
      return;
    }

    const { username, password } = parsed.data;
    const user = await userService.findUserByUsername(username);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await authService.verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const session = await authService.createSession(
      user.id,
      req.headers['user-agent'],
      req.ip
    );

    res.cookie('sessionId', session.token, {
      httpOnly: true,
      secure: config.secureCookies,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/logout',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      if (req.sessionId) {
        await authService.revokeSession(req.sessionId);
      }
      res.clearCookie('sessionId');
      res.json({ success: true });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/me', authenticate(), async (req: AuthenticatedRequest, res) => {
  try {
    const user = await authService.getUserWithGroupsAndPermissions(
      req.user!.id
    );
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(
  '/sessions',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const sessions = await db.query.sessions.findMany({
        where: eq(schema.sessions.userId, req.user!.id),
        orderBy: [desc(schema.sessions.createdAt)]
      });

      res.json(
        sessions.map((s) => ({
          id: s.id,
          userAgent: s.userAgent,
          ipAddress: s.ipAddress,
          createdAt: s.createdAt,
          expiresAt: s.expiresAt,
          isCurrent: s.id === req.sessionId
        }))
      );
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/sessions/:id',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = z.string().uuid().safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid session ID format'
        });
        return;
      }

      const session = await db.query.sessions.findFirst({
        where: eq(schema.sessions.id, idParsed.data)
      });

      if (!session || session.userId !== req.user!.id) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      await authService.revokeSession(session.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete session error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/sessions',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      await authService.revokeAllSessions(req.user!.id);
      res.clearCookie('sessionId');
      res.json({ success: true });
    } catch (error) {
      console.error('Delete all sessions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Global error handler for auth routes
router.use(
  (
    err: Error,
    _req: AuthenticatedRequest,
    res: import('express').Response,
    _next: import('express').NextFunction
  ) => {
    console.error('Auth route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default router;
