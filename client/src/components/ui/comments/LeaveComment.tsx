import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@components/utils/api/api';
import { User } from '@components/context/AuthContext';

interface LeaveCommentProps {
    user: User | null;
    pathname: string;
    onCommentSubmitted: (newComment: any) => void;
}

export function LeaveComment({
    user,
    pathname,
    onCommentSubmitted
}: LeaveCommentProps) {
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to submit a comment.');
            return;
        }
        const toastId = toast.loading('Submitting comment...');
        try {
            const encodedPathname = encodeURIComponent(pathname);
            const response = await api.post('/comments', {
                content: newComment,
                post: encodedPathname,
                author: user.id
            });
            setNewComment('');
            toast.success('Comment submitted successfully', { id: toastId });
            onCommentSubmitted(response.data);
        } catch (error) {
            console.error('Error submitting comment:', error);
            toast.error('Failed to submit comment. Please try again.', {
                id: toastId
            });
        }
    };

    if (!user) {
        return <p>Please log in to leave a comment.</p>;
    }

    return (
        <form onSubmit={handleSubmitComment}>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                required
            />
            <button type="submit">Submit Comment</button>
        </form>
    );
}
