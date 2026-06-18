'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { InfoLabel, InfoValue } from '@/components/ui/PageStyles';
import { RecordList } from '@/components/ui/RecordList';
import type { UserComment, PaginatedResponse } from '@derecksnotes/shared';
import { formatAccountDate } from './_shared/formatDate';

const DELETED_PLACEHOLDER = '[DELETED]';

export function CommentsTab() {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<UserComment>>(
        `/users/me/comments?page=${p}&limit=20`
      );
      setComments((prev) => (p === 1 ? data.data : [...prev, ...data.data]));
      setHasMore(data.hasMore);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const deleteSelected = async (selected: UserComment[]) => {
    const ids = selected.map((c) => c.id);
    await api.post('/users/me/comments/bulk-delete', { commentIds: ids });
    // Soft delete — keep the row, mark it deleted, and let the placeholder
    // replace the content. No re-fetch needed; the local mutation keeps the
    // user's scroll position stable.
    setComments((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, isDeleted: true } : c))
    );
    toast.success(`${ids.length} comment(s) deleted`);
  };

  return (
    <RecordList<UserComment>
      title="My Comments"
      items={comments}
      loading={loading}
      emptyMessage="No comments yet."
      hint="Tip: click a checkbox, then shift-click another to select a range."
      hasMore={hasMore}
      onLoadMore={() => load(page + 1)}
      isSelectable={(c) => !c.isDeleted}
      bulkActions={[
        {
          label: 'Delete',
          variant: 'danger',
          onAction: deleteSelected,
          confirm: (n) => `Delete ${n} comment${n === 1 ? '' : 's'}?`
        }
      ]}
      renderRow={(c) => (
        <>
          <InfoValue>
            {c.isDeleted
              ? DELETED_PLACEHOLDER
              : `${c.content.substring(0, 200)}${
                  c.content.length > 200 ? '…' : ''
                }`}
          </InfoValue>
          <br />
          <InfoLabel>
            on <a href={`/${c.slug}`}>{c.postTitle || c.slug}</a> —{' '}
            {formatAccountDate(c.createdAt)}
            {!c.approved && !c.isDeleted && ' — pending'}
          </InfoLabel>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              color: '#888'
            }}
          >
            <span title="Likes">+{c.likes}</span>
            <span title="Dislikes">−{c.dislikes}</span>
          </div>
        </>
      )}
    />
  );
}
