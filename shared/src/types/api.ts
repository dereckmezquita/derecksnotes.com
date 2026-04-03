import type { UserBasic } from './user';

// ============================================================================
// GENERIC API TYPES
// ============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
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

// ============================================================================
// SESSION TYPES
// ============================================================================

export interface SessionInfo {
    id: string;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

// ============================================================================
// USER COMMENT (for account page /me/comments)
// ============================================================================

export interface UserComment {
    id: string;
    content: string;
    slug: string;
    postTitle: string;
    depth: number;
    approved: boolean;
    createdAt: string;
    editedAt: string | null;
    isDeleted: boolean;
    likes: number;
    dislikes: number;
}

// ============================================================================
// COMMENTS LIST RESPONSE (from GET /comments?slug=...)
// ============================================================================

export interface CommentsListResponse {
    comments: CommentData[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface RepliesResponse {
    replies: CommentData[];
    total: number;
    hasMore: boolean;
}

// ============================================================================
// ANALYTICS (admin)
// ============================================================================

export interface AnalyticsData {
    commentsPerDay: Array<{ date: string; count: number }>;
    usersPerDay: Array<{ date: string; count: number }>;
    topCommentedPosts: Array<{ slug: string; title: string; count: number }>;
    topLikedPosts: Array<{ slug: string; title: string; likes: number }>;
}

// ============================================================================
// POST TYPES
// ============================================================================

export interface PostBasic {
    slug: string;
    title: string;
}

export interface PostStats {
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}

export interface PostReactionResponse {
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}

// ============================================================================
// COMMENT TYPES
// ============================================================================

export interface CommentData {
    id: string;
    content: string;
    depth: number;
    approved: boolean;
    createdAt: string;
    editedAt: string | null;
    isDeleted: boolean;
    user: UserBasic | null;
    reactions: {
        likes: number;
        dislikes: number;
        userReaction: 'like' | 'dislike' | null;
    };
    replies: CommentData[];
    replyCount: number;
    hasMoreReplies: boolean;
}

export interface CommentHistoryEntry {
    id: string;
    content: string;
    editedAt: string;
    editedBy: UserBasic;
}

// ============================================================================
// READ HISTORY
// ============================================================================

export interface ReadHistoryEntry {
    postSlug: string;
    postTitle: string;
    readAt: string;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminUser {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    groups: string[];
    isBanned: boolean;
    banExpiresAt: string | null;
    createdAt: string;
}

export interface DashboardStats {
    pendingComments: number;
    totalUsers: number;
    totalComments: number;
    totalPosts: number;
}

export interface DashboardResponse {
    stats: DashboardStats;
    recentAudit: AuditLogEntry[];
}

export interface AuditLogEntry {
    id: string;
    adminId: string;
    admin: UserBasic | null;
    action: string;
    targetType: string;
    targetId: string | null;
    details: Record<string, unknown> | null;
    ipAddress: string | null;
    createdAt: string;
}

export interface AdminPendingComment {
    id: string;
    content: string;
    slug: string;
    postTitle: string;
    createdAt: string;
    user: UserBasic | null;
}
