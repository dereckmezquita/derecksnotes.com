import type { Request } from 'express';
import type * as schema from '@db/schema';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
    sessionId?: string;
    permissions?: Set<string>;
}

// Drizzle inferred types
export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Session = typeof schema.sessions.$inferSelect;
export type Group = typeof schema.groups.$inferSelect;
export type Permission = typeof schema.permissions.$inferSelect;
export type Comment = typeof schema.comments.$inferSelect;
export type NewComment = typeof schema.comments.$inferInsert;
export type CommentHistoryRecord = typeof schema.commentHistory.$inferSelect;
export type Post = typeof schema.posts.$inferSelect;
export type PostReaction = typeof schema.postReactions.$inferSelect;
export type CommentReaction = typeof schema.commentReactions.$inferSelect;
export type ReadHistoryRecord = typeof schema.readHistory.$inferSelect;
export type AuditLogRecord = typeof schema.auditLog.$inferSelect;
export type UserBan = typeof schema.userBans.$inferSelect;
