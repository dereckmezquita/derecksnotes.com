'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
import { TabBar, Tab } from '@/components/ui/PageStyles';

interface CommentsProps {
  slug: string;
  title: string;
}

type SortOption = 'new' | 'top' | 'best';

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
        <TabBar>
          {(['new', 'top', 'best'] as const).map((s) => (
            <Tab
              key={s}
              type="button"
              $active={sort === s}
              onClick={() => setSort(s)}
            >
              {s}
            </Tab>
          ))}
        </TabBar>
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
