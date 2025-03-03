'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';

interface CommentsProps {
    postSlug: string;
}

export interface CommentType {
    _id: string;
    text: string;
    author: {
        _id: string;
        username: string;
        firstName: string;
        lastName?: string;
        profilePhoto?: string;
    };
    createdAt: string;
    lastEditedAt?: string;
    likes: any[];
    dislikes: any[];
    deleted: boolean;
    revisions?: { text: string; timestamp: string }[];
    replies?: CommentType[];
}

interface CommentResponse {
    comments: CommentType[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    };
}

const CommentsContainer = styled.div`
    margin-top: 40px;
    padding: 20px;
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${(props) => props.theme.container.shadow.box};
    color: ${(props) => props.theme.text.colour.primary()};
`;

const CommentsTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 1.4em;
    font-variant: small-caps;
    color: ${(props) => props.theme.text.colour.primary()};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: 10px;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const PaginationInfo = styled.span`
    font-size: 0.9em;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const PaginationButtons = styled.div`
    display: flex;
    gap: 10px;
`;

const PageButton = styled.button<{ active?: boolean }>`
    padding: 5px 10px;
    background-color: ${(props) =>
        props.active
            ? props.theme.theme_colours[5]()
            : props.theme.container.background.colour.content()};
    color: ${(props) =>
        props.active ? 'white' : props.theme.text.colour.primary()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.9em;

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.active
                ? props.theme.theme_colours[5](undefined, undefined, 80)
                : props.theme.container.background.colour.light_contrast()};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LoadingSpinner = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left-color: ${(props) => props.theme.theme_colours[5]()};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

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

    const fetchComments = async (page = 1, limit = 20) => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            // Ensure the postSlug doesn't start with a slash to prevent double slashes in URL
            const formattedSlug = postSlug.startsWith('/')
                ? postSlug.substring(1)
                : postSlug;
            const res = await api.get<CommentResponse>(
                `/comments/post/${formattedSlug}?depth=3&limit=${limit}&skip=${skip}`
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
            const res = await api.post<CommentType>('/comments', {
                text,
                postSlug
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
        if (newPage !== pagination.page) {
            fetchComments(newPage, pagination.pageSize);
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
                                    disabled={pagination.page === 1}
                                >
                                    Previous
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
                                                >
                                                    {page}
                                                </PageButton>
                                            </React.Fragment>
                                        );
                                    })}

                                <PageButton
                                    onClick={() =>
                                        handlePageChange(pagination.page + 1)
                                    }
                                    disabled={
                                        pagination.page === pagination.pages
                                    }
                                >
                                    Next
                                </PageButton>
                            </PaginationButtons>
                        </PaginationContainer>
                    )}
                </>
            )}
        </CommentsContainer>
    );
}
