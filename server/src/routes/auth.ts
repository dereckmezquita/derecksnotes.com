import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import { authLimiter } from '@middleware/rateLimit';
import * as authService from '@services/auth';
import * as userService from '@services/users';
import * as auditService from '@services/audit';
import { config } from '@lib/env';
import { db, schema } from '@db/index';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Precomputed dummy bcrypt hash, run on every failed login when the user
// doesn't exist. Without this, the absence of a bcrypt round on the
// missing-user branch is a measurable timing oracle for enumeration. Cost
// matches production registrations (services/auth.ts SALT_ROUNDS = 12).
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
  'login-enumeration-defense-placeholder',
  12
);

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

      // Username enumeration is acceptable here: usernames are publicly listed
      // on profile pages (/profile/[username]) and on comment authorship, so
      // hiding the conflict on /register would not actually hide membership.
      if (!(await userService.isUsernameAvailable(username))) {
        res.status(409).json({ error: 'Username already taken' });
        return;
      }

      // Email is NOT publicly enumerable, so don't leak it. Without a real
      // email-confirmation flow we can't do the full Mozilla send-on-conflict
      // pattern; the next-best defence is to refuse with a generic message
      // that does not distinguish "email in use" from any other server-side
      // rejection. TODO: when an email sender is wired up, switch to 202 +
      // queued conflict email and identical response to the success path.
      if (email) {
        const existingEmail = await db.query.users.findFirst({
          where: eq(schema.users.email, email)
        });
        if (existingEmail) {
          res.status(409).json({
            error: 'Registration cannot be completed with the provided details.'
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

      // I4: forensic trail for auth events. adminId on the audit row is
      // overloaded to mean "actor" — column rename is out of scope here.
      await auditService.logAuditAction(
        user.id,
        'auth.register',
        'user',
        user.id,
        { username: user.username, hadEmail: !!email },
        req.ip
      );

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

    // Always run bcrypt.compare — against the real hash if the user exists,
    // against a precomputed dummy otherwise. This removes the timing oracle
    // (no-bcrypt-on-missing-user → ~100 ms faster response) that lets an
    // attacker enumerate registered usernames without ever guessing a password.
    const hashToCheck = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const valid = await bcrypt.compare(password, hashToCheck);
    if (!user || !valid) {
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

    await auditService.logAuditAction(
      user.id,
      'auth.login',
      'session',
      session.id,
      undefined,
      req.ip
    );

    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// I12: logout MUST be idempotent from the client's perspective. Don't gate
// on a live session — an already-expired cookie should still clear cleanly
// (otherwise a perfectly reasonable client action surfaces an error).
router.post('/logout', async (req: AuthenticatedRequest, res) => {
  try {
    const token = req.cookies?.sessionId;
    if (token) {
      const tokenHash = authService.hashSessionToken(token);
      const session = await db.query.sessions.findFirst({
        where: eq(schema.sessions.tokenHash, tokenHash)
      });
      if (session) {
        await authService.revokeSession(session.id);
        await auditService.logAuditAction(
          session.userId,
          'auth.logout',
          'session',
          session.id,
          undefined,
          req.ip
        );
      }
    }
    res.clearCookie('sessionId');
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Even on internal error, the cookie still gets cleared client-side.
    res.clearCookie('sessionId');
    res.json({ success: true });
  }
});

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
