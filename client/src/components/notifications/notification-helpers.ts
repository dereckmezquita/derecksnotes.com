import type { NotificationEntry } from '@derecksnotes/shared';

export function describeType(n: NotificationEntry): string {
  const actor = n.actor?.displayName || n.actor?.username || 'Someone';
  switch (n.type) {
    case 'comment.reply':
      return `${actor} replied to your comment`;
    case 'comment.like':
      return `${actor} liked your comment`;
    case 'mention':
      return `${actor} mentioned you`;
    case 'follow.new':
      return `${actor} started following you`;
    case 'comment.approved':
      return `Your comment was approved`;
    case 'comment.pending-review':
      return `${actor} posted a comment awaiting review`;
    case 'report.new':
      return `${actor} filed a report`;
    case 'admin.message':
      return `Message from ${actor}`;
    case 'admin.broadcast':
      return `Announcement`;
    default:
      return n.type;
  }
}

export function summarizeType(
  type: NotificationEntry['type'],
  count: number
): string {
  switch (type) {
    case 'comment.reply':
      return `${count} new replies to your comments`;
    case 'comment.like':
      return `${count} new likes on your comments`;
    case 'mention':
      return `${count} new mentions of you`;
    case 'follow.new':
      return `${count} new followers`;
    case 'comment.approved':
      return `${count} comments approved`;
    case 'comment.pending-review':
      return `${count} comments awaiting review`;
    case 'report.new':
      return `${count} new reports filed`;
    case 'admin.message':
      return `${count} admin messages`;
    case 'admin.broadcast':
      return `${count} announcements`;
    default:
      return `${count} new ${type}`;
  }
}

export function hrefFor(n: NotificationEntry): string | null {
  const slug =
    n.payload && typeof n.payload.postSlug === 'string'
      ? (n.payload.postSlug as string)
      : null;
  if (n.targetType === 'comment' && n.targetId && slug) {
    return `/${slug}#comment-${n.targetId}`;
  }
  if (n.type === 'comment.pending-review') return '/admin?tab=comments';
  if (n.type === 'report.new') return '/admin?tab=reports';
  if (n.type === 'follow.new' && n.actor?.username) {
    return `/profile/${n.actor.username}`;
  }
  if (n.targetType === 'user' && n.actor?.username) {
    return `/profile/${n.actor.username}`;
  }
  return null;
}
