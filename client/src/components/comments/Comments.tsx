'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import type { CommentData } from '@derecksnotes/shared';
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

interface CommentsResponse {
    comments: CommentData[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export function Comments({ slug, title }: CommentsProps) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(
        async (pageNum: number, append: boolean = false) => {
            setLoading(true);
            try {
                const data = await api.get<CommentsResponse>(
                    `/comments?slug=${encodeURIComponent(slug)}&page=${pageNum}&limit=20&maxDepth=3`
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
        [slug]
    );

    useEffect(() => {
        fetchComments(1);
    }, [fetchComments]);

    const handleRefresh = () => {
        fetchComments(1);
    };

    const handleLoadMore = () => {
        fetchComments(page + 1, true);
    };

    return (
        <CommentsSection>
            <CommentsTitle>
                Comments{total > 0 ? ` (${total})` : ''}
            </CommentsTitle>

            <CommentForm
                slug={slug}
                title={title}
                onSubmitted={handleRefresh}
            />

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
