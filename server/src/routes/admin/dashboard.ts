import { Router } from 'express';
import type { AuthenticatedRequest } from '@/types';
import { requirePermission } from '@middleware/auth';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import * as bookmarkService from '@services/bookmarks';

const router = Router();

router.get(
  '/dashboard',
  requirePermission('admin.dashboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const pendingComments = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.comments)
        .where(
          and(
            eq(schema.comments.approved, 0),
            isNull(schema.comments.deletedAt)
          )
        );

      const totalUsers = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.users)
        .where(isNull(schema.users.deletedAt));

      const totalComments = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.comments);

      const totalPosts = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.posts);

      // Only callers who can already view the audit log get the recent-audit
      // slice; moderators with only `admin.dashboard` see stats but not the
      // audit feed (I7 from the security spike).
      const canSeeAudit = req.permissions?.has('admin.audit.view') ?? false;
      const recentAudit = canSeeAudit
        ? (
            await db.query.auditLog.findMany({
              orderBy: [desc(schema.auditLog.createdAt)],
              limit: 10,
              with: {
                admin: {
                  columns: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            })
          ).map((a) => ({
            ...a,
            details: a.details ? JSON.parse(a.details) : null
          }))
        : [];

      res.json({
        stats: {
          pendingComments: pendingComments[0]?.count || 0,
          totalUsers: totalUsers[0]?.count || 0,
          totalComments: totalComments[0]?.count || 0,
          totalPosts: totalPosts[0]?.count || 0
        },
        recentAudit
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/analytics',
  requirePermission('admin.dashboard'),
  async (_req: AuthenticatedRequest, res) => {
    try {
      const commentsPerDay = await db
        .select({
          date: sql<string>`date(${schema.comments.createdAt})`,
          count: sql<number>`count(*)`
        })
        .from(schema.comments)
        .where(
          and(
            sql`${schema.comments.createdAt} >= date('now', '-30 days')`,
            isNull(schema.comments.deletedAt)
          )
        )
        .groupBy(sql`date(${schema.comments.createdAt})`)
        .orderBy(sql`date(${schema.comments.createdAt}) ASC`);

      const usersPerDay = await db
        .select({
          date: sql<string>`date(${schema.users.createdAt})`,
          count: sql<number>`count(*)`
        })
        .from(schema.users)
        .where(
          and(
            sql`${schema.users.createdAt} >= date('now', '-30 days')`,
            isNull(schema.users.deletedAt)
          )
        )
        .groupBy(sql`date(${schema.users.createdAt})`)
        .orderBy(sql`date(${schema.users.createdAt}) ASC`);

      const topCommentedPosts = await db
        .select({
          slug: schema.posts.slug,
          title: schema.posts.title,
          count: sql<number>`count(${schema.comments.id})`
        })
        .from(schema.posts)
        .innerJoin(schema.comments, eq(schema.comments.postId, schema.posts.id))
        .where(isNull(schema.comments.deletedAt))
        .groupBy(schema.posts.id)
        .orderBy(sql`count(${schema.comments.id}) DESC`)
        .limit(5);

      const topLikedPosts = await db
        .select({
          slug: schema.posts.slug,
          title: schema.posts.title,
          likes: sql<number>`count(${schema.postReactions.id})`
        })
        .from(schema.posts)
        .innerJoin(
          schema.postReactions,
          eq(schema.postReactions.postId, schema.posts.id)
        )
        .where(eq(schema.postReactions.type, 'like'))
        .groupBy(schema.posts.id)
        .orderBy(sql`count(${schema.postReactions.id}) DESC`)
        .limit(5);

      const topBookmarkedPosts = await bookmarkService.getMostBookmarked(5);

      res.json({
        commentsPerDay,
        usersPerDay,
        topCommentedPosts,
        topLikedPosts,
        topBookmarkedPosts
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
