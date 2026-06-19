'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { InfoLabel, InfoValue, Button } from '@/components/ui/PageStyles';
import { RecordList } from '@/components/ui/RecordList';
import { formatAccountDate } from './_shared/formatDate';

interface BookmarkEntry {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
}

export function BookmarksTab() {
  const [items, setItems] = useState<BookmarkEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await api.get<{
        data: BookmarkEntry[];
        hasMore: boolean;
      }>(`/users/me/bookmarks?page=${p}&limit=20`);
      setItems((prev) => (p === 1 ? data.data : [...prev, ...data.data]));
      setHasMore(data.hasMore);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const removeOne = async (b: BookmarkEntry) => {
    try {
      await api.delete('/posts/bookmark', { slug: b.slug });
      setItems((prev) => prev.filter((x) => x.slug !== b.slug));
      toast.success('Removed bookmark');
    } catch {
      toast.error('Failed to remove bookmark');
    }
  };

  const removeSelected = async (selected: BookmarkEntry[]) => {
    let removed = 0;
    for (const b of selected) {
      try {
        await api.delete('/posts/bookmark', { slug: b.slug });
        removed++;
      } catch {
        // continue
      }
    }
    const slugs = new Set(selected.map((b) => b.slug));
    setItems((prev) => prev.filter((b) => !slugs.has(b.slug)));
    if (removed === selected.length)
      toast.success(`Removed ${removed} bookmarks`);
    else if (removed > 0)
      toast.warning(`Removed ${removed} of ${selected.length}`);
    else toast.error('No bookmarks removed');
  };

  return (
    <RecordList<BookmarkEntry>
      title="Saved posts"
      items={items}
      loading={loading}
      emptyMessage="You haven't bookmarked anything yet."
      hint="Tip: click a checkbox, then shift-click another to select a range."
      hasMore={hasMore}
      onLoadMore={() => load(page + 1)}
      bulkActions={[
        {
          label: 'Remove',
          variant: 'danger',
          onAction: removeSelected,
          confirm: (n) => `Remove ${n} bookmark${n === 1 ? '' : 's'}?`
        }
      ]}
      renderRow={(b) => (
        <>
          <InfoValue>
            <a href={`/${b.slug}`}>{b.title || b.slug}</a>
          </InfoValue>
          <br />
          <InfoLabel>Saved {formatAccountDate(b.createdAt)}</InfoLabel>
        </>
      )}
      rowAction={(b) => (
        <Button $variant="secondary" onClick={() => removeOne(b)}>
          Remove
        </Button>
      )}
    />
  );
}
