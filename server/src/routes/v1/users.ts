import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db, schema } from '../../db';
import { eq, and, isNull } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../middleware/auth';
import {
    hashPassword,
    verifyPassword,
    revokeAllSessions
} from '../../services/auth';
import type { AuthenticatedRequest } from '../../types';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
    displayName: z
        .string()
        .min(1, 'Display name cannot be empty')
        .max(50, 'Display name must be at most 50 characters')
        .optional(),
    bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
    avatarUrl: z.string().url('Invalid URL').optional().nullable()
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

// GET /api/v1/users/:username
router.get('/:username', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username } = req.params;

        const user = await db.query.users.findFirst({
            where: and(
                eq(schema.users.username, username),
                isNull(schema.users.deletedAt)
            ),
            columns: {
                id: true,
                username: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                createdAt: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/v1/users/me
router.patch(
    '/me',
    authenticate,
    requirePermission('user.edit.own'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = updateProfileSchema.parse(req.body);

            const updateData: Record<string, unknown> = {
                updatedAt: new Date()
            };

            if (data.displayName !== undefined) {
                updateData.displayName = data.displayName;
            }
            if (data.bio !== undefined) {
                updateData.bio = data.bio;
            }
            if (data.avatarUrl !== undefined) {
                updateData.avatarUrl = data.avatarUrl;
            }

            await db
                .update(schema.users)
                .set(updateData)
                .where(eq(schema.users.id, req.user!.id));

            const updatedUser = await db.query.users.findFirst({
                where: eq(schema.users.id, req.user!.id),
                columns: {
                    id: true,
                    username: true,
                    displayName: true,
                    bio: true,
                    avatarUrl: true
                }
            });

            res.json(updatedUser);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors
                });
                return;
            }
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/users/me/password
router.post(
    '/me/password',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = changePasswordSchema.parse(req.body);

            // Get current user
            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, req.user!.id)
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Verify current password
            const valid = await verifyPassword(
                data.currentPassword,
                user.passwordHash
            );
            if (!valid) {
                res.status(401).json({
                    error: 'Current password is incorrect'
                });
                return;
            }

            // Update password
            const newHash = await hashPassword(data.newPassword);
            await db
                .update(schema.users)
                .set({
                    passwordHash: newHash,
                    updatedAt: new Date()
                })
                .where(eq(schema.users.id, req.user!.id));

            // Revoke all other sessions for security
            await revokeAllSessions(req.user!.id);

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors
                });
                return;
            }
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/users/me (soft delete)
router.delete(
    '/me',
    authenticate,
    requirePermission('user.delete.own'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            // Soft delete user
            await db
                .update(schema.users)
                .set({
                    deletedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(schema.users.id, req.user!.id));

            // Revoke all sessions
            await revokeAllSessions(req.user!.id);

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });

            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error('Delete account error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
