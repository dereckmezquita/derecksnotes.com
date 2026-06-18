'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import type { UserComment, PaginatedResponse } from '@derecksnotes/shared';
import { formatAccountDate } from './_shared/formatDate';

export function CommentsTab() {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadComments = async (p: number) => {
    const data = await api.get<PaginatedResponse<UserComment>>(
      `/users/me/comments?page=${p}&limit=20`
    );
    if (p === 1) setComments(data.data);
    else setComments((prev) => [...prev, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
  };

  useEffect(() => {
    loadComments(1);
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} comment(s)?`)) return;
    try {
      await api.post('/users/me/comments/bulk-delete', {
        commentIds: Array.from(selected)
      });
      toast.success(`${selected.size} comment(s) deleted`);
      setSelected(new Set());
      loadComments(1);
    } catch {
      toast.error('Failed to delete comments');
    }
  };

  return (
    <Card>
      <CardTitle>My Comments</CardTitle>
      {selected.size > 0 && (
        <ButtonRow>
          <Button $variant="danger" onClick={bulkDelete}>
            Delete Selected ({selected.size})
          </Button>
          <Button $variant="secondary" onClick={() => setSelected(new Set())}>
            Clear Selection
          </Button>
        </ButtonRow>
      )}
      {comments.length === 0 ? (
        <EmptyState>No comments yet.</EmptyState>
      ) : (
        comments.map((c) => (
          <InfoRow key={c.id}>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
                flex: 1
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(c.id)}
                onChange={() => toggle(c.id)}
                disabled={c.isDeleted}
              />
              <div style={{ flex: 1 }}>
                <InfoValue
                  style={{
                    textDecoration: c.isDeleted ? 'line-through' : 'none'
                  }}
                >
                  {c.content.substring(0, 100)}
                  {c.content.length > 100 ? '...' : ''}
                </InfoValue>
                <br />
                <InfoLabel>
                  on <a href={`/${c.slug}`}>{c.postTitle || c.slug}</a> —{' '}
                  {formatAccountDate(c.createdAt)}
                  {!c.approved && ' — pending'}
                  {c.isDeleted && ' — deleted'}
                </InfoLabel>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                fontSize: '0.75rem'
              }}
            >
              <span title="Likes">+{c.likes}</span>
              <span title="Dislikes">-{c.dislikes}</span>
            </div>
          </InfoRow>
        ))
      )}
      {hasMore && (
        <ButtonRow>
          <Button $variant="secondary" onClick={() => loadComments(page + 1)}>
            Load More
          </Button>
        </ButtonRow>
      )}
    </Card>
  );
}
