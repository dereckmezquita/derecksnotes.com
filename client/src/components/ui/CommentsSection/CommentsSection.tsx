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

    const pathname = encodeURIComponent(usePathname());
    const [page, setPage] = useState(1);
    // NOTE: use this to display n / N comments loaded
    const [totalLoaded, setTotalLoaded] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const fetchComments = useCallback(async () => {
        if (!displayComments) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Fetching comments...');
        try {
            const response = await api.get<CommentsResponse>(
                `/comments?post=${pathname}&depth=3&limit=1&page=${page}`
            );
            // NOTE: append because getting new page
            setComments((prev) => [...prev, ...response.data.comments]);
            setTotalComments(response.data.total);
            setTotalLoaded(response.data.total);
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
        // NOTE: prepend because new comment
        setComments((prev) => [newComment, ...prev]);
        setTotalLoaded((prevTotal) => prevTotal + 1);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (loading) {
        return <IndicateLoading />;
    }

    if (!displayComments) {
        return <p>Comments are currently disabled for this content.</p>;
    }

    return (
        <div>
            <h2>Comments</h2>
            <p>
                {totalLoaded} / {totalComments}
            </p>

            {allowNewComments && (
                <NewComment onCommentSubmitted={handleNewComment} />
            )}

            {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
            ))}

            {comments.length < totalComments && (
                <button onClick={handleLoadMore}>Load More</button>
            )}
        </div>
    );
}
