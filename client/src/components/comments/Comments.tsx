'use client';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { api } from '@/utils/api';
import type { CommentsListResponse } from '@derecksnotes/shared';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import {
  CommentsSection,
  CommentsTitle,
  NoCommentsMessage,
  LoadMoreButton
} from './CommentStyles';

interface CommentsProps {
  slug: string;
  title: string;
}

type SortOption = 'new' | 'top' | 'best';

const SortBar = styled.div`
  display: flex;
  gap: 6px;
  margin: 0.5rem 0;
`;

const SortChip = styled.button<{ $active: boolean }>`
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid
    ${(p) => (p.$active ? p.theme.text.colour.header() : 'rgba(0,0,0,0.18)')};
  background: ${(p) =>
    p.$active ? `${p.theme.text.colour.header()}18` : 'transparent'};
  color: ${(p) =>
    p.$active ? p.theme.text.colour.header() : p.theme.text.colour.primary()};
  text-transform: capitalize;
`;

export function Comments({ slug, title }: CommentsProps) {
  const [comments, setComments] = useState<CommentsListResponse['comments']>(
    []
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('new');

  const fetchComments = useCallback(
    async (
      pageNum: number,
      append: boolean = false,
      sortOpt: SortOption = sort
    ) => {
      setLoading(true);
      try {
        const data = await api.get<CommentsListResponse>(
          `/comments?slug=${encodeURIComponent(slug)}&page=${pageNum}&limit=20&maxDepth=3&sort=${sortOpt}`
        );
        if (append) {
          setComments((prev) => [...prev, ...data.comments]);
        } else {
          setComments(data.comments);
        }
        setHasMore(data.hasMore);
        setTotal(data.total);
        setPage(pageNum);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug]
  );

  useEffect(() => {
    fetchComments(1, false, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchComments, sort]);

  const handleRefresh = () => {
    fetchComments(1, false, sort);
  };

  const handleLoadMore = () => {
    fetchComments(page + 1, true, sort);
  };

  return (
    <CommentsSection>
      <CommentsTitle>Comments{total > 0 ? ` (${total})` : ''}</CommentsTitle>

      <CommentForm slug={slug} title={title} onSubmitted={handleRefresh} />

      {total > 0 && (
        <SortBar>
          {(['new', 'top', 'best'] as const).map((s) => (
            <SortChip key={s} $active={sort === s} onClick={() => setSort(s)}>
              {s}
            </SortChip>
          ))}
        </SortBar>
      )}

      {comments.length === 0 && !loading ? (
        <NoCommentsMessage>
          No comments yet. Be the first to comment.
        </NoCommentsMessage>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            slug={slug}
            title={title}
            onRefresh={handleRefresh}
          />
        ))
      )}

      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load more comments'}
        </LoadMoreButton>
      )}
    </CommentsSection>
  );
}
