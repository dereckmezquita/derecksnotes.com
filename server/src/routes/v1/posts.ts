import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '@db/index';
import { eq, and, count, sql } from 'drizzle-orm';
import { authenticate, optionalAuth } from '@middleware/auth';
import type { AuthenticatedRequest } from '@/types';
import { dbLogger } from '@services/logger';

const router = Router();

// Bot detection patterns
const BOT_PATTERNS = [
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /baidu/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /slurp/i,
    /duckduckbot/i,
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
];

function isBot(userAgent: string): boolean {
    return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// Helper function to get or create a post
export async function getOrCreatePost(
    slug: string,
    title: string
): Promise<string> {
    // Try to find existing post
    const existing = await db.query.posts.findFirst({
        where: eq(schema.posts.slug, slug)
    });

    if (existing) {
        return existing.id;
    }

    // Create new post
    const postId = crypto.randomUUID();
    await db.insert(schema.posts).values({
        id: postId,
        slug,
        title
    });

    return postId;
}

// Validation schemas
const recordViewSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().min(1, 'Title is required'),
    referrer: z.string().optional()
});

const updateViewSchema = z.object({
    duration: z.number().int().min(0).optional(),
    scrollDepth: z.number().int().min(0).max(100).optional(),
    exitedAt: z.string().datetime().optional()
});

const reactSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['like', 'dislike'])
});

const removeReactionSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().min(1, 'Title is required')
});

// POST /api/v1/posts/view - Record a page view
router.post(
    '/view',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = recordViewSchema.parse(req.body);
            const userAgent = req.headers['user-agent'] || 'Unknown';
            const ipAddress =
                (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                req.ip ||
                'Unknown';

            // Get or create the post
            const postId = await getOrCreatePost(data.slug, data.title);

            // Create page view record
            const viewId = crypto.randomUUID();
            await db.insert(schema.pageViews).values({
                id: viewId,
                postId,
                ipAddress,
                userAgent,
                referrer: data.referrer || null,
                sessionId: req.sessionId || null,
                userId: req.user?.id || null,
                isBot: isBot(userAgent)
            });

            res.status(201).json({ viewId });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Record view failed', error as Error, {
                source: 'posts'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// PATCH /api/v1/posts/view/:viewId - Update a page view (heartbeat/exit)
router.patch(
    '/view/:viewId',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const viewId = req.params.viewId as string;
            const data = updateViewSchema.parse(req.body);

            // Verify view exists
            const view = await db.query.pageViews.findFirst({
                where: eq(schema.pageViews.id, viewId)
            });

            if (!view) {
                res.status(404).json({ error: 'View not found' });
                return;
            }

            // Update view with new data
            const updateData: Record<string, unknown> = {};
            if (data.duration !== undefined) {
                updateData.duration = data.duration;
            }
            if (data.scrollDepth !== undefined) {
                updateData.scrollDepth = data.scrollDepth;
            }
            if (data.exitedAt !== undefined) {
                updateData.exitedAt = new Date(data.exitedAt);
            }

            if (Object.keys(updateData).length > 0) {
                await db
                    .update(schema.pageViews)
                    .set(updateData)
                    .where(eq(schema.pageViews.id, viewId));
            }

            res.json({ success: true });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Update view failed', error as Error, {
                source: 'posts'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/posts/react - Add or change reaction to a post
router.post(
    '/react',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = reactSchema.parse(req.body);

            // Get or create the post
            const postId = await getOrCreatePost(data.slug, data.title);

            // Check for existing reaction
            const existingReaction = await db.query.postReactions.findFirst({
                where: and(
                    eq(schema.postReactions.postId, postId),
                    eq(schema.postReactions.userId, req.user!.id)
                )
            });

            if (existingReaction) {
                if (existingReaction.type === data.type) {
                    // Same type - remove reaction (toggle off)
                    await db
                        .delete(schema.postReactions)
                        .where(
                            eq(schema.postReactions.id, existingReaction.id)
                        );
                } else {
                    // Different type - update reaction
                    await db
                        .update(schema.postReactions)
                        .set({ type: data.type, createdAt: new Date() })
                        .where(
                            eq(schema.postReactions.id, existingReaction.id)
                        );
                }
            } else {
                // Create new reaction
                await db.insert(schema.postReactions).values({
                    id: crypto.randomUUID(),
                    postId,
                    userId: req.user!.id,
                    type: data.type
                });
            }

            // Get updated counts
            const stats = await getPostReactionStats(postId, req.user!.id);

            res.json(stats);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('React to post failed', error as Error, {
                source: 'posts'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/posts/react - Remove reaction from a post
router.delete(
    '/react',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = removeReactionSchema.parse(req.body);

            // Get or create the post
            const postId = await getOrCreatePost(data.slug, data.title);

            // Delete existing reaction if any
            await db
                .delete(schema.postReactions)
                .where(
                    and(
                        eq(schema.postReactions.postId, postId),
                        eq(schema.postReactions.userId, req.user!.id)
                    )
                );

            // Get updated counts
            const stats = await getPostReactionStats(postId, req.user!.id);

            res.json(stats);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Remove post reaction failed', error as Error, {
                source: 'posts'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/posts/stats - Get stats for a post by slug
router.get(
    '/stats',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const slug = req.query.slug as string;

            if (!slug) {
                res.status(400).json({
                    error: 'Slug query parameter is required'
                });
                return;
            }

            // Find the post
            const post = await db.query.posts.findFirst({
                where: eq(schema.posts.slug, slug)
            });

            if (!post) {
                // Post doesn't exist yet - return zeros
                res.json({
                    views: 0,
                    uniqueVisitors: 0,
                    likes: 0,
                    dislikes: 0,
                    userReaction: null,
                    avgDuration: null,
                    avgScrollDepth: null
                });
                return;
            }

            // Get view stats
            const viewStats = await db
                .select({
                    totalViews: count(),
                    uniqueVisitors: sql<number>`COUNT(DISTINCT ${schema.pageViews.ipAddress})`,
                    avgDuration: sql<number>`AVG(${schema.pageViews.duration})`,
                    avgScrollDepth: sql<number>`AVG(${schema.pageViews.scrollDepth})`
                })
                .from(schema.pageViews)
                .where(
                    and(
                        eq(schema.pageViews.postId, post.id),
                        eq(schema.pageViews.isBot, false)
                    )
                );

            // Get reaction counts
            const reactionStats = await getPostReactionStats(
                post.id,
                req.user?.id
            );

            res.json({
                views: viewStats[0]?.totalViews ?? 0,
                uniqueVisitors: viewStats[0]?.uniqueVisitors ?? 0,
                likes: reactionStats.likes,
                dislikes: reactionStats.dislikes,
                userReaction: reactionStats.userReaction,
                avgDuration: viewStats[0]?.avgDuration
                    ? Math.round(viewStats[0].avgDuration)
                    : null,
                avgScrollDepth: viewStats[0]?.avgScrollDepth
                    ? Math.round(viewStats[0].avgScrollDepth)
                    : null
            });
        } catch (error) {
            dbLogger.error('Get post stats failed', error as Error, {
                source: 'posts'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Helper function to get reaction stats for a post - single optimized query
async function getPostReactionStats(
    postId: string,
    userId?: string
): Promise<{
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}> {
    // Single query to get both counts and user's reaction
    const result = await db
        .select({
            likes: sql<number>`SUM(CASE WHEN ${schema.postReactions.type} = 'like' THEN 1 ELSE 0 END)`,
            dislikes: sql<number>`SUM(CASE WHEN ${schema.postReactions.type} = 'dislike' THEN 1 ELSE 0 END)`,
            userReaction: userId
                ? sql<string>`MAX(CASE WHEN ${schema.postReactions.userId} = ${userId} THEN ${schema.postReactions.type} END)`
                : sql<null>`NULL`
        })
        .from(schema.postReactions)
        .where(eq(schema.postReactions.postId, postId));

    return {
        likes: result[0]?.likes ?? 0,
        dislikes: result[0]?.dislikes ?? 0,
        userReaction: (result[0]?.userReaction as 'like' | 'dislike') || null
    };
}

export default router;
