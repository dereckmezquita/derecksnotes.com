'use client';
import React, { useEffect, useState } from 'react';
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
import type { ReadHistoryEntry, PaginatedResponse } from '@derecksnotes/shared';
import { formatAccountDate } from './_shared/formatDate';

export function HistoryTab() {
  const [entries, setEntries] = useState<ReadHistoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadHistory = async (p: number) => {
    const data = await api.get<PaginatedResponse<ReadHistoryEntry>>(
      `/users/me/read-history?page=${p}&limit=20`
    );
    if (p === 1) setEntries(data.data);
    else setEntries((prev) => [...prev, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
  };

  useEffect(() => {
    loadHistory(1);
  }, []);

  return (
    <Card>
      <CardTitle>Read History</CardTitle>
      {entries.length === 0 ? (
        <EmptyState>No reading history yet.</EmptyState>
      ) : (
        entries.map((e, i) => (
          <InfoRow key={i}>
            <div>
              <InfoValue>
                <a href={`/${e.postSlug}`}>{e.postTitle || e.postSlug}</a>
              </InfoValue>
            </div>
            <InfoLabel>{formatAccountDate(e.readAt)}</InfoLabel>
          </InfoRow>
        ))
      )}
      {hasMore && (
        <ButtonRow>
          <Button $variant="secondary" onClick={() => loadHistory(page + 1)}>
            Load More
          </Button>
        </ButtonRow>
      )}
    </Card>
  );
}
