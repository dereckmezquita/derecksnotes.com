import React from 'react';
import Comment from './Comment';

interface CommentListProps {
    comments: CommentPopUserDTO[];
    slug: string;
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, slug, onReply, onEdit, onDelete }) => {
    return (
        <>
            {comments.map(comment => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    slug={slug}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    depth={0}
                />
            ))}
        </>
    );
};

export default CommentList;