'use client';
import React, { useState } from 'react';
import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@lib/dates';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import { CommentForm } from './CommentForm';

export interface CommentData {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    createdAt: string;
    likes: string[];
    replies: CommentData[];
    parentComment?: string;
    hasMoreReplies?: boolean;
}

interface CommentProps {
    comment: CommentData;
    depth: number;
    maxDisplayDepth: number;
}

export function Comment({ comment, depth, maxDisplayDepth }: CommentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [commentData, setCommentData] = useState(comment);
    const [isLoadingMoreReplies, setIsLoadingMoreReplies] = useState(false);
    const { user } = useAuth();

    const handleEditClick = () => setIsEditing(true);
    const handleReplyClick = () => setIsReplying(true);

    const handleCommentUpdate = (updatedComment: CommentData | null) => {
        if (updatedComment) {
            setCommentData(updatedComment);
        }
        setIsEditing(false);
    };

    const handleNewReply = (newReply: CommentData) => {
        setCommentData((prevComment) => ({
            ...prevComment,
            replies: [newReply, ...prevComment.replies],
            hasMoreReplies: true
        }));
        setIsReplying(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/comments/${commentData._id}`);
                setCommentData((prev) => ({
                    ...prev,
                    content: '[deleted comment]'
                }));
                toast.success('Comment deleted successfully');
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error('Failed to delete comment. Please try again.');
            }
        }
    };

    const handleLoadMoreReplies = async () => {
        setIsLoadingMoreReplies(true);
        try {
            const response = await api.get(
                `/comments/${commentData._id}/replies`
            );
            setCommentData((prevComment) => ({
                ...prevComment,
                replies: [...prevComment.replies, ...response.data.replies],
                hasMoreReplies: response.data.hasMoreReplies
            }));
        } catch (error) {
            console.error('Error loading more replies:', error);
            toast.error('Failed to load more replies. Please try again.');
        } finally {
            setIsLoadingMoreReplies(false);
        }
    };

    return (
        <div
            style={{
                border: '1px solid #333',
                padding: '1rem',
                margin: '1rem 0'
            }}
        >
            {isEditing ? (
                <CommentForm
                    onCommentSubmitted={handleCommentUpdate}
                    parentCommentId={commentData._id}
                    initialContent={commentData.content}
                    isEdit={true}
                />
            ) : (
                <div>
                    <p>{commentData.content}</p>
                    <small>
                        By: {commentData.author.username} on{' '}
                        {FORMAT_DATE_YYYY_MM_DD_HHMMSS(commentData.createdAt)}
                    </small>
                    {user && user.id === commentData.author._id && (
                        <div>
                            <button onClick={handleEditClick}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                    <button onClick={handleReplyClick}>Reply</button>
                </div>
            )}
            {isReplying && (
                <CommentForm
                    onCommentSubmitted={handleNewReply}
                    parentCommentId={commentData._id}
                />
            )}
            {depth < maxDisplayDepth &&
                commentData.replies &&
                commentData.replies.length > 0 && (
                    <div
                        style={{
                            borderLeft: '2px solid #333',
                            marginLeft: '1rem',
                            paddingLeft: '1rem'
                        }}
                    >
                        {commentData.replies.map((reply) => (
                            <Comment
                                key={reply._id}
                                comment={reply}
                                depth={depth + 1}
                                maxDisplayDepth={maxDisplayDepth}
                            />
                        ))}
                    </div>
                )}
            {depth >= maxDisplayDepth && commentData.hasMoreReplies && (
                <button
                    onClick={handleLoadMoreReplies}
                    disabled={isLoadingMoreReplies}
                >
                    {isLoadingMoreReplies ? 'Loading...' : 'Load More Replies'}
                </button>
            )}
        </div>
    );
}
