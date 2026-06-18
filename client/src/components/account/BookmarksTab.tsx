'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  EmptyState,
  Button,
  ButtonRow,
  InfoRow,
  InfoLabel,
  InfoValue
} from '@/components/ui/PageStyles';
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

  if (loading && items.length === 0) {
    return (
      <Card>
        <CardTitle>Saved posts</CardTitle>
        <EmptyState>Loading…</EmptyState>
      </Card>
    );
  }
  if (items.length === 0) {
    return (
      <Card>
        <CardTitle>Saved posts</CardTitle>
        <EmptyState>You haven&apos;t bookmarked anything yet.</EmptyState>
      </Card>
    );
  }
  return (
    <Card>
      <CardTitle>Saved posts</CardTitle>
      {items.map((b) => (
        <InfoRow key={b.id}>
          <div>
            <InfoValue>
              <a href={`/${b.slug}`}>{b.title || b.slug}</a>
            </InfoValue>
            <br />
            <InfoLabel>Saved {formatAccountDate(b.createdAt)}</InfoLabel>
          </div>
        </InfoRow>
      ))}
      {hasMore && (
        <ButtonRow>
          <Button $variant="secondary" onClick={() => load(page + 1)}>
            Load more
          </Button>
        </ButtonRow>
      )}
    </Card>
  );
}
