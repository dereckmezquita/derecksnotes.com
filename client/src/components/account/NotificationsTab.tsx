'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { InfoLabel, InfoValue, Button } from '@/components/ui/PageStyles';
import { RecordList } from '@/components/ui/RecordList';
import type {
  NotificationEntry,
  PaginatedResponse
} from '@derecksnotes/shared';
import {
  describeType,
  hrefFor
} from '@/components/notifications/notification-helpers';
import { formatAccountDate } from './_shared/formatDate';

export function NotificationsTab() {
  const [items, setItems] = useState<NotificationEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<NotificationEntry>>(
        `/notifications?page=${p}&limit=20`
      );
      setItems((prev) => (p === 1 ? data.data : [...prev, ...data.data]));
      setHasMore(data.hasMore);
      setPage(p);
      const counts = await api
        .get<{ count: number }>('/notifications/unread-count', { silent: true })
        .catch(() => null);
      if (counts) setUnread(counts.count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const markOne = async (n: NotificationEntry) => {
    if (n.readAt) return;
    try {
      await api.post(`/notifications/${n.id}/read`, undefined, {
        silent: true
      });
      setItems((prev) =>
        prev.map((x) =>
          x.id === n.id
            ? { ...x, readAt: x.readAt || new Date().toISOString() }
            : x
        )
      );
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      // silent
    }
  };

  const markAll = async () => {
    try {
      await api.post('/notifications/read-all');
      const now = new Date().toISOString();
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || now })));
      setUnread(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteOne = async (n: NotificationEntry) => {
    try {
      await api.delete(`/notifications/${n.id}`);
      setItems((prev) => prev.filter((x) => x.id !== n.id));
      if (!n.readAt) setUnread((u) => Math.max(0, u - 1));
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const deleteSelected = async (selected: NotificationEntry[]) => {
    let removed = 0;
    let stillUnread = 0;
    for (const n of selected) {
      try {
        await api.delete(`/notifications/${n.id}`);
        removed++;
        if (!n.readAt) stillUnread++;
      } catch {
        // continue
      }
    }
    const ids = new Set(selected.map((n) => n.id));
    setItems((prev) => prev.filter((n) => !ids.has(n.id)));
    setUnread((u) => Math.max(0, u - stillUnread));
    if (removed === selected.length) toast.success(`Deleted ${removed}`);
    else if (removed > 0)
      toast.warning(`Deleted ${removed} of ${selected.length}`);
    else toast.error('Nothing deleted');
  };

  const titleText =
    unread > 0 ? `Notifications (${unread} unread)` : 'Notifications';

  return (
    <RecordList<NotificationEntry>
      title={titleText}
      items={items}
      loading={loading}
      emptyMessage="No notifications yet."
      hint="Tip: click a checkbox, then shift-click another to select a range."
      headerActions={
        unread > 0 && (
          <Button $variant="secondary" onClick={markAll}>
            Mark all read
          </Button>
        )
      }
      hasMore={hasMore}
      onLoadMore={() => load(page + 1)}
      isUnread={(n) => !n.readAt}
      bulkActions={[
        {
          label: 'Delete',
          variant: 'danger',
          onAction: deleteSelected,
          confirm: (n) => `Delete ${n} notification${n === 1 ? '' : 's'}?`
        }
      ]}
      renderRow={(n) => {
        const href = hrefFor(n);
        const body = (
          <>
            <InfoValue>{describeType(n)}</InfoValue>
            {n.payload?.preview ? (
              <>
                <br />
                <InfoLabel>{String(n.payload.preview)}</InfoLabel>
              </>
            ) : null}
            {n.payload?.message ? (
              <>
                <br />
                <InfoLabel>{String(n.payload.message)}</InfoLabel>
              </>
            ) : null}
            <br />
            <InfoLabel>{formatAccountDate(n.createdAt)}</InfoLabel>
          </>
        );
        return href ? (
          <Link
            href={href}
            onClick={() => markOne(n)}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {body}
          </Link>
        ) : (
          body
        );
      }}
      rowAction={(n) => (
        <>
          {!n.readAt && (
            <Button $variant="secondary" onClick={() => markOne(n)}>
              Mark read
            </Button>
          )}
          <Button $variant="danger" onClick={() => deleteOne(n)}>
            Delete
          </Button>
        </>
      )}
    />
  );
}
