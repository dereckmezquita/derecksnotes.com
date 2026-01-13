'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import {
    CommentList,
    CommentForm,
    CommentType,
    CommentResponse,
    CommentPagination,
    CommentsContainer,
    CommentsTitle,
    LoadingSpinner,
    LoadingContainer,
    LoadingText,
    ErrorContainer,
    RetryButton,
    LoginPrompt,
    LoadMoreButton
} from '@components/comments';

interface CommentsProps {
    postSlug: string;
}

export function Comments({ postSlug }: CommentsProps) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<CommentPagination | null>(
        null
    );

    const fetchComments = useCallback(
        async (page: number = 1, append: boolean = false) => {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);
            try {
                const normalizedSlug = postSlug.replace(/^\/+|\/+$/g, '');
                const res = await api.get<CommentResponse>(
                    `/comments?postSlug=${encodeURIComponent(normalizedSlug)}&page=${page}`
                );
                if (append) {
                    setComments((prev) => [...prev, ...res.data.comments]);
                } else {
                    setComments(res.data.comments);
                }
                setPagination(res.data.pagination);
            } catch (error: any) {
                console.error('Error fetching comments:', error);
                setError(
                    error.response?.data?.error ||
                        'Failed to load comments. Please try again.'
                );
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [postSlug]
    );

    useEffect(() => {
        if (postSlug) {
            fetchComments();
        }
    }, [postSlug, fetchComments]);

    const handleLoadMore = useCallback(() => {
        if (pagination && pagination.hasMore && !loadingMore) {
            fetchComments(pagination.page + 1, true);
        }
    }, [pagination, loadingMore, fetchComments]);

    const handleAddComment = async (content: string) => {
        try {
            const normalizedSlug = postSlug.replace(/^\/+|\/+$/g, '');
            const res = await api.post<{
                comment: CommentType;
                message: string;
            }>('/comments', {
                postSlug: normalizedSlug,
                content
            });
            setComments((prev) => [
                { ...res.data.comment, replies: [] },
                ...prev
            ]);
            // Update pagination total count
            if (pagination) {
                setPagination({
                    ...pagination,
                    totalTopLevel: pagination.totalTopLevel + 1
                });
            }

            if (res.data.comment.approved) {
                toast.success('Comment added successfully');
            } else {
                toast.success('Comment submitted for approval');
            }
        } catch (error: any) {
            console.error('Error adding comment:', error);
            toast.error(
                error.response?.data?.error ||
                    'Failed to add comment. Please try again.'
            );
        }
    };

    const updateCommentTree = (
        commentId: string,
        updateFn: (comment: CommentType) => CommentType
    ) => {
        const updateRecursive = (comments: CommentType[]): CommentType[] => {
            return comments.map((comment) => {
                if (comment.id === commentId) {
                    return updateFn(comment);
                }
                if (comment.replies && comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: updateRecursive(comment.replies)
                    };
                }
                return comment;
            });
        };

        setComments((prev) => updateRecursive(prev));
    };

    const addReply = (parentId: string, newReply: CommentType) => {
        const addReplyRecursive = (comments: CommentType[]): CommentType[] => {
            return comments.map((comment) => {
                if (comment.id === parentId) {
                    return {
                        ...comment,
                        replies: [
                            { ...newReply, replies: [] },
                            ...(comment.replies || [])
                        ]
                    };
                }
                if (comment.replies && comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: addReplyRecursive(comment.replies)
                    };
                }
                return comment;
            });
        };

        setComments((prev) => addReplyRecursive(prev));
    };

    const commentCount = pagination?.totalTopLevel ?? comments.length;

    return (
        <CommentsContainer>
            <CommentsTitle>
                Comments{commentCount > 0 && ` (${commentCount})`}
            </CommentsTitle>

            {isAuthenticated() ? (
                <CommentForm onSubmit={handleAddComment} />
            ) : (
                <LoginPrompt>
                    <p>
                        Please <a href="/login">log in</a> to leave a comment.
                    </p>
                </LoginPrompt>
            )}

            {error && (
                <ErrorContainer role="alert">
                    <p>{error}</p>
                    <RetryButton onClick={() => fetchComments()}>
                        Try Again
                    </RetryButton>
                </ErrorContainer>
            )}

            {loading ? (
                <LoadingContainer aria-busy="true" aria-live="polite">
                    <LoadingSpinner />
                    <LoadingText>Loading comments...</LoadingText>
                </LoadingContainer>
            ) : (
                <>
                    <CommentList
                        comments={comments}
                        postSlug={postSlug}
                        currentUser={user}
                        onUpdateComment={updateCommentTree}
                        onAddReply={addReply}
                    />

                    {pagination?.hasMore && (
                        <LoadMoreButton
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            aria-busy={loadingMore}
                        >
                            {loadingMore
                                ? 'Loading...'
                                : `Load more comments (${comments.length} of ${pagination.totalTopLevel})`}
                        </LoadMoreButton>
                    )}
                </>
            )}
        </CommentsContainer>
    );
}
