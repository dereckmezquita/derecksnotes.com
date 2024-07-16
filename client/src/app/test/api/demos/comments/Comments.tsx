'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { IndicateLoading } from '@components/components/atomic/IndiacteLoading';
import { api } from '@components/utils/api/api';
import { useAuth } from '@components/context/AuthContext';
import { LeaveComment } from './LeaveComment';
import { CommentList, Comment } from './CommentList';

interface CommentsResponse {
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
}

interface CommentsProps {
    allowNewComments?: boolean;
    displayComments?: boolean;
}

export function Comments({
    allowNewComments = true,
    displayComments = true
}: CommentsProps) {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();

    const fetchComments = useCallback(async () => {
        if (!displayComments) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Fetching comments...');
        try {
            const encodedPathname = encodeURIComponent(pathname);
            const response = await api.get<CommentsResponse>(
                `/comments?post=${encodedPathname}&page=${page}&limit=10`
            );
            setComments((prevComments) => [
                ...prevComments,
                ...response.data.comments
            ]);
            setTotalComments(response.data.total);
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

    const handleNewComment = (newComment: Comment) => {
        setComments((prevComments) => [newComment, ...prevComments]);
        setTotalComments((prevTotal) => prevTotal + 1);
    };

    const handleCommentUpdated = (updatedComment: Comment) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment._id === updatedComment._id ? updatedComment : comment
            )
        );
    };

    const handleCommentDeleted = (deletedCommentId: string) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== deletedCommentId)
        );
        setTotalComments((prevTotal) => prevTotal - 1);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (authLoading || loading) {
        return <IndicateLoading />;
    }

    if (!displayComments) {
        return (
            <div>
                <p>Comments are currently disabled for this content.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Comments for: {pathname}</h2>
            <p>Total comments: {totalComments}</p>

            {allowNewComments ? (
                <LeaveComment
                    user={user}
                    pathname={pathname}
                    onCommentSubmitted={handleNewComment}
                />
            ) : (
                <div>
                    <p>
                        New comments are currently disabled, but you can still
                        view existing comments.
                    </p>
                </div>
            )}

            <CommentList
                comments={comments}
                totalComments={totalComments}
                onLoadMore={handleLoadMore}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
            />
        </div>
    );
}
