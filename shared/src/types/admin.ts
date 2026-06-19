import type { UserBasic } from './user';

// ============================================================================
// USERS (admin)
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
  mentionMuted: boolean;
}

// ============================================================================
// DASHBOARD (admin)
// ============================================================================

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

// ============================================================================
// AUDIT (admin)
// ============================================================================

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

// ============================================================================
// PENDING COMMENTS (admin)
// ============================================================================

export interface AdminPendingComment {
  id: string;
  content: string;
  slug: string;
  postTitle: string;
  createdAt: string;
  user: UserBasic | null;
  // Per-comment engagement.
  commentLikes: number;
  commentDislikes: number;
  // Per-author moderation context, surfaced inline so the admin can decide
  // without having to drill into the user's profile.
  authorAccountAgeDays: number;
  authorTotalComments: number;
  authorApprovedCount: number;
  authorPendingCount: number;
  // Comments that were unapproved and got soft-deleted — a strong signal
  // that prior moderation rejected this author's content.
  authorRejectedCount: number;
  authorTotalLikesReceived: number;
  authorTotalDislikesReceived: number;
  authorGroups: string[];
}

// ============================================================================
// REPORTS (admin)
// ============================================================================

export type AdminReportTargetType = 'comment' | 'user';
export type AdminReportStatus = 'open' | 'resolved' | 'dismissed';

export interface AdminReport {
  id: string;
  reporter: UserBasic | null;
  targetType: AdminReportTargetType;
  targetId: string;
  reason: string;
  details: string | null;
  status: AdminReportStatus;
  resolvedAt: string | null;
  createdAt: string;
}

// ============================================================================
// NOTIFICATION STATS (admin)
// ============================================================================

export interface NotificationStats {
  total: number;
  unread: number;
  perType: Array<{ type: string; count: number }>;
  last7Days: number;
}

// ============================================================================
// ANALYTICS (admin)
// ============================================================================

export interface AnalyticsData {
  commentsPerDay: Array<{ date: string; count: number }>;
  usersPerDay: Array<{ date: string; count: number }>;
  topCommentedPosts: Array<{ slug: string; title: string; count: number }>;
  topLikedPosts: Array<{ slug: string; title: string; likes: number }>;
  topBookmarkedPosts: Array<{ slug: string; title: string; count: number }>;
}
