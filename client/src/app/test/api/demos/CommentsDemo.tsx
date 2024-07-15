'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { IndicateLoading } from '@components/components/atomic/IndiacteLoading';
import { api } from '@components/utils/api/api';

interface Comment {
    _id: string;
    content: string;
    author: string;
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

    useEffect(() => {
        async function fetchComments() {
            try {
                setLoading(true);
                const response = await api.get<CommentsResponse>(
                    `/comments/${pathname}?page=${page}&limit=10`
                );
                setComments(response.data.comments);
                setTotalComments(response.data.total);
            } catch (error) {
                console.error('Error fetching comments:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setLoading(false);
            }
        }

        fetchComments();
    }, [pathname, page]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/comments', {
                content: newComment,
                post: pathname,
                // You'll need to get the author ID from your auth system
                author: 'current-user-id'
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <div>
            <h2>Comments for: {pathname}</h2>
            {loading ? (
                <IndicateLoading />
            ) : (
                <>
                    <p>Total comments: {totalComments}</p>
                    <form onSubmit={handleSubmitComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            required
                        />
                        <button type="submit">Submit Comment</button>
                    </form>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment._id}>
                                <p>{comment.content}</p>
                                <small>
                                    By: {comment.author} on{' '}
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
