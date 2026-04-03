import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import { profileLimiter } from '@middleware/rateLimit';
import * as userService from '@services/users';
import * as authService from '@services/auth';
import { config } from '@lib/env';

const router = Router();

const usernameParamSchema = z
    .string()
    .min(1)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/);

router.get('/:username', async (req: AuthenticatedRequest, res) => {
    try {
        const usernameParsed = usernameParamSchema.safeParse(
            req.params.username
        );
        if (!usernameParsed.success) {
            res.status(400).json({ error: 'Invalid username format' });
            return;
        }

        const user = await userService.findUserByUsername(usernameParsed.data);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/me', authenticate(), async (req: AuthenticatedRequest, res) => {
    try {
        const parsed = z
            .object({
                displayName: z.string().min(1).max(50).optional(),
                bio: z.string().max(500).optional(),
                avatarUrl: z.string().url().max(2048).nullable().optional()
            })
            .safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.issues
            });
            return;
        }

        const updated = await userService.updateProfile(
            req.user!.id,
            parsed.data
        );
        res.json({
            id: updated!.id,
            username: updated!.username,
            displayName: updated!.displayName,
            bio: updated!.bio,
            avatarUrl: updated!.avatarUrl
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch(
    '/me/username',
    authenticate(),
    profileLimiter,
    async (req: AuthenticatedRequest, res) => {
        try {
            const parsed = z
                .object({
                    username: z
                        .string()
                        .min(3)
                        .max(30)
                        .regex(/^[a-zA-Z0-9_-]+$/)
                })
                .safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: parsed.error.issues
                });
                return;
            }

            if (
                !(await userService.isUsernameAvailable(parsed.data.username))
            ) {
                res.status(409).json({ error: 'Username already taken' });
                return;
            }

            await userService.changeUsername(
                req.user!.id,
                parsed.data.username
            );
            res.json({ success: true, username: parsed.data.username });
        } catch (error) {
            console.error('Change username error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post(
    '/me/password',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        try {
            const parsed = z
                .object({
                    currentPassword: z.string().min(1).max(128),
                    newPassword: z
                        .string()
                        .min(8)
                        .max(128)
                        .regex(/[A-Z]/)
                        .regex(/[a-z]/)
                        .regex(/[0-9]/)
                })
                .safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: parsed.error.issues
                });
                return;
            }

            const user = await userService.findUserById(req.user!.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const valid = await authService.verifyPassword(
                parsed.data.currentPassword,
                user.passwordHash
            );
            if (!valid) {
                res.status(401).json({
                    error: 'Current password is incorrect'
                });
                return;
            }

            const hash = await authService.hashPassword(
                parsed.data.newPassword
            );
            await userService.changePassword(req.user!.id, hash);

            // Revoke all other sessions
            await authService.revokeAllSessions(req.user!.id);
            const session = await authService.createSession(
                req.user!.id,
                req.headers['user-agent'],
                req.ip
            );

            res.cookie('sessionId', session.token, {
                httpOnly: true,
                secure: config.secureCookies,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ success: true });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.delete('/me', authenticate(), async (req: AuthenticatedRequest, res) => {
    try {
        await userService.softDeleteUser(req.user!.id);
        await authService.revokeAllSessions(req.user!.id);
        res.clearCookie('sessionId');
        res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get(
    '/me/comments',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(
                50,
                Math.max(1, parseInt(req.query.limit as string) || 20)
            );

            const result = await userService.getUserComments(
                req.user!.id,
                page,
                limit
            );
            res.json({
                data: result.comments,
                page,
                limit,
                total: result.total,
                hasMore: page * limit < result.total
            });
        } catch (error) {
            console.error('Get user comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post(
    '/me/comments/bulk-delete',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        try {
            const parsed = z
                .object({
                    commentIds: z.array(z.string().uuid()).min(1).max(100)
                })
                .safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: parsed.error.issues
                });
                return;
            }

            const deleted = await userService.bulkDeleteComments(
                req.user!.id,
                parsed.data.commentIds
            );
            res.json({ success: true, deleted });
        } catch (error) {
            console.error('Bulk delete comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.get(
    '/me/read-history',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(
                50,
                Math.max(1, parseInt(req.query.limit as string) || 20)
            );

            const result = await userService.getReadHistory(
                req.user!.id,
                page,
                limit
            );
            res.json({
                data: result.entries,
                page,
                limit,
                total: result.total,
                hasMore: page * limit < result.total
            });
        } catch (error) {
            console.error('Get read history error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Global error handler for user routes
router.use(
    (
        err: Error,
        _req: AuthenticatedRequest,
        res: import('express').Response,
        _next: import('express').NextFunction
    ) => {
        console.error('User route error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
);

export default router;
