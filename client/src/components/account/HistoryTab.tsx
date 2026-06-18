'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { InfoLabel, InfoValue, Button } from '@/components/ui/PageStyles';
import { RecordList } from '@/components/ui/RecordList';
import type { ReadHistoryEntry, PaginatedResponse } from '@derecksnotes/shared';
import { formatAccountDate } from './_shared/formatDate';

// History items don't currently carry a stable id from the API — we synth
// one from slug + readAt so RecordList's selection map stays stable across
// re-renders within a page.
interface HistoryRow extends ReadHistoryEntry {
  id: string;
}

export function HistoryTab() {
  const [entries, setEntries] = useState<HistoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<ReadHistoryEntry>>(
        `/users/me/read-history?page=${p}&limit=20`
      );
      const rows = data.data.map((e) => ({
        ...e,
        id: `${e.postSlug}::${e.readAt}`
      }));
      setEntries((prev) => (p === 1 ? rows : [...prev, ...rows]));
      setHasMore(data.hasMore);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const clearAll = async () => {
    if (!confirm('Clear your entire read history? This cannot be undone.'))
      return;
    try {
      await api.delete('/users/me/read-history');
      setEntries([]);
      toast.success('Read history cleared');
    } catch {
      toast.error('Failed to clear read history');
    }
  };

  const removeSelected = async (items: HistoryRow[]) => {
    const slugs = Array.from(new Set(items.map((i) => i.postSlug)));
    let removed = 0;
    for (const slug of slugs) {
      try {
        await api.delete('/users/me/read-history', { slug });
        removed++;
      } catch {
        // continue
      }
    }
    setEntries((prev) => prev.filter((e) => !slugs.includes(e.postSlug)));
    if (removed === slugs.length) toast.success(`Removed ${removed} entries`);
    else if (removed > 0)
      toast.warning(`Removed ${removed} of ${slugs.length}`);
    else toast.error('No entries removed');
  };

  return (
    <RecordList<HistoryRow>
      title="Read History"
      items={entries}
      loading={loading}
      emptyMessage="No reading history yet."
      hint="Tip: click a checkbox, then shift-click another to select a range."
      headerActions={
        entries.length > 0 && (
          <Button $variant="danger" onClick={clearAll}>
            Clear all
          </Button>
        )
      }
      hasMore={hasMore}
      onLoadMore={() => load(page + 1)}
      bulkActions={[
        {
          label: 'Remove',
          variant: 'danger',
          onAction: removeSelected,
          confirm: (n) =>
            `Remove ${n} read-history entr${n === 1 ? 'y' : 'ies'}?`
        }
      ]}
      renderRow={(e) => (
        <>
          <InfoValue>
            <a href={`/${e.postSlug}`}>{e.postTitle || e.postSlug}</a>
          </InfoValue>
          <br />
          <InfoLabel>Read {formatAccountDate(e.readAt)}</InfoLabel>
        </>
      )}
    />
  );
}
