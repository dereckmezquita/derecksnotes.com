'use client';
import React, { useState } from 'react';
import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@lib/dates';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';

export interface CommentData {
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

interface CommentProps {
    comment: CommentData;
}

export function Comment({ comment }: CommentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const { user } = useAuth();

    const handleEditClick = () => {
        setIsEditing(true);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(comment.content);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await api.put<CommentData>(
                `/comments/${comment._id}`,
                {
                    content: editContent
                }
            );
            // onUpdate(response.data);
            setIsEditing(false);
            toast.success('Comment updated successfully');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/comments/${comment._id}`);
                // onDelete(comment._id);
                toast.success('Comment deleted successfully');
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error('Failed to delete comment. Please try again.');
            }
        }
    };

    return (
        <div className="comment">
            {isEditing ? (
                <div>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>{comment.content}</p>
                    <small>
                        By: {comment.author.username} on{' '}
                        {FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.createdAt)}
                    </small>
                    {user && user.id === comment.author._id && (
                        <div>
                            <button onClick={handleEditClick}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
