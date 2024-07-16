import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@components/lib/dates';
import React from 'react';

// TODO: use shared interfaces between server and client
export interface Comment {
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

interface CommentListProps {
    comments: Comment[];
    totalComments: number;
    onLoadMore: () => void;
}

export function CommentList({
    comments,
    totalComments,
    onLoadMore
}: CommentListProps) {
    return (
        <div>
            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <p>{comment.content}</p>
                        <small>
                            By: {comment.author.username} on{' '}
                            {FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.createdAt)}
                        </small>
                    </li>
                ))}
            </ul>
            {comments.length < totalComments && (
                <button onClick={onLoadMore}>Load More</button>
            )}
        </div>
    );
}
