import type { UserBasic } from './user';

export type NotificationType =
  | 'comment.reply'
  | 'comment.like'
  | 'mention'
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
