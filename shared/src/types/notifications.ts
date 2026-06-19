import type { UserBasic } from './user';

export type NotificationType =
  | 'comment.reply'
  | 'comment.like'
  | 'mention'
  | 'follow.new'
  // Author-facing: a moderator approved your pending comment.
  | 'comment.approved'
  // Admin-only: a fresh comment is sitting in the pending queue.
  | 'comment.pending-review'
  // Admin-only: a user filed a report.
  | 'report.new'
  | 'admin.message'
  | 'admin.broadcast';

/**
 * Toast policy per type. `silent: true` means the bell + badge still
 * fire but no Sonner toast pops up — used for high-volume noisy types
 * like comment.like where the badge is plenty.
 */
export const NOTIFICATION_TOAST_POLICY: Record<
  NotificationType,
  { silent?: boolean }
> = {
  'comment.reply': {},
  'comment.like': { silent: true },
  mention: {},
  'follow.new': {},
  'comment.approved': {},
  'comment.pending-review': {},
  'report.new': {},
  'admin.message': {},
  'admin.broadcast': {}
};

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
