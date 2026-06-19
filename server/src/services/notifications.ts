import { randomUUID } from 'node:crypto';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, sql, inArray } from 'drizzle-orm';

/**
 * Notification producer keys. Free-form on the column so adding new types
 * doesn't require a migration, but centralised here so producers can't
 * silently typo their way to a notification that the client doesn't know
 * how to render.
 */
export type NotificationType =
  | 'comment.reply'
  | 'comment.like'
  | 'mention'
  | 'follow.new'
  | 'comment.approved'
  | 'comment.pending-review'
  | 'report.new'
  | 'admin.message'
  | 'admin.broadcast';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  actorUserId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  payload?: Record<string, unknown> | null;
}

/**
 * Insert a single notification. Self-notifications are silently dropped —
 * producers don't have to remember to check (recipient === actor).
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<string | null> {
  if (input.actorUserId && input.actorUserId === input.userId) return null;
  const id = randomUUID();
  await db.insert(schema.notifications).values({
    id,
    userId: input.userId,
    type: input.type,
    actorUserId: input.actorUserId || null,
    targetType: input.targetType || null,
    targetId: input.targetId || null,
    payload: input.payload ? JSON.stringify(input.payload) : null,
    createdAt: new Date().toISOString()
  });
  return id;
}

/**
 * Heterogeneous batch insert — each item can have its own recipient,
 * actor, target, and payload. Used when producers fan one notification
 * per matched row with row-specific payloads (e.g. bulk-approve, which
 * emits one comment.approved per author with that author's slug + body
 * preview). Same chunking discipline as createNotificationsForUsers.
 *
 * Self-notifications (recipient === actor) are silently dropped per item
 * to match the single-create contract.
 */
export async function createNotificationsBatch(
  items: CreateNotificationInput[]
): Promise<number> {
  const now = new Date().toISOString();
  const rows = items
    .filter((i) => !i.actorUserId || i.actorUserId !== i.userId)
    .map((i) => ({
      id: randomUUID(),
      userId: i.userId,
      type: i.type,
      actorUserId: i.actorUserId || null,
      targetType: i.targetType || null,
      targetId: i.targetId || null,
      payload: i.payload ? JSON.stringify(i.payload) : null,
      createdAt: now
    }));
  if (rows.length === 0) return 0;
  await db.transaction(async (tx) => {
    const BATCH = 200;
    for (let i = 0; i < rows.length; i += BATCH) {
      await tx.insert(schema.notifications).values(rows.slice(i, i + BATCH));
    }
  });
  return rows.length;
}

/**
 * Fan a notification to many users at once. Used by admin broadcast.
 * Batched in a single transaction. Self-notifications skipped.
 */
export async function createNotificationsForUsers(
  recipientIds: string[],
  template: Omit<CreateNotificationInput, 'userId'>
): Promise<number> {
  const now = new Date().toISOString();
  const rows = recipientIds
    .filter((uid) => !template.actorUserId || template.actorUserId !== uid)
    .map((uid) => ({
      id: randomUUID(),
      userId: uid,
      type: template.type,
      actorUserId: template.actorUserId || null,
      targetType: template.targetType || null,
      targetId: template.targetId || null,
      payload: template.payload ? JSON.stringify(template.payload) : null,
      createdAt: now
    }));
  if (rows.length === 0) return 0;
  await db.transaction(async (tx) => {
    // SQLite caps parameters per statement around 999 by default; chunk
    // into batches of 200 rows (each row has ~9 bound params).
    const BATCH = 200;
    for (let i = 0; i < rows.length; i += BATCH) {
      await tx.insert(schema.notifications).values(rows.slice(i, i + BATCH));
    }
  });
  return rows.length;
}

export async function listForUser(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const rows = await db.query.notifications.findMany({
    where: eq(schema.notifications.userId, userId),
    orderBy: [
      desc(schema.notifications.createdAt),
      desc(schema.notifications.id)
    ],
    limit,
    offset,
    with: {
      actor: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  });

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId));

  return {
    notifications: rows.map((r) => ({
      id: r.id,
      type: r.type,
      actor: r.actor,
      targetType: r.targetType,
      targetId: r.targetId,
      payload: r.payload ? JSON.parse(r.payload) : null,
      readAt: r.readAt,
      createdAt: r.createdAt
    })),
    total: total[0]?.count || 0
  };
}

export async function unreadCount(userId: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications)
    .where(
      and(
        eq(schema.notifications.userId, userId),
        isNull(schema.notifications.readAt)
      )
    );
  return row[0]?.count || 0;
}

export async function markRead(id: string, userId: string): Promise<boolean> {
  const result = await db
    .update(schema.notifications)
    .set({ readAt: new Date().toISOString() })
    .where(
      and(
        eq(schema.notifications.id, id),
        eq(schema.notifications.userId, userId),
        isNull(schema.notifications.readAt)
      )
    )
    .returning({ id: schema.notifications.id });
  return result.length > 0;
}

export async function markAllRead(userId: string): Promise<number> {
  const result = await db
    .update(schema.notifications)
    .set({ readAt: new Date().toISOString() })
    .where(
      and(
        eq(schema.notifications.userId, userId),
        isNull(schema.notifications.readAt)
      )
    )
    .returning({ id: schema.notifications.id });
  return result.length;
}

export async function deleteOne(id: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(schema.notifications)
    .where(
      and(
        eq(schema.notifications.id, id),
        eq(schema.notifications.userId, userId)
      )
    )
    .returning({ id: schema.notifications.id });
  return result.length > 0;
}

export interface NotificationStats {
  total: number;
  unread: number;
  perType: Array<{ type: string; count: number }>;
  last7Days: number;
}

/**
 * Admin overview — populates the Notifications tab in /admin.
 */
export async function getStats(): Promise<NotificationStats> {
  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications);

  const unread = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications)
    .where(isNull(schema.notifications.readAt));

  const perType = await db
    .select({
      type: schema.notifications.type,
      count: sql<number>`count(*)`
    })
    .from(schema.notifications)
    .groupBy(schema.notifications.type)
    .orderBy(sql`count(*) desc`);

  const last7Days = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications)
    .where(
      sql`${schema.notifications.createdAt} >= datetime('now', '-7 days')`
    );

  return {
    total: total[0]?.count || 0,
    unread: unread[0]?.count || 0,
    perType: perType.map((p) => ({ type: p.type, count: p.count })),
    last7Days: last7Days[0]?.count || 0
  };
}

/**
 * Resolve every active user id (not soft-deleted). Used by admin
 * broadcast. Excluded callers can be added to `exclude`.
 */
export async function listActiveUserIds(
  exclude: string[] = []
): Promise<string[]> {
  const rows = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(isNull(schema.users.deletedAt));
  if (exclude.length === 0) return rows.map((r) => r.id);
  const excludeSet = new Set(exclude);
  return rows.map((r) => r.id).filter((id) => !excludeSet.has(id));
}

/**
 * Resolve every active admin + moderator user id. Used to fan
 * moderation-queue events (pending comment, new report). Single
 * batched JOIN query — no N+1 even with a busy site.
 */
export async function listAdminAndModeratorIds(
  exclude: string[] = []
): Promise<string[]> {
  const rows = await db
    .select({ userId: schema.userGroups.userId })
    .from(schema.userGroups)
    .innerJoin(schema.groups, eq(schema.userGroups.groupId, schema.groups.id))
    .innerJoin(schema.users, eq(schema.userGroups.userId, schema.users.id))
    .where(
      and(
        isNull(schema.users.deletedAt),
        inArray(schema.groups.name, ['admin', 'moderator'])
      )
    );
  const ids = Array.from(new Set(rows.map((r) => r.userId)));
  if (exclude.length === 0) return ids;
  const excludeSet = new Set(exclude);
  return ids.filter((id) => !excludeSet.has(id));
}

/**
 * Convenience: fan a single notification to every admin/moderator. Self-
 * fan (recipient === actorUserId) is already dropped by createNotification.
 */
export async function fanToModerators(
  template: Omit<CreateNotificationInput, 'userId'>
): Promise<number> {
  const ids = await listAdminAndModeratorIds(
    template.actorUserId ? [template.actorUserId] : []
  );
  if (ids.length === 0) return 0;
  return createNotificationsForUsers(ids, template);
}
