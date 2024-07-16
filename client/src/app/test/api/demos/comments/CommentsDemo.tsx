'use client';
import React, { useState, useEffect } from 'react';
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

export function CommentsDemo() {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchComments = async () => {
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
                toast.error(
                    'Failed to fetch comments. Please try again later.',
                    {
                        id: toastId
                    }
                );
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [pathname, page]);

    const handleNewComment = (newComment: Comment) => {
        setComments((prevComments) => [newComment, ...prevComments]);
        setTotalComments((prevTotal) => prevTotal + 1);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (authLoading || loading) {
        return <IndicateLoading />;
    }

    return (
        <div>
            <h2>Comments for: {pathname}</h2>
            <p>Total comments: {totalComments}</p>
            <LeaveComment
                user={user}
                pathname={pathname}
                onCommentSubmitted={handleNewComment}
            />
            <CommentList
                comments={comments}
                totalComments={totalComments}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
}
