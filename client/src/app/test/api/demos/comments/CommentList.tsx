import React from 'react';

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
                            {new Date(comment.createdAt).toLocaleString()}
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
