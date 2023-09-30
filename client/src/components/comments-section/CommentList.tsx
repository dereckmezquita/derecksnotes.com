import React, { useEffect, useState } from 'react';
import Comment from './Comment';

interface CommentListProps {
    comments: CommentInfo[];
    slug: string;
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments: initialComments, slug, onReply, onEdit, onDelete }) => {
    const [comments, setComments] = useState<CommentInfo[]>(initialComments);
    console.log(comments);

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const handleDelete = (id: string) => {
        // Remove the deleted comment from the local state/UI
        setComments(prevComments => prevComments.filter(comment => comment._id !== id));
    };

    return (
        <>
            {comments.map(comment => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    slug={slug}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    depth={0}
                />
            ))}
        </>
    );
};

export default CommentList;