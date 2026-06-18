// ============================================================================
// GENERIC API ENVELOPES
// ============================================================================
//
// Domain-specific types live in their own files (admin.ts, comments.ts,
// notifications.ts, posts.ts, user.ts, auth.ts). This file is intentionally
// limited to the generic envelopes used by every list endpoint.

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

export interface SessionInfo {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}
