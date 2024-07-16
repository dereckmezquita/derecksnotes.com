'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { IndicateLoading } from '@components/atomic/IndiacteLoading';
import { api } from '@utils/api/api';
import { NewComment } from './NewComment';
import { Comment, CommentData } from './Comment';

interface CommentsResponse {
    comments: CommentData[];
    total: number;
    page: number;
    limit: number;
}

interface CommentsSectionProps {
    allowNewComments?: boolean;
    displayComments?: boolean;
}

export function CommentsSection({
    allowNewComments = true,
    displayComments = true
}: CommentsSectionProps) {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [page, setPage] = useState(1);
    const [totalLoaded, setTotalLoaded] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const pathname = encodeURIComponent(usePathname());
    const MAX_PER_PAGE = 1;
    const MAX_DEPTH = 3;

    const fetchComments = useCallback(async () => {
        if (!displayComments) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Fetching comments...');
        try {
            const response = await api.get<CommentsResponse>(
                `/comments?post=${pathname}&depth=${MAX_DEPTH}&limit=${MAX_PER_PAGE}&page=${page}`
            );
            // NOTE: append since getting new page
            setComments((prevComments) => [
                ...prevComments,
                ...response.data.comments
            ]);
            setTotalComments(response.data.total);
            setTotalLoaded(
                (prevLoaded) => prevLoaded + response.data.comments.length
            );
            toast.success('Comments loaded successfully', { id: toastId });
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to fetch comments. Please try again later.', {
                id: toastId
            });
        } finally {
            setLoading(false);
        }
    }, [pathname, page, displayComments]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleNewComment = (newComment: CommentData) => {
        setComments((prevComments) => [newComment, ...prevComments]);
        setTotalLoaded((prevLoaded) => prevLoaded + 1);
        setTotalComments((prevTotal) => prevTotal + 1);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (loading && page === 1) {
        return <IndicateLoading />;
    }

    if (!displayComments) {
        return <p>Comments are currently disabled for this content.</p>;
    }

    return (
        <div>
            <h2>Comments</h2>
            <p>
                {totalLoaded} / {totalComments} comments
            </p>

            {allowNewComments && (
                <NewComment onCommentSubmitted={handleNewComment} />
            )}

            {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
            ))}

            {totalLoaded < totalComments && (
                <button onClick={handleLoadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            )}
        </div>
    );
}
