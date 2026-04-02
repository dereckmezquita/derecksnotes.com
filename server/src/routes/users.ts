import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import * as userService from '@services/users';
import * as authService from '@services/auth';

const router = Router();

router.get('/:username', async (req: AuthenticatedRequest, res) => {
    const user = await userService.findUserByUsername(req.params.username);
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
});

router.patch('/me', authenticate(), async (req: AuthenticatedRequest, res) => {
    const parsed = z
        .object({
            displayName: z.string().min(1).max(50).optional(),
            bio: z.string().max(500).optional(),
            avatarUrl: z.string().url().nullable().optional()
        })
        .safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            error: 'Validation failed',
            details: parsed.error.issues
        });
        return;
    }

    const updated = await userService.updateProfile(req.user!.id, parsed.data);
    res.json({
        id: updated!.id,
        username: updated!.username,
        displayName: updated!.displayName,
        bio: updated!.bio,
        avatarUrl: updated!.avatarUrl
    });
});

router.patch(
    '/me/username',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
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

        if (!(await userService.isUsernameAvailable(parsed.data.username))) {
            res.status(409).json({ error: 'Username already taken' });
            return;
        }

        await userService.changeUsername(req.user!.id, parsed.data.username);
        res.json({ success: true, username: parsed.data.username });
    }
);

router.post(
    '/me/password',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        const parsed = z
            .object({
                currentPassword: z.string().min(1),
                newPassword: z
                    .string()
                    .min(8)
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
            res.status(401).json({ error: 'Current password is incorrect' });
            return;
        }

        const hash = await authService.hashPassword(parsed.data.newPassword);
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
            secure: req.secure,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true });
    }
);

router.delete('/me', authenticate(), async (req: AuthenticatedRequest, res) => {
    await userService.softDeleteUser(req.user!.id);
    await authService.revokeAllSessions(req.user!.id);
    res.clearCookie('sessionId');
    res.json({ success: true });
});

router.get(
    '/me/comments',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
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
    }
);

router.post(
    '/me/comments/bulk-delete',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        const parsed = z
            .object({ commentIds: z.array(z.string().uuid()) })
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
    }
);

router.get(
    '/me/read-history',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
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
    }
);

export default router;
