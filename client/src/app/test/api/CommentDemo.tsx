'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@components/utils/api/api';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useAuth } from '@components/context/AuthContext';

interface IComment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    likes: string[];
    replies?: IComment[];
}

const CommentSection = styled.div`
    margin-top: 30px;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
`;

const Comment = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
`;

const CommentForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const CommentInput = styled.textarea`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const ActionButton = styled.button`
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;

    &:hover {
        background-color: #0056b3;
    }
`;

const CommentDemo: React.FC = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [editingComment, setEditingComment] = useState<IComment | null>(null);
    const [replyingTo, setReplyingTo] = useState<IComment | null>(null);

    const hardcodedSlug = 'test-post-slug';

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await api.get<{ comments: IComment[] }>(
                `/comments/${hardcodedSlug}?depth=2`
            );
            setComments(response.data.comments);
        } catch (error) {
            toast.error('Failed to fetch comments');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to post a comment');
            return;
        }
        try {
            if (editingComment) {
                await api.put(`/comments/${editingComment._id}`, {
                    content: newComment
                });
                toast.success('Comment updated successfully');
            } else if (replyingTo) {
                await api.post('/comments', {
                    content: newComment,
                    post: hardcodedSlug,
                    parentComment: replyingTo._id,
                    author: user.id
                });
                toast.success('Reply added successfully');
            } else {
                await api.post('/comments', {
                    content: newComment,
                    post: hardcodedSlug,
                    author: user.id
                });
                toast.success('Comment added successfully');
            }
            setNewComment('');
            setEditingComment(null);
            setReplyingTo(null);
            fetchComments();
        } catch (error) {
            toast.error('Failed to submit comment');
        }
    };

    const handleEdit = (comment: IComment) => {
        setEditingComment(comment);
        setNewComment(comment.content);
        setReplyingTo(null);
    };

    const handleReply = (comment: IComment) => {
        setReplyingTo(comment);
        setEditingComment(null);
        setNewComment('');
    };

    const handleDelete = async (commentId: string) => {
        try {
            await api.delete(`/comments/${commentId}`);
            toast.success('Comment deleted successfully');
            fetchComments();
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleLike = async (commentId: string) => {
        if (!user) {
            toast.error('Please log in to like comments');
            return;
        }
        try {
            await api.post(`/comments/${commentId}/like`, { userId: user.id });
            toast.success('Comment liked');
            fetchComments();
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const renderComment = (comment: IComment, depth = 0) => (
        <Comment key={comment._id} style={{ marginLeft: `${depth * 20}px` }}>
            <p>{comment.content}</p>
            <p>By: {comment.author.username}</p>
            <p>Likes: {comment.likes.length}</p>
            {user && user.id === comment.author._id && (
                <ActionButton onClick={() => handleEdit(comment)}>
                    Edit
                </ActionButton>
            )}
            <ActionButton onClick={() => handleReply(comment)}>
                Reply
            </ActionButton>
            {user &&
                (user.id === comment.author._id || user.role === 'admin') && (
                    <ActionButton onClick={() => handleDelete(comment._id)}>
                        Delete
                    </ActionButton>
                )}
            <ActionButton onClick={() => handleLike(comment._id)}>
                Like
            </ActionButton>
            {comment.replies &&
                comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </Comment>
    );

    return (
        <CommentSection>
            <h2>Comment System Demo</h2>
            {user ? (
                <CommentForm onSubmit={handleSubmit}>
                    <CommentInput
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={
                            editingComment
                                ? 'Edit your comment'
                                : replyingTo
                                  ? `Reply to ${replyingTo.author.username}`
                                  : 'Add a comment'
                        }
                    />
                    <ActionButton type="submit">
                        {editingComment
                            ? 'Update Comment'
                            : replyingTo
                              ? 'Post Reply'
                              : 'Post Comment'}
                    </ActionButton>
                    {(editingComment || replyingTo) && (
                        <ActionButton
                            onClick={() => {
                                setEditingComment(null);
                                setReplyingTo(null);
                                setNewComment('');
                            }}
                        >
                            Cancel
                        </ActionButton>
                    )}
                </CommentForm>
            ) : (
                <p>Please log in to post comments.</p>
            )}
            {comments.map((comment) => renderComment(comment))}
        </CommentSection>
    );
};

export default CommentDemo;
