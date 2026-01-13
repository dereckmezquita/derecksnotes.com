'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import {
    CommentList,
    CommentForm,
    CommentType,
    CommentResponse,
    CommentsContainer,
    CommentsTitle,
    LoadingSpinner
} from '@components/comments';

interface CommentsProps {
    postSlug: string;
}

export function Comments({ postSlug }: CommentsProps) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const normalizedSlug = postSlug.replace(/^\/+|\/+$/g, '');
            const res = await api.get<CommentResponse>(
                `/comments?postSlug=${encodeURIComponent(normalizedSlug)}`
            );
            setComments(res.data.comments);
            setError(null);
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            setError(
                error.response?.data?.error ||
                    'Failed to load comments. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postSlug) {
            fetchComments();
        }
    }, [postSlug]);

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

    return (
        <CommentsContainer>
            <CommentsTitle>Comments</CommentsTitle>

            {isAuthenticated() ? (
                <CommentForm onSubmit={handleAddComment} />
            ) : (
                <p style={{ marginBottom: '20px' }}>
                    <em>Please log in to leave a comment.</em>
                </p>
            )}

            {error && (
                <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <LoadingSpinner />
                    <p>Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <p>No comments yet. Be the first to comment!</p>
            ) : (
                <CommentList
                    comments={comments}
                    postSlug={postSlug}
                    currentUser={user}
                    onUpdateComment={updateCommentTree}
                    onAddReply={addReply}
                />
            )}
        </CommentsContainer>
    );
}
