'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@utils/api/api';
import { useAuth } from '@context/AuthContext';
import { usePathname } from 'next/navigation';

interface LeaveCommentProps {
    onCommentSubmitted: (newComment: any) => void;
}

export function NewComment({ onCommentSubmitted }: LeaveCommentProps) {
    const pathname = encodeURIComponent(usePathname());
    const { user } = useAuth();
    const [newComment, setInput] = useState('');

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to submit a comment.');
            return;
        }
        const toastId = toast.loading('Submitting comment...');
        try {
            const response = await api.post('/comments', {
                content: newComment,
                post: pathname,
                author: user.id
            });
            setInput('');
            toast.success('Comment submitted successfully', { id: toastId });
            onCommentSubmitted(response.data);
        } catch (error: any) {
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
                style={{ display: 'block', width: '100%', marginBottom: '5px' }}
                value={newComment}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write a comment..."
                required
            />
            <button type="submit">Submit Comment</button>
        </form>
    );
}
