import React, { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

import api_get_article_comments from '@utils/api/interact/get_article_comments';

interface CommentsSectionProps {
    slug: string;
    allowComments?: boolean;
}

const CommentSection: React.FC<CommentsSectionProps> = ({ slug, allowComments }) => {
    // ----------------------------------------------------------------
    // load initial comments using slug from server
    const [comments, setComments] = useState<CommentInfoResponse>();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setComments(await api_get_article_comments(slug));
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        }

        fetchComments();
    }, [slug]);

    // -----------------
    // new comment update dom using callback from CommentForm
    const handleNewComment = (newComment: CommentInfo) => {
        // Add the new comment to the top of the comments list
        setComments(prevState => {
            if (prevState) {
                return {
                    ...prevState,
                    comments: [newComment, ...prevState.comments]
                };
            } else {
                return {
                    comments: [newComment],
                    total: 1,
                    hasMore: false
                };
            }
        });
    };

    return (
        <div>
            {allowComments &&
                <CommentForm slug={slug} onSubmit={handleNewComment} />
            }
            <CommentList
                slug={slug}
                comments={comments?.comments || []}
            />
        </div>
    );
};

export default React.memo(CommentSection);
