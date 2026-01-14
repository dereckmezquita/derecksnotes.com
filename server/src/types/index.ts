import type { Request } from 'express';
import type { users, groups, permissions, sessions } from '@db/schema/users';
import type { comments, commentReactions } from '@db/schema/comments';
import type { reports } from '@db/schema/reports';
import type { auditLog } from '@db/schema/audit';
import type { serverLogs, errorSummary } from '@db/schema/logs';
import type { pageViews, postReactions } from '@db/schema/posts';

// ============================================================================
// EXPRESS REQUEST TYPES
// ============================================================================

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
    sessionId?: string;
    permissions?: Set<string>;
}

// ============================================================================
// USER TYPES (extended)
// ============================================================================

export interface UserWithGroups {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: Date;
    groups: string[];
    permissions: string[];
}

// ============================================================================
// DRIZZLE INFERRED TYPES
// These types are derived from the database schema.
// Use $inferSelect for querying data, $inferInsert for creating records.
// ============================================================================

// User Schema Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

// Comment Schema Types
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type CommentReaction = typeof commentReactions.$inferSelect;
export type NewCommentReaction = typeof commentReactions.$inferInsert;

// Report Schema Types
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

// Audit Schema Types
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;

// Log Schema Types
export type ServerLog = typeof serverLogs.$inferSelect;
export type NewServerLog = typeof serverLogs.$inferInsert;
export type ErrorSummaryRecord = typeof errorSummary.$inferSelect;
export type NewErrorSummary = typeof errorSummary.$inferInsert;

// Post/Page View Schema Types
export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
export type PostReaction = typeof postReactions.$inferSelect;
export type NewPostReaction = typeof postReactions.$inferInsert;

// ============================================================================
// API RESPONSE TYPES (for consistency across routes)
// ============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total?: number;
    hasMore?: boolean;
}

export interface ApiSuccess<T = void> {
    success: true;
    data?: T;
    message?: string;
}

export interface ApiError {
    error: string;
    code?: string;
    details?: Record<string, unknown>;
}
