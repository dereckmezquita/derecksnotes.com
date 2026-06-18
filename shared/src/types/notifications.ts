import type { UserBasic } from './user';

export type NotificationType =
  | 'comment.reply'
  | 'comment.like'
  | 'mention'
  | 'follow.new'
  // Admin-only: a fresh comment is sitting in the pending queue.
  | 'comment.pending-review'
  // Admin-only: a user filed a report.
  | 'report.new'
  | 'admin.message'
  | 'admin.broadcast';

export interface NotificationEntry {
  id: string;
  type: NotificationType;
  actor: UserBasic | null;
  targetType: string | null;
  targetId: string | null;
  payload: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}
