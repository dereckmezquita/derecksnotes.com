/**
 * Central API response types for admin and public endpoints.
 * Update these types when server schema changes to catch type errors across the codebase.
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface UserBasic {
    id: string;
    username: string;
    displayName?: string | null;
    avatarUrl?: string | null;
}

export interface PostBasic {
    slug: string;
    title: string;
}

// ============================================================================
// POST & PAGE VIEW TYPES
// ============================================================================

export interface PostStats {
    views: number;
    uniqueVisitors: number;
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
    avgDuration: number | null;
    avgScrollDepth: number | null;
}

export interface PostReactionResponse {
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}

// ============================================================================
// ADMIN COMMENT TYPES
// ============================================================================

export interface AdminPendingComment {
    id: string;
    content: string;
    slug: string;
    postTitle: string;
    createdAt: string;
    user: UserBasic | null;
    post?: PostBasic | null;
}

export interface AdminPendingCommentsResponse {
    comments: AdminPendingComment[];
    page: number;
    limit: number;
}

// ============================================================================
// ADMIN REPORT TYPES
// ============================================================================

export interface ReportComment {
    id: string;
    content: string;
    postId: string;
    user: {
        id: string;
        username: string;
    } | null;
    post: PostBasic | null;
}

export interface AdminReport {
    id: string;
    commentId: string;
    reason: string;
    details: string | null;
    status: 'pending' | 'reviewed' | 'dismissed';
    reviewedBy: string | null;
    reviewedAt: string | null;
    createdAt: string;
    reportCount: number;
    isHighPriority: boolean;
    reporter: {
        id: string;
        username: string;
    } | null;
    comment: ReportComment | null;
}

export interface AdminReportsResponse {
    reports: AdminReport[];
    page: number;
    limit: number;
}

// ============================================================================
// ADMIN ANALYTICS TYPES
// ============================================================================

export interface AnalyticsTopPost {
    slug: string;
    title: string;
    views: number;
    uniqueVisitors: number;
    commentCount: number;
    postLikes: number;
    postDislikes: number;
    commentReactionCount: number;
    commentLikeCount: number;
    commentDislikeCount: number;
    engagementScore: number;
}

export interface AnalyticsTopComment {
    id: string;
    content: string;
    slug: string;
    postTitle: string;
    likes: number;
    dislikes: number;
    replyCount: number;
    createdAt: string;
    user: UserBasic | null;
}

export interface AnalyticsTopContributor {
    id: string;
    username: string;
    displayName: string | null;
    commentCount: number;
    totalLikes: number;
    totalDislikes: number;
    engagementScore: number;
}

export interface AnalyticsOverview {
    totalPosts: number;
    totalViews: number;
    totalUniqueVisitors: number;
    totalComments: number;
    totalPostLikes: number;
    totalPostDislikes: number;
    totalCommentLikes: number;
    totalCommentDislikes: number;
    avgCommentsPerPost: number;
    avgViewsPerPost: number;
    avgEngagementRate: number;
}

export interface AnalyticsResponse {
    overview: AnalyticsOverview;
    topPosts: AnalyticsTopPost[];
    topComments: AnalyticsTopComment[];
    topContributors: AnalyticsTopContributor[];
}

// ============================================================================
// ADMIN AUDIT LOG TYPES
// ============================================================================

export interface AuditLogDetails {
    contentPreview?: string;
    username?: string;
    reason?: string;
    postSlug?: string; // Note: Server audit logs may store old field names
    slug?: string;
    count?: number;
    [key: string]: unknown;
}

export interface AuditLogEntry {
    id: string;
    adminId: string;
    admin: {
        id: string;
        username: string;
    };
    action: string;
    targetType: string;
    targetId: string | null;
    details: AuditLogDetails | null;
    createdAt: string;
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
    pendingComments: number;
    pendingReports: number;
    totalUsers: number;
    totalComments: number;
}

export interface DashboardResponse {
    stats: DashboardStats;
    recentActivity: AuditLogEntry[];
}
