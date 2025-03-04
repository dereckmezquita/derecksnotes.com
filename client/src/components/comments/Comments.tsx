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
    PaginationContainer,
    PaginationInfo,
    PaginationButtons,
    PageButton,
    LoadingSpinner
} from '@components/comments';

interface CommentsProps {
    postSlug: string;
}

export function Comments({ postSlug }: CommentsProps) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pageSize: 20,
        pages: 0
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    const fetchComments = async (page = 1, limit = 20) => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;

            // Normalize the slug to ensure consistent format between client and server
            const normalizedSlug = postSlug.replace(/^\/+|\/+$/g, '');

            const res = await api.get<CommentResponse>(
                `/comments/post/${normalizedSlug}?depth=3&limit=${limit}&skip=${skip}`
            );
            setComments(res.data.comments);
            setPagination(res.data.pagination);
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

    const handleAddComment = async (text: string) => {
        try {
            // Normalize the slug here too to maintain consistency
            const normalizedSlug = postSlug.replace(/^\/+|\/+$/g, '');

            const res = await api.post<CommentType>('/comments', {
                text,
                postSlug: normalizedSlug
            });
            setComments((prev) => [res.data, ...prev]);
            toast.success('Comment added successfully');
        } catch (error: any) {
            console.error('Error adding comment:', error);
            toast.error(
                error.response?.data?.error ||
                    'Failed to add comment. Please try again.'
            );
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage !== pagination.page && !isLoadingPage) {
            setIsLoadingPage(true);
            fetchComments(newPage, pagination.pageSize).finally(() =>
                setIsLoadingPage(false)
            );
        }
    };

    // Callback for updating comments after edit/delete/reply
    const updateCommentTree = (
        commentId: string,
        updateFn: (comment: CommentType) => CommentType
    ) => {
        const updateRecursive = (comments: CommentType[]): CommentType[] => {
            return comments.map((comment) => {
                if (comment._id === commentId) {
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

    // Function to add a reply to a specific comment
    const addReply = (parentId: string, newReply: CommentType) => {
        const addReplyRecursive = (comments: CommentType[]): CommentType[] => {
            return comments.map((comment) => {
                if (comment._id === parentId) {
                    return {
                        ...comment,
                        replies: [newReply, ...(comment.replies || [])]
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
                <>
                    <CommentList
                        comments={comments}
                        postSlug={postSlug}
                        currentUser={user}
                        onUpdateComment={updateCommentTree}
                        onAddReply={addReply}
                    />

                    {pagination.pages > 1 && (
                        <PaginationContainer>
                            <PaginationInfo>
                                Showing{' '}
                                {(pagination.page - 1) * pagination.pageSize +
                                    1}
                                -
                                {Math.min(
                                    pagination.page * pagination.pageSize,
                                    pagination.total
                                )}{' '}
                                of {pagination.total} comments
                            </PaginationInfo>

                            <PaginationButtons>
                                <PageButton
                                    onClick={() =>
                                        handlePageChange(pagination.page - 1)
                                    }
                                    disabled={
                                        pagination.page === 1 || isLoadingPage
                                    }
                                >
                                    {isLoadingPage && pagination.page > 1 ? (
                                        <LoadingSpinner />
                                    ) : (
                                        'Previous'
                                    )}
                                </PageButton>

                                {Array.from(
                                    { length: pagination.pages },
                                    (_, i) => i + 1
                                )
                                    .filter((page) => {
                                        // Show first, last, current and pages close to current
                                        return (
                                            page === 1 ||
                                            page === pagination.pages ||
                                            Math.abs(page - pagination.page) <=
                                                1
                                        );
                                    })
                                    .map((page, index, array) => {
                                        // Add ellipsis if there are gaps
                                        const showEllipsisBefore =
                                            index > 0 &&
                                            array[index - 1] !== page - 1;

                                        return (
                                            <React.Fragment key={page}>
                                                {showEllipsisBefore && (
                                                    <span>...</span>
                                                )}
                                                <PageButton
                                                    active={
                                                        page === pagination.page
                                                    }
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    disabled={isLoadingPage}
                                                >
                                                    {isLoadingPage &&
                                                    page === pagination.page ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        page
                                                    )}
                                                </PageButton>
                                            </React.Fragment>
                                        );
                                    })}

                                <PageButton
                                    onClick={() =>
                                        handlePageChange(pagination.page + 1)
                                    }
                                    disabled={
                                        pagination.page === pagination.pages ||
                                        isLoadingPage
                                    }
                                >
                                    {isLoadingPage &&
                                    pagination.page < pagination.pages ? (
                                        <LoadingSpinner />
                                    ) : (
                                        'Next'
                                    )}
                                </PageButton>
                            </PaginationButtons>
                        </PaginationContainer>
                    )}
                </>
            )}
        </CommentsContainer>
    );
}
