import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { db, schema } from '../../db';
import { eq, and, isNull } from 'drizzle-orm';
import {
    hashPassword,
    verifyPassword,
    createSession,
    revokeSession,
    revokeAllSessions,
    getUserSessions,
    getCookieOptions,
    elevateToAdminIfConfigured
} from '../../services/auth';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimit';
import type { AuthenticatedRequest } from '../../types';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'Username can only contain letters, numbers, underscores, and hyphens'
        ),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    email: z.string().email('Invalid email address').optional()
});

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

// POST /api/v1/auth/register
router.post(
    '/register',
    authLimiter,
    async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('[Register] Starting registration...');
            const data = registerSchema.parse(req.body);
            console.log(
                '[Register] Validated input for username:',
                data.username
            );

            // Check if username exists
            const existingUser = await db.query.users.findFirst({
                where: eq(schema.users.username, data.username)
            });

            if (existingUser) {
                res.status(409).json({ error: 'Username already taken' });
                return;
            }

            // Check if email exists (if provided)
            if (data.email) {
                const existingEmail = await db.query.users.findFirst({
                    where: eq(schema.users.email, data.email)
                });

                if (existingEmail) {
                    res.status(409).json({ error: 'Email already registered' });
                    return;
                }
            }

            // Create user
            console.log('[Register] Creating user...');
            const userId = crypto.randomUUID();
            const passwordHash = await hashPassword(data.password);
            console.log('[Register] Password hashed');

            await db.insert(schema.users).values({
                id: userId,
                username: data.username,
                email: data.email || null,
                passwordHash,
                displayName: data.username
            });
            console.log('[Register] User inserted into database');

            // Assign default group
            console.log('[Register] Finding default group...');
            const defaultGroup = await db.query.groups.findFirst({
                where: eq(schema.groups.isDefault, true)
            });
            console.log('[Register] Default group:', defaultGroup?.name);

            if (defaultGroup) {
                await db.insert(schema.userGroups).values({
                    id: crypto.randomUUID(),
                    userId,
                    groupId: defaultGroup.id
                });
                console.log('[Register] User assigned to default group');
            }

            // Check if this user should be admin (matches ADMIN_USERNAME env var)
            console.log('[Register] Checking admin elevation...');
            await elevateToAdminIfConfigured(userId, data.username);

            // Create session
            console.log('[Register] Creating session...');
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            const sessionToken = await createSession(
                userId,
                userAgent,
                ipAddress
            );
            console.log('[Register] Session created');

            res.cookie('sessionId', sessionToken, getCookieOptions());

            console.log(
                '[Register] Registration successful for:',
                data.username
            );
            res.status(201).json({
                message: 'Registration successful',
                user: {
                    id: userId,
                    username: data.username
                }
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            console.error('[Register] ERROR:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/auth/login
router.post(
    '/login',
    authLimiter,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const data = loginSchema.parse(req.body);

            // Find user
            const user = await db.query.users.findFirst({
                where: and(
                    eq(schema.users.username, data.username),
                    isNull(schema.users.deletedAt)
                )
            });

            if (!user) {
                res.status(401).json({ error: 'Invalid username or password' });
                return;
            }

            // Verify password
            const valid = await verifyPassword(
                data.password,
                user.passwordHash
            );
            if (!valid) {
                res.status(401).json({ error: 'Invalid username or password' });
                return;
            }

            // Create session
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            const sessionToken = await createSession(
                user.id,
                userAgent,
                ipAddress
            );

            res.cookie('sessionId', sessionToken, getCookieOptions());

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/auth/logout
router.post(
    '/logout',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            // Revoke the current session
            if (req.sessionId) {
                await revokeSession(req.sessionId);
            }

            res.clearCookie('sessionId');

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/auth/me
router.get(
    '/me',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, req.user!.id),
                columns: {
                    id: true,
                    username: true,
                    email: true,
                    displayName: true,
                    bio: true,
                    avatarUrl: true,
                    emailVerified: true,
                    createdAt: true
                }
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Get user groups
            const userGroups = await db.query.userGroups.findMany({
                where: eq(schema.userGroups.userId, req.user!.id),
                with: {
                    group: true
                }
            });

            const groups = userGroups.map((ug) => ug.group.name);
            const permissions = Array.from(req.permissions || []);

            res.json({
                ...user,
                groups,
                permissions
            });
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/auth/sessions
router.get(
    '/sessions',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const sessions = await getUserSessions(req.user!.id);
            res.json({ sessions });
        } catch (error) {
            console.error('Get sessions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/auth/sessions/:id
router.delete(
    '/sessions/:id',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const sessionId = req.params.id as string;

            // Verify session belongs to user
            const session = await db.query.sessions.findFirst({
                where: eq(schema.sessions.id, sessionId)
            });

            if (!session || session.userId !== req.user!.id) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            await revokeSession(sessionId);
            res.json({ message: 'Session revoked' });
        } catch (error) {
            console.error('Revoke session error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/auth/sessions (logout everywhere)
router.delete(
    '/sessions',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            await revokeAllSessions(req.user!.id);

            res.clearCookie('sessionId');

            res.json({ message: 'All sessions revoked' });
        } catch (error) {
            console.error('Revoke all sessions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
