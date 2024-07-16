'use client';
import React, { useState } from 'react';
import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@lib/dates';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';

// TODO: use shared interfaces between server and client
export interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    createdAt: string;
    likes: string[];
    replies: string[];
}

interface CommentListProps {
    comments: Comment[];
    totalComments: number;
    onLoadMore: () => void;
    onCommentUpdated: (updatedComment: Comment) => void;
    onCommentDeleted: (commentId: string) => void;
}

export function CommentList({
    comments,
    totalComments,
    onLoadMore,
    onCommentUpdated,
    onCommentDeleted
}: CommentListProps) {
    const { user } = useAuth();
    console.log(user);
    console.log(comments[0]);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
        null
    );
    const [editContent, setEditContent] = useState('');

    const handleEditClick = (comment: Comment) => {
        setEditingCommentId(comment._id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleSaveEdit = async (commentId: string) => {
        try {
            const response = await api.put(`/comments/${commentId}`, {
                content: editContent
            });
            onCommentUpdated(response.data);
            setEditingCommentId(null);
            setEditContent('');
            toast.success('Comment updated successfully');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment. Please try again.');
        }
    };

    const handleDelete = async (commentId: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/comments/${commentId}`);
                onCommentDeleted(commentId);
                toast.success('Comment deleted successfully');
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error('Failed to delete comment. Please try again.');
            }
        }
    };

    return (
        <div>
            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        {editingCommentId === comment._id ? (
                            <div>
                                <textarea
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                />
                                <button
                                    onClick={() => handleSaveEdit(comment._id)}
                                >
                                    Save
                                </button>
                                <button onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>{comment.content}</p>
                                <small>
                                    By: {comment.author.username} on{' '}
                                    {FORMAT_DATE_YYYY_MM_DD_HHMMSS(
                                        comment.createdAt
                                    )}
                                </small>
                                {user && user.id === comment.author._id && (
                                    <div>
                                        <button
                                            onClick={() =>
                                                handleEditClick(comment)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(comment._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {comments.length < totalComments && (
                <button onClick={onLoadMore}>Load More</button>
            )}
        </div>
    );
}
