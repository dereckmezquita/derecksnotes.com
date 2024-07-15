'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { IndicateLoading } from '@components/components/atomic/IndiacteLoading';
import { api } from '@components/utils/api/api';
import { useAuth } from '@components/context/AuthContext';

interface Comment {
    _id: string;
    content: string;
    author: {
        id: string;
        username: string;
    };
    createdAt: string;
    likes: string[];
    replies: string[];
}

interface CommentsResponse {
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
}

export function CommentsDemo() {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const [newComment, setNewComment] = useState('');
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        async function fetchComments() {
            setLoading(true);
            const toastId = toast.loading('Fetching comments...');
            try {
                const encodedPathname = encodeURIComponent(pathname);
                const response = await api.get<CommentsResponse>(
                    `/comments/${encodedPathname}?page=${page}&limit=10`
                );
                console.log(response.data.comments);
                setComments(response.data.comments);
                setTotalComments(response.data.total);
                toast.success('Comments loaded successfully', { id: toastId });
            } catch (error: any) {
                console.error('Error fetching comments:', error);
                toast.error(
                    'Failed to fetch comments. Please try again later.',
                    { id: toastId }
                );
            } finally {
                setLoading(false);
            }
        }

        fetchComments();
    }, [pathname, page]);

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
            setComments([response.data, ...comments]);
            setNewComment('');
            toast.success('Comment submitted successfully', { id: toastId });
        } catch (error) {
            console.error('Error submitting comment:', error);
            toast.error('Failed to submit comment. Please try again.', {
                id: toastId
            });
        }
    };

    if (authLoading) {
        return <IndicateLoading />;
    }

    return (
        <div>
            <h2>Comments for: {pathname}</h2>
            {loading ? (
                <IndicateLoading />
            ) : (
                <>
                    <p>Total comments: {totalComments}</p>
                    {user ? (
                        <form onSubmit={handleSubmitComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                required
                            />
                            <button type="submit">Submit Comment</button>
                        </form>
                    ) : (
                        <p>Please log in to leave a comment.</p>
                    )}
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment._id}>
                                <p>{comment.content}</p>
                                <small>
                                    By: {comment.author.username} on{' '}
                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                    {comments.length < totalComments && (
                        <button onClick={() => setPage(page + 1)}>
                            Load More
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
