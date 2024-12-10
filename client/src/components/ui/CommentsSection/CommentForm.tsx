import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@utils/api/api';
import { useAuth } from '@context/AuthContext';
import { usePathname } from 'next/navigation';
import { CommentData } from './Comment';

interface CommentFormProps {
    onCommentSubmitted: (newComment: CommentData) => void;
    parentCommentId?: string;
    initialContent?: string;
    isEdit?: boolean;
}

export function CommentForm({
    onCommentSubmitted,
    parentCommentId,
    initialContent = '',
    isEdit = false
}: CommentFormProps) {
    const pathname = encodeURIComponent(usePathname());
    const { user } = useAuth();
    const [content, setContent] = useState(initialContent);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to submit a comment.');
            return;
        }
        const toastId = toast.loading(
            `${isEdit ? 'Updating' : 'Submitting'} comment...`
        );
        try {
            let response;
            if (isEdit) {
                response = await api.put(`/comments/${parentCommentId}`, {
                    content
                });
            } else {
                response = await api.post('/comments', {
                    content,
                    post: pathname,
                    author: user.id,
                    parentComment: parentCommentId
                });
            }
            setContent('');
            toast.success(
                `Comment ${isEdit ? 'updated' : 'submitted'} successfully`,
                { id: toastId }
            );
            onCommentSubmitted(response.data);
        } catch (error) {
            toast.error(
                `Failed to ${isEdit ? 'update' : 'submit'} comment. Please try again.`,
                { id: toastId }
            );
        }
    };

    if (!user && !isEdit) {
        return <p>Please log in to leave a comment.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                    isEdit ? 'Edit your comment...' : 'Write a comment...'
                }
                required
            />
            <button type="submit">
                {isEdit ? 'Update' : 'Submit'} Comment
            </button>
            {isEdit && (
                <button
                    type="button"
                    onClick={() => setContent(initialContent)}
                >
                    Cancel
                </button>
            )}
        </form>
    );
}
