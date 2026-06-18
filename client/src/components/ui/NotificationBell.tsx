'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type {
  NotificationEntry,
  PaginatedResponse
} from '@derecksnotes/shared';

const POLL_MS = 30_000;

const Wrap = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 14px 13px;
  &:hover {
    color: ${(p) => p.theme.text.colour.white()};
    background-color: ${(p) => p.theme.theme_colours[5]()};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #c62828;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  max-height: 70vh;
  overflow-y: auto;
  z-index: 200;
  background: ${(p) => p.theme.container.background.colour.card()};
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.85rem;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  font-weight: 600;
`;

const MarkAllButton = styled.button`
  font-family: inherit;
  font-size: 0.7rem;
  padding: 2px 8px;
  border: 1px solid #0f9960;
  background: rgba(15, 153, 96, 0.08);
  color: #0f9960;
  border-radius: 3px;
  cursor: pointer;
`;

const Item = styled.div<{ $unread: boolean }>`
  padding: 10px 12px;
  border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  background: ${(p) =>
    p.$unread ? `${p.theme.text.colour.header()}10` : 'transparent'};
  &:last-child {
    border-bottom: none;
  }
  cursor: pointer;
  display: block;
  color: inherit;
  text-decoration: none;
  &:hover {
    background: ${(p) => p.theme.text.colour.header()}18;
  }
`;

const ItemTitle = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
`;

const ItemMeta = styled.div`
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-size: 0.72rem;
`;

const ItemPreview = styled.div`
  color: ${(p) => p.theme.text.colour.primary()};
  font-size: 0.78rem;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Empty = styled.div`
  padding: 20px 12px;
  text-align: center;
  color: ${(p) => p.theme.text.colour.light_grey()};
`;

function describeType(n: NotificationEntry): string {
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

/**
 * Summary line for N items of a single type — used when the same kind of
 * notification arrives in a burst (e.g. 5 pending-review comments in one
 * poll). Keeps the toast pipeline from spamming on busy intervals.
 */
function summarizeType(type: NotificationEntry['type'], count: number): string {
  switch (type) {
    case 'comment.reply':
      return `${count} new replies to your comments`;
    case 'comment.like':
      return `${count} new likes on your comments`;
    case 'mention':
      return `${count} new mentions of you`;
    case 'follow.new':
      return `${count} new followers`;
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

function hrefFor(n: NotificationEntry): string | null {
  const slug =
    (n.payload && typeof n.payload.postSlug === 'string'
      ? (n.payload.postSlug as string)
      : null) || null;
  if (n.targetType === 'comment' && n.targetId && slug) {
    return `/${slug}#comment-${n.targetId}`;
  }
  if (n.type === 'comment.pending-review') return '/admin';
  if (n.type === 'report.new') return '/admin';
  if (n.type === 'follow.new' && n.actor?.username) {
    return `/profile/${n.actor.username}`;
  }
  if (n.targetType === 'user' && n.actor?.username) {
    return `/profile/${n.actor.username}`;
  }
  return null;
}

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Ids we've already surfaced via toast so the same notification doesn't
  // re-toast across polls. The list is bounded — we trim to the last 200
  // seen ids to keep the set from growing without bound for long sessions.
  const seenIds = useRef<Set<string>>(new Set());
  // Suppress toasts on the first poll after mount (would surface every
  // pre-existing unread item as if it were brand new).
  const primed = useRef(false);

  const fetchLatest = useCallback(async () => {
    return api.get<PaginatedResponse<NotificationEntry>>(
      '/notifications?page=1&limit=20',
      { silent: true }
    );
  }, []);

  const refreshUnread = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await api.get<{ count: number }>(
        '/notifications/unread-count',
        { silent: true }
      );
      const nextCount = data.count;
      setUnread(nextCount);

      // Toast on new unread arrivals. We always re-fetch the list when the
      // unread count goes UP so the toast can name the actor + type; on the
      // first prime we still record seen ids but skip the toast.
      if (nextCount > 0) {
        const latest = await fetchLatest().catch(() => null);
        if (latest) {
          if (!primed.current) {
            for (const n of latest.data) seenIds.current.add(n.id);
            primed.current = true;
          } else {
            // Collect the fresh items into per-type buckets, then surface a
            // single toast per bucket — one polished line for a lone reply,
            // a summary for "5 new replies", a global summary if many
            // distinct types arrive at once. This keeps a busy hour on a
            // moderation queue from showing 20 individual toasts.
            const freshByType = new Map<
              NotificationEntry['type'],
              NotificationEntry[]
            >();
            for (const n of latest.data) {
              if (seenIds.current.has(n.id)) continue;
              if (n.readAt) {
                seenIds.current.add(n.id);
                continue;
              }
              seenIds.current.add(n.id);
              const arr = freshByType.get(n.type);
              if (arr) arr.push(n);
              else freshByType.set(n.type, [n]);
            }
            const typeCount = freshByType.size;
            const totalFresh = Array.from(freshByType.values()).reduce(
              (a, b) => a + b.length,
              0
            );
            if (typeCount > 3) {
              // Many kinds at once — collapse to one global toast.
              toast.message(`${totalFresh} new notifications`, {
                action: {
                  label: 'Open',
                  onClick: () => setOpen(true)
                }
              });
            } else {
              for (const [type, batch] of freshByType) {
                if (batch.length === 1) {
                  const n = batch[0]!;
                  toast.message(describeType(n), {
                    description:
                      (n.payload?.preview as string | undefined) ||
                      (n.payload?.message as string | undefined) ||
                      undefined,
                    action: (() => {
                      const href = hrefFor(n);
                      return href
                        ? {
                            label: 'Open',
                            onClick: () => {
                              window.location.href = href;
                            }
                          }
                        : undefined;
                    })()
                  });
                } else {
                  // Summary toast for a burst of the same kind.
                  toast.message(summarizeType(type, batch.length), {
                    action: {
                      label: 'See all',
                      onClick: () => setOpen(true)
                    }
                  });
                }
              }
            }
          }
          // Bound the seen set so the very-long-session case stays small.
          if (seenIds.current.size > 200) {
            const arr = Array.from(seenIds.current);
            seenIds.current = new Set(arr.slice(arr.length - 200));
          }
        }
      } else if (!primed.current) {
        primed.current = true;
      }
    } catch {
      // silent — bell shouldn't toast on poll failure
    }
  }, [isAuthenticated, fetchLatest]);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLatest();
      setItems(data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [fetchLatest]);

  // Initial fetch + interval poll.
  useEffect(() => {
    refreshUnread();
    const t = setInterval(refreshUnread, POLL_MS);
    return () => clearInterval(t);
  }, [refreshUnread]);

  // Close on outside-click.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const onToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) await loadList();
  };

  const handleItemClick = async (n: NotificationEntry) => {
    setOpen(false);
    if (!n.readAt) {
      try {
        await api.post(`/notifications/${n.id}/read`, undefined, {
          silent: true
        });
      } catch {
        // silent
      }
      setUnread((u) => Math.max(0, u - 1));
    }
  };

  const handleMarkAll = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnread(0);
      setItems((prev) =>
        prev.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString()
        }))
      );
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  if (!isAuthenticated()) return null;

  return (
    <Wrap ref={wrapRef} onClick={(e) => e.stopPropagation()}>
      <span onClick={onToggle} role="button" aria-label="Notifications">
        <FaBell />
        {unread > 0 && <Badge>{unread > 99 ? '99+' : unread}</Badge>}
      </span>
      {open && (
        <Dropdown>
          <DropdownHeader>
            <span>
              Notifications {unread > 0 && <span>({unread} unread)</span>}
            </span>
            {unread > 0 && (
              <MarkAllButton onClick={handleMarkAll}>
                Mark all read
              </MarkAllButton>
            )}
          </DropdownHeader>
          {loading && items.length === 0 ? (
            <Empty>Loading…</Empty>
          ) : items.length === 0 ? (
            <Empty>No notifications yet.</Empty>
          ) : (
            items.map((n) => {
              const href = hrefFor(n);
              const inner = (
                <>
                  <ItemTitle>{describeType(n)}</ItemTitle>
                  {n.payload?.preview ? (
                    <ItemPreview>{String(n.payload.preview)}</ItemPreview>
                  ) : null}
                  {n.payload?.message ? (
                    <ItemPreview>{String(n.payload.message)}</ItemPreview>
                  ) : null}
                  <ItemMeta>{new Date(n.createdAt).toLocaleString()}</ItemMeta>
                </>
              );
              return href ? (
                <Item
                  as={Link}
                  href={href}
                  key={n.id}
                  $unread={!n.readAt}
                  onClick={() => handleItemClick(n)}
                >
                  {inner}
                </Item>
              ) : (
                <Item
                  key={n.id}
                  $unread={!n.readAt}
                  onClick={() => handleItemClick(n)}
                >
                  {inner}
                </Item>
              );
            })
          )}
        </Dropdown>
      )}
    </Wrap>
  );
}
