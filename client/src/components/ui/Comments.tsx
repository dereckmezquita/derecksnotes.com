import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '@components/utils/api/api';
import { toast } from 'sonner';
import { IndicateLoading } from '../atomic/IndiacteLoading';

const CommentsContainer = styled.div`
    margin-top: 2rem;
    padding: 1rem;
    background-color: ${(props) =>
        props.theme.container.background.colour.primary()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
`;

const CommentForm = styled.form`
    margin-bottom: 1rem;
`;

const CommentInput = styled.textarea`
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    resize: vertical;
`;

const SubmitButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

const CommentList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const CommentItem = styled.li`
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: ${(props) =>
        props.theme.container.background.colour.secondary()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
    font-weight: bold;
`;

const CommentDate = styled.span`
    font-size: 0.8rem;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const CommentContent = styled.p`
    margin-bottom: 0.5rem;
`;

const CommentActions = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const ActionButton = styled.button`
    padding: 0.25rem 0.5rem;
    background-color: transparent;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            props.theme.container.background.colour.primary()};
    }
`;

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
        profilePhoto: string;
    };
    createdAt: string;
    updatedAt: string;
    likes: string[];
    dislikes: string[];
    replies: Comment[];
}

interface CommentsProps {
    postSlug: string;
}

export function Comments({ postSlug }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        fetchComments();
        fetchCurrentUser();
    }, [postSlug]);

    const fetchCurrentUser = async () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
        try {
            const response = await api.get('/auth/validate-session');
            if (response.data.user) {
                setCurrentUser(response.data.user);
                localStorage.setItem(
                    'userData',
                    JSON.stringify(response.data.user)
                );
            } else {
                setCurrentUser(null);
                localStorage.removeItem('userData');
            }
        } catch (error) {
            console.error('Error validating session:', error);
            setCurrentUser(null);
            localStorage.removeItem('userData');
        }
    };

    const fetchComments = async () => {
        const toastId = toast.loading('Fetching comments...');
        setLoading(true);
        try {
            const response = await api.get(`/comments/${postSlug}`);
            setComments(response.data);
            toast.success('Comments loaded successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to fetch comments', { id: toastId });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error('You must be logged in to comment');
            return;
        }
        const toastId = toast.loading('Posting comment...');
        try {
            const response = await api.post('/comments', {
                content: newComment,
                postSlug
            });
            setComments([response.data, ...comments]);
            setNewComment('');
            toast.success('Comment posted successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to post comment', { id: toastId });
        }
    };

    const handleEdit = async (commentId: string, newContent: string) => {
        const toastId = toast.loading('Updating comment...');
        try {
            const response = await api.put(`/comments/${commentId}`, {
                content: newContent
            });
            setComments(
                comments.map((comment) =>
                    comment._id === commentId ? response.data : comment
                )
            );
            setEditingComment(null);
            toast.success('Comment updated successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to update comment', { id: toastId });
        }
    };

    const handleDelete = async (commentId: string) => {
        const toastId = toast.loading('Deleting comment...');
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(
                comments.filter((comment) => comment._id !== commentId)
            );
            toast.success('Comment deleted successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to delete comment', { id: toastId });
        }
    };

    const handleLike = async (commentId: string) => {
        const toastId = toast.loading('Processing...');
        try {
            const response = await api.post(`/comments/${commentId}/like`);
            setComments(
                comments.map((comment) =>
                    comment._id === commentId ? response.data : comment
                )
            );
            toast.success('Comment liked', { id: toastId });
        } catch (error) {
            toast.error('Failed to like comment', { id: toastId });
        }
    };

    const handleDislike = async (commentId: string) => {
        const toastId = toast.loading('Processing...');
        try {
            const response = await api.post(`/comments/${commentId}/dislike`);
            setComments(
                comments.map((comment) =>
                    comment._id === commentId ? response.data : comment
                )
            );
            toast.success('Comment disliked', { id: toastId });
        } catch (error) {
            toast.error('Failed to dislike comment', { id: toastId });
        }
    };

    const renderComment = (comment: Comment, depth = 0) => (
        <CommentItem
            key={comment._id}
            style={{ marginLeft: `${depth * 20}px` }}
        >
            <CommentHeader>
                <CommentAuthor>{comment.author.username}</CommentAuthor>
                <CommentDate
                    title={`Created: ${new Date(comment.createdAt).toLocaleString()}`}
                >
                    {comment.updatedAt !== comment.createdAt
                        ? `Edited: ${new Date(comment.updatedAt).toLocaleString()}`
                        : new Date(comment.createdAt).toLocaleString()}
                </CommentDate>
            </CommentHeader>
            {editingComment === comment._id ? (
                <CommentForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit(
                            comment._id,
                            (e.target as HTMLFormElement).comment.value
                        );
                    }}
                >
                    <CommentInput
                        name="comment"
                        defaultValue={comment.content}
                    />
                    <SubmitButton type="submit">Update</SubmitButton>
                </CommentForm>
            ) : (
                <CommentContent>{comment.content}</CommentContent>
            )}
            <CommentActions>
                <ActionButton onClick={() => handleLike(comment._id)}>
                    Like ({comment.likes.length})
                </ActionButton>
                <ActionButton onClick={() => handleDislike(comment._id)}>
                    Dislike ({comment.dislikes.length})
                </ActionButton>
                {currentUser && currentUser._id === comment.author._id && (
                    <>
                        <ActionButton
                            onClick={() => setEditingComment(comment._id)}
                        >
                            Edit
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(comment._id)}>
                            Delete
                        </ActionButton>
                    </>
                )}
            </CommentActions>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </CommentItem>
    );

    if (loading) {
        return <IndicateLoading />;
    }

    return (
        <CommentsContainer>
            <h2>Comments</h2>
            {currentUser ? (
                <CommentForm onSubmit={handleSubmit}>
                    <CommentInput
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    />
                    <SubmitButton type="submit">Post Comment</SubmitButton>
                </CommentForm>
            ) : (
                <p>Please log in to leave a comment.</p>
            )}
            <CommentList>
                {comments.map((comment) => renderComment(comment))}
            </CommentList>
        </CommentsContainer>
    );
}
