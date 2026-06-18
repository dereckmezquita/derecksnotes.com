'use client';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import type {
  NotificationEntry,
  PaginatedResponse
} from '@derecksnotes/shared';
import { describeType, summarizeType, hrefFor } from './notification-helpers';

const POLL_MS = 30_000;

/**
 * Headless toast pipeline. Polls the unread count and, on every increase,
 * fetches the latest page and emits Sonner toasts — one per fresh item for
 * lone arrivals, a summary toast per type for bursts, and a single global
 * toast when more than three distinct types fire in the same window.
 *
 * Mounted once in the root layout. Renders nothing — the durable list lives
 * on /account?tab=notifications.
 */
export function NotificationToastWatcher() {
  const { isAuthenticated } = useAuth();
  // Ids we've already surfaced via toast so the same notification doesn't
  // re-toast across polls. Bounded to ~200 to keep long sessions tidy.
  const seenIds = useRef<Set<string>>(new Set());
  // First poll after mount records existing unread items without toasting —
  // otherwise every pre-existing unread shows as if it just arrived.
  const primed = useRef(false);

  const fetchLatest = useCallback(async () => {
    return api.get<PaginatedResponse<NotificationEntry>>(
      '/notifications?page=1&limit=20',
      { silent: true }
    );
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await api.get<{ count: number }>(
        '/notifications/unread-count',
        { silent: true }
      );
      if (data.count <= 0) {
        primed.current = true;
        return;
      }
      const latest = await fetchLatest().catch(() => null);
      if (!latest) return;
      if (!primed.current) {
        for (const n of latest.data) seenIds.current.add(n.id);
        primed.current = true;
        return;
      }
      // Bucket fresh items by type so a busy moderation hour doesn't spam.
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
      if (typeCount === 0) {
        // nothing actually new
      } else if (typeCount > 3) {
        toast.message(`${totalFresh} new notifications`, {
          action: {
            label: 'Open',
            onClick: () => {
              window.location.href = '/account?tab=notifications';
            }
          }
        });
      } else {
        for (const [type, batch] of freshByType) {
          if (batch.length === 1) {
            const n = batch[0]!;
            const href = hrefFor(n);
            toast.message(describeType(n), {
              description:
                (n.payload?.preview as string | undefined) ||
                (n.payload?.message as string | undefined) ||
                undefined,
              action: href
                ? {
                    label: 'Open',
                    onClick: () => {
                      window.location.href = href;
                    }
                  }
                : undefined
            });
          } else {
            toast.message(summarizeType(type, batch.length), {
              action: {
                label: 'See all',
                onClick: () => {
                  window.location.href = '/account?tab=notifications';
                }
              }
            });
          }
        }
      }
      if (seenIds.current.size > 200) {
        const arr = Array.from(seenIds.current);
        seenIds.current = new Set(arr.slice(arr.length - 200));
      }
    } catch {
      // silent — toast pipeline never toasts on poll failure
    }
  }, [isAuthenticated, fetchLatest]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, POLL_MS);
    // Re-check immediately on tab focus — a user who's been away will see
    // anything queued in the interim without waiting out the poll window.
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [refresh]);

  return null;
}
