import { Router, type Response } from 'express';
import { db, schema } from '../../../db';
import { eq, and, gte, lte, sql, isNull, count, desc } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../../middleware/auth';
import type { AuthenticatedRequest } from '../../../types';

const router = Router();

// Helper to get start of day
function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Helper to add days
function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

// GET /api/v1/admin/analytics/overview
router.get(
    '/overview',
    authenticate,
    requirePermission('admin.dashboard'),
    async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const now = new Date();
            const thirtyDaysAgo = addDays(now, -30);
            const sevenDaysAgo = addDays(now, -7);

            // Total counts
            const totalUsers = await db
                .select({ count: count() })
                .from(schema.users)
                .where(isNull(schema.users.deletedAt));

            const totalComments = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(isNull(schema.comments.deletedAt));

            const totalReactions = await db
                .select({ count: count() })
                .from(schema.commentReactions);

            // New users in different periods
            const newUsersToday = await db
                .select({ count: count() })
                .from(schema.users)
                .where(
                    and(
                        gte(schema.users.createdAt, startOfDay(now)),
                        isNull(schema.users.deletedAt)
                    )
                );

            const newUsersWeek = await db
                .select({ count: count() })
                .from(schema.users)
                .where(
                    and(
                        gte(schema.users.createdAt, sevenDaysAgo),
                        isNull(schema.users.deletedAt)
                    )
                );

            const newUsersMonth = await db
                .select({ count: count() })
                .from(schema.users)
                .where(
                    and(
                        gte(schema.users.createdAt, thirtyDaysAgo),
                        isNull(schema.users.deletedAt)
                    )
                );

            // New comments in different periods
            const newCommentsToday = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, startOfDay(now)),
                        isNull(schema.comments.deletedAt)
                    )
                );

            const newCommentsWeek = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, sevenDaysAgo),
                        isNull(schema.comments.deletedAt)
                    )
                );

            const newCommentsMonth = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, thirtyDaysAgo),
                        isNull(schema.comments.deletedAt)
                    )
                );

            // Reactions this week
            const reactionsWeek = await db
                .select({ count: count() })
                .from(schema.commentReactions)
                .where(gte(schema.commentReactions.createdAt, sevenDaysAgo));

            // Approval rate (last 30 days)
            const approvedComments = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        eq(schema.comments.approved, true),
                        gte(schema.comments.createdAt, thirtyDaysAgo)
                    )
                );

            const allRecentComments = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(gte(schema.comments.createdAt, thirtyDaysAgo));

            const totalRecentCount = allRecentComments[0]?.count ?? 0;
            const approvedCount = approvedComments[0]?.count ?? 0;
            const approvalRate =
                totalRecentCount > 0
                    ? (approvedCount / totalRecentCount) * 100
                    : 0;

            res.json({
                totals: {
                    users: totalUsers[0]?.count || 0,
                    comments: totalComments[0]?.count || 0,
                    reactions: totalReactions[0]?.count || 0
                },
                users: {
                    today: newUsersToday[0]?.count || 0,
                    thisWeek: newUsersWeek[0]?.count || 0,
                    thisMonth: newUsersMonth[0]?.count || 0
                },
                comments: {
                    today: newCommentsToday[0]?.count || 0,
                    thisWeek: newCommentsWeek[0]?.count || 0,
                    thisMonth: newCommentsMonth[0]?.count || 0
                },
                engagement: {
                    reactionsThisWeek: reactionsWeek[0]?.count || 0,
                    approvalRate: Math.round(approvalRate * 10) / 10
                }
            });
        } catch (error) {
            console.error('Get analytics overview error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/timeseries?metric=users|comments|reactions&days=30
router.get(
    '/timeseries',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const metric = (req.query.metric as string) || 'comments';
            const days = Math.min(
                90,
                Math.max(7, parseInt(req.query.days as string) || 30)
            );

            if (!['users', 'comments', 'reactions'].includes(metric)) {
                res.status(400).json({
                    error: 'metric must be users, comments, or reactions'
                });
                return;
            }

            const now = new Date();
            const startDate = addDays(startOfDay(now), -days + 1);

            // Generate all dates in range
            const dates: Date[] = [];
            for (let i = 0; i < days; i++) {
                dates.push(addDays(startDate, i));
            }

            // Get counts for each day
            const data: Array<{ date: string; count: number }> = [];

            for (const date of dates) {
                const dayStart = startOfDay(date);
                const dayEnd = addDays(dayStart, 1);

                let countResult;

                if (metric === 'users') {
                    countResult = await db
                        .select({ count: count() })
                        .from(schema.users)
                        .where(
                            and(
                                gte(schema.users.createdAt, dayStart),
                                lte(schema.users.createdAt, dayEnd)
                            )
                        );
                } else if (metric === 'comments') {
                    countResult = await db
                        .select({ count: count() })
                        .from(schema.comments)
                        .where(
                            and(
                                gte(schema.comments.createdAt, dayStart),
                                lte(schema.comments.createdAt, dayEnd)
                            )
                        );
                } else {
                    countResult = await db
                        .select({ count: count() })
                        .from(schema.commentReactions)
                        .where(
                            and(
                                gte(
                                    schema.commentReactions.createdAt,
                                    dayStart
                                ),
                                lte(schema.commentReactions.createdAt, dayEnd)
                            )
                        );
                }

                data.push({
                    date: dayStart.toISOString().split('T')[0]!,
                    count: countResult[0]?.count || 0
                });
            }

            res.json({
                metric,
                days,
                data
            });
        } catch (error) {
            console.error('Get analytics timeseries error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/top-posts?days=30&limit=10
router.get(
    '/top-posts',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const days = Math.min(
                90,
                Math.max(7, parseInt(req.query.days as string) || 30)
            );
            const limit = Math.min(
                50,
                Math.max(5, parseInt(req.query.limit as string) || 10)
            );

            const startDate = addDays(new Date(), -days);

            // Get comment counts per post slug
            const postStats = await db
                .select({
                    postSlug: schema.comments.postSlug,
                    commentCount: count()
                })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, startDate),
                        isNull(schema.comments.deletedAt)
                    )
                )
                .groupBy(schema.comments.postSlug)
                .orderBy(sql`count(*) DESC`)
                .limit(limit);

            // Get reaction counts for each post
            const postsWithEngagement = await Promise.all(
                postStats.map(async (post) => {
                    // Get all comment IDs for this post
                    const postComments = await db.query.comments.findMany({
                        where: eq(schema.comments.postSlug, post.postSlug),
                        columns: { id: true }
                    });
                    const commentIds = postComments.map((c) => c.id);

                    // Count reactions for these comments
                    let reactionCount = 0;
                    let likeCount = 0;
                    let dislikeCount = 0;
                    if (commentIds.length > 0) {
                        const reactionsResult = await db
                            .select({ count: count() })
                            .from(schema.commentReactions)
                            .where(
                                sql`${schema.commentReactions.commentId} IN (${sql.join(
                                    commentIds.map((id) => sql`${id}`),
                                    sql`, `
                                )})`
                            );
                        reactionCount = reactionsResult[0]?.count || 0;

                        // Get like/dislike breakdown
                        const likesResult = await db
                            .select({ count: count() })
                            .from(schema.commentReactions)
                            .where(
                                and(
                                    sql`${schema.commentReactions.commentId} IN (${sql.join(
                                        commentIds.map((id) => sql`${id}`),
                                        sql`, `
                                    )})`,
                                    eq(schema.commentReactions.type, 'like')
                                )
                            );
                        likeCount = likesResult[0]?.count || 0;
                        dislikeCount = reactionCount - likeCount;
                    }

                    return {
                        postSlug: post.postSlug,
                        commentCount: post.commentCount,
                        reactionCount,
                        likeCount,
                        dislikeCount,
                        engagementScore: post.commentCount * 2 + reactionCount
                    };
                })
            );

            // Sort by engagement score
            postsWithEngagement.sort(
                (a, b) => b.engagementScore - a.engagementScore
            );

            res.json({
                days,
                posts: postsWithEngagement
            });
        } catch (error) {
            console.error('Get top posts error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/active-users?days=30&limit=10
router.get(
    '/active-users',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const days = Math.min(
                90,
                Math.max(7, parseInt(req.query.days as string) || 30)
            );
            const limit = Math.min(
                50,
                Math.max(5, parseInt(req.query.limit as string) || 10)
            );

            const startDate = addDays(new Date(), -days);

            // Get users with most comments in the period
            const activeUsers = await db
                .select({
                    userId: schema.comments.userId,
                    commentCount: count()
                })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, startDate),
                        isNull(schema.comments.deletedAt)
                    )
                )
                .groupBy(schema.comments.userId)
                .orderBy(sql`count(*) DESC`)
                .limit(limit);

            // Get user details and reaction counts
            const usersWithDetails = await Promise.all(
                activeUsers.map(async (userStat) => {
                    const user = await db.query.users.findFirst({
                        where: eq(schema.users.id, userStat.userId),
                        columns: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true
                        }
                    });

                    // Count reactions given by this user
                    const reactionsGiven = await db
                        .select({ count: count() })
                        .from(schema.commentReactions)
                        .where(
                            and(
                                eq(
                                    schema.commentReactions.userId,
                                    userStat.userId
                                ),
                                gte(
                                    schema.commentReactions.createdAt,
                                    startDate
                                )
                            )
                        );

                    // Count reactions received on their comments
                    const userComments = await db.query.comments.findMany({
                        where: and(
                            eq(schema.comments.userId, userStat.userId),
                            gte(schema.comments.createdAt, startDate)
                        ),
                        columns: { id: true }
                    });
                    const userCommentIds = userComments.map((c) => c.id);

                    let reactionsReceived = 0;
                    let likesReceived = 0;
                    if (userCommentIds.length > 0) {
                        const receivedResult = await db
                            .select({ count: count() })
                            .from(schema.commentReactions)
                            .where(
                                sql`${schema.commentReactions.commentId} IN (${sql.join(
                                    userCommentIds.map((id) => sql`${id}`),
                                    sql`, `
                                )})`
                            );
                        reactionsReceived = receivedResult[0]?.count || 0;

                        const likesResult = await db
                            .select({ count: count() })
                            .from(schema.commentReactions)
                            .where(
                                and(
                                    sql`${schema.commentReactions.commentId} IN (${sql.join(
                                        userCommentIds.map((id) => sql`${id}`),
                                        sql`, `
                                    )})`,
                                    eq(schema.commentReactions.type, 'like')
                                )
                            );
                        likesReceived = likesResult[0]?.count || 0;
                    }

                    return {
                        user: user || {
                            id: userStat.userId,
                            username: 'Unknown',
                            displayName: null,
                            avatarUrl: null
                        },
                        commentCount: userStat.commentCount,
                        reactionsGiven: reactionsGiven[0]?.count || 0,
                        reactionsReceived,
                        likesReceived,
                        activityScore:
                            userStat.commentCount * 2 +
                            (reactionsGiven[0]?.count || 0) +
                            likesReceived
                    };
                })
            );

            // Sort by activity score
            usersWithDetails.sort((a, b) => b.activityScore - a.activityScore);

            res.json({
                days,
                users: usersWithDetails
            });
        } catch (error) {
            console.error('Get active users error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/top-comments?days=30&limit=10
router.get(
    '/top-comments',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const days = Math.min(
                90,
                Math.max(7, parseInt(req.query.days as string) || 30)
            );
            const limit = Math.min(
                50,
                Math.max(5, parseInt(req.query.limit as string) || 10)
            );

            const startDate = addDays(new Date(), -days);

            // Get comments with their reaction counts
            const comments = await db.query.comments.findMany({
                where: and(
                    gte(schema.comments.createdAt, startDate),
                    isNull(schema.comments.deletedAt),
                    eq(schema.comments.approved, true)
                ),
                with: {
                    user: {
                        columns: {
                            id: true,
                            username: true,
                            displayName: true
                        }
                    }
                },
                orderBy: desc(schema.comments.createdAt),
                limit: 200 // Get more to filter by reactions
            });

            // Get reaction counts for each comment
            const commentsWithReactions = await Promise.all(
                comments.map(async (comment) => {
                    const reactions = await db
                        .select({
                            type: schema.commentReactions.type,
                            count: count()
                        })
                        .from(schema.commentReactions)
                        .where(
                            eq(schema.commentReactions.commentId, comment.id)
                        )
                        .groupBy(schema.commentReactions.type);

                    const likes =
                        reactions.find((r) => r.type === 'like')?.count || 0;
                    const dislikes =
                        reactions.find((r) => r.type === 'dislike')?.count || 0;

                    return {
                        id: comment.id,
                        content:
                            comment.content.substring(0, 150) +
                            (comment.content.length > 150 ? '...' : ''),
                        postSlug: comment.postSlug,
                        user: comment.user,
                        createdAt: comment.createdAt,
                        likes,
                        dislikes,
                        totalReactions: likes + dislikes,
                        score: likes - dislikes
                    };
                })
            );

            // Sort by likes and take top ones
            commentsWithReactions.sort((a, b) => b.likes - a.likes);
            const topLiked = commentsWithReactions.slice(0, limit);

            // Get most controversial (high total reactions, mixed sentiment)
            const controversial = [...commentsWithReactions]
                .filter((c) => c.totalReactions >= 2 && c.dislikes > 0)
                .sort((a, b) => {
                    // Controversial = high reactions + close to 50/50 split
                    const aRatio =
                        Math.min(a.likes, a.dislikes) /
                        Math.max(a.likes, a.dislikes, 1);
                    const bRatio =
                        Math.min(b.likes, b.dislikes) /
                        Math.max(b.likes, b.dislikes, 1);
                    return (
                        b.totalReactions * bRatio - a.totalReactions * aRatio
                    );
                })
                .slice(0, limit);

            res.json({
                days,
                topLiked,
                controversial
            });
        } catch (error) {
            console.error('Get top comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/engagement-trends?days=30
router.get(
    '/engagement-trends',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const days = Math.min(
                90,
                Math.max(7, parseInt(req.query.days as string) || 30)
            );

            const now = new Date();
            const startDate = addDays(now, -days);
            const previousPeriodStart = addDays(startDate, -days);

            // Current period stats
            const currentComments = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, startDate),
                        isNull(schema.comments.deletedAt)
                    )
                );

            const currentUsers = await db
                .select({ count: count() })
                .from(schema.users)
                .where(
                    and(
                        gte(schema.users.createdAt, startDate),
                        isNull(schema.users.deletedAt)
                    )
                );

            const currentReactions = await db
                .select({ count: count() })
                .from(schema.commentReactions)
                .where(gte(schema.commentReactions.createdAt, startDate));

            // Previous period stats
            const previousComments = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, previousPeriodStart),
                        lte(schema.comments.createdAt, startDate),
                        isNull(schema.comments.deletedAt)
                    )
                );

            const previousUsers = await db
                .select({ count: count() })
                .from(schema.users)
                .where(
                    and(
                        gte(schema.users.createdAt, previousPeriodStart),
                        lte(schema.users.createdAt, startDate),
                        isNull(schema.users.deletedAt)
                    )
                );

            const previousReactions = await db
                .select({ count: count() })
                .from(schema.commentReactions)
                .where(
                    and(
                        gte(
                            schema.commentReactions.createdAt,
                            previousPeriodStart
                        ),
                        lte(schema.commentReactions.createdAt, startDate)
                    )
                );

            // Calculate trends
            const calcTrend = (current: number, previous: number) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100);
            };

            const currComments = currentComments[0]?.count || 0;
            const prevComments = previousComments[0]?.count || 0;
            const currUsers = currentUsers[0]?.count || 0;
            const prevUsers = previousUsers[0]?.count || 0;
            const currReactions = currentReactions[0]?.count || 0;
            const prevReactions = previousReactions[0]?.count || 0;

            // Average comments per active day
            const daysWithComments = await db
                .select({
                    date: sql<string>`date(${schema.comments.createdAt})`,
                    count: count()
                })
                .from(schema.comments)
                .where(
                    and(
                        gte(schema.comments.createdAt, startDate),
                        isNull(schema.comments.deletedAt)
                    )
                )
                .groupBy(sql`date(${schema.comments.createdAt})`);

            const avgCommentsPerDay =
                daysWithComments.length > 0
                    ? Math.round(currComments / daysWithComments.length)
                    : 0;

            // Like/dislike ratio
            const likes = await db
                .select({ count: count() })
                .from(schema.commentReactions)
                .where(
                    and(
                        gte(schema.commentReactions.createdAt, startDate),
                        eq(schema.commentReactions.type, 'like')
                    )
                );

            const dislikes = await db
                .select({ count: count() })
                .from(schema.commentReactions)
                .where(
                    and(
                        gte(schema.commentReactions.createdAt, startDate),
                        eq(schema.commentReactions.type, 'dislike')
                    )
                );

            const likeCount = likes[0]?.count || 0;
            const dislikeCount = dislikes[0]?.count || 0;
            const likeRatio =
                likeCount + dislikeCount > 0
                    ? Math.round((likeCount / (likeCount + dislikeCount)) * 100)
                    : 100;

            res.json({
                days,
                current: {
                    comments: currComments,
                    users: currUsers,
                    reactions: currReactions
                },
                previous: {
                    comments: prevComments,
                    users: prevUsers,
                    reactions: prevReactions
                },
                trends: {
                    comments: calcTrend(currComments, prevComments),
                    users: calcTrend(currUsers, prevUsers),
                    reactions: calcTrend(currReactions, prevReactions)
                },
                averages: {
                    commentsPerDay: avgCommentsPerDay,
                    activeDays: daysWithComments.length
                },
                sentiment: {
                    likes: likeCount,
                    dislikes: dislikeCount,
                    likeRatio
                }
            });
        } catch (error) {
            console.error('Get engagement trends error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/moderation
router.get(
    '/moderation',
    authenticate,
    requirePermission('admin.dashboard'),
    async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const now = new Date();
            const thirtyDaysAgo = addDays(now, -30);
            const sevenDaysAgo = addDays(now, -7);

            // Pending items
            const pendingComments = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        eq(schema.comments.approved, false),
                        isNull(schema.comments.deletedAt)
                    )
                );

            const pendingReports = await db
                .select({ count: count() })
                .from(schema.reports)
                .where(eq(schema.reports.status, 'pending'));

            // Comments approved/rejected this week
            const approvedThisWeek = await db
                .select({ count: count() })
                .from(schema.auditLog)
                .where(
                    and(
                        eq(schema.auditLog.action, 'comment.approve'),
                        gte(schema.auditLog.createdAt, sevenDaysAgo)
                    )
                );

            const rejectedThisWeek = await db
                .select({ count: count() })
                .from(schema.auditLog)
                .where(
                    and(
                        eq(schema.auditLog.action, 'comment.reject'),
                        gte(schema.auditLog.createdAt, sevenDaysAgo)
                    )
                );

            // Reports resolved this week
            const reportsResolvedWeek = await db
                .select({ count: count() })
                .from(schema.reports)
                .where(
                    and(
                        sql`${schema.reports.status} != 'pending'`,
                        gte(schema.reports.reviewedAt, sevenDaysAgo)
                    )
                );

            // Bans this month
            const bansThisMonth = await db
                .select({ count: count() })
                .from(schema.userBans)
                .where(gte(schema.userBans.createdAt, thirtyDaysAgo));

            // Report reasons breakdown
            const reportReasons = await db
                .select({
                    reason: schema.reports.reason,
                    count: count()
                })
                .from(schema.reports)
                .where(gte(schema.reports.createdAt, thirtyDaysAgo))
                .groupBy(schema.reports.reason);

            res.json({
                pending: {
                    comments: pendingComments[0]?.count || 0,
                    reports: pendingReports[0]?.count || 0
                },
                thisWeek: {
                    commentsApproved: approvedThisWeek[0]?.count || 0,
                    commentsRejected: rejectedThisWeek[0]?.count || 0,
                    reportsResolved: reportsResolvedWeek[0]?.count || 0
                },
                thisMonth: {
                    usersBanned: bansThisMonth[0]?.count || 0
                },
                reportReasons: reportReasons.map((r) => ({
                    reason: r.reason,
                    count: r.count
                }))
            });
        } catch (error) {
            console.error('Get moderation analytics error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/analytics/sparklines?days=7
router.get(
    '/sparklines',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const days = Math.min(
                14,
                Math.max(7, parseInt(req.query.days as string) || 7)
            );

            const now = new Date();
            const startDate = addDays(startOfDay(now), -days + 1);

            // Generate all dates
            const dates: Date[] = [];
            for (let i = 0; i < days; i++) {
                dates.push(addDays(startDate, i));
            }

            // Get data for each metric per day
            const comments: number[] = [];
            const users: number[] = [];
            const reactions: number[] = [];

            for (const date of dates) {
                const dayStart = startOfDay(date);
                const dayEnd = addDays(dayStart, 1);

                const commentsResult = await db
                    .select({ count: count() })
                    .from(schema.comments)
                    .where(
                        and(
                            gte(schema.comments.createdAt, dayStart),
                            lte(schema.comments.createdAt, dayEnd)
                        )
                    );
                comments.push(commentsResult[0]?.count || 0);

                const usersResult = await db
                    .select({ count: count() })
                    .from(schema.users)
                    .where(
                        and(
                            gte(schema.users.createdAt, dayStart),
                            lte(schema.users.createdAt, dayEnd)
                        )
                    );
                users.push(usersResult[0]?.count || 0);

                const reactionsResult = await db
                    .select({ count: count() })
                    .from(schema.commentReactions)
                    .where(
                        and(
                            gte(schema.commentReactions.createdAt, dayStart),
                            lte(schema.commentReactions.createdAt, dayEnd)
                        )
                    );
                reactions.push(reactionsResult[0]?.count || 0);
            }

            res.json({
                days,
                comments,
                users,
                reactions
            });
        } catch (error) {
            console.error('Get sparklines error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
