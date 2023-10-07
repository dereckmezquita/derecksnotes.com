import React, { useEffect, useState, useCallback } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

import api_get_article_comments from '@utils/api/interact/get_article_comments';
import api_delete_comments from '@utils/api/interact/delete_comments';

interface CommentsSectionProps {
    slug: string;
    allowComments?: boolean;
}

const CommentSection: React.FC<CommentsSectionProps> = ({ slug, allowComments }) => {
    // ----------------------------------------------------------------
    // load initial comments using slug from server
    const [comments, setComments] = useState<CommentsBySlugDTO>();

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

    const updateCommentReplies = (comments: CommentPopUserDTO[], newReply: CommentPopUserDTO): CommentPopUserDTO[] => {
        return comments.map(comment => {
            if (comment._id === newReply.parentComment) {
                comment.childComments = [...(comment.childComments as CommentPopUserDTO[]), newReply];
                return comment;
            } else {
                comment.childComments = updateCommentReplies(comment.childComments as CommentPopUserDTO[], newReply);
                return comment;
            }
        });
    }

    // -----------------
    // new comment update dom using callback from CommentForm
    const handleNewComment = useCallback((newComment: CommentPopUserDTO) => {
        if (newComment.parentComment) {
            setComments(prevState => {
                if (prevState && prevState.comments) {
                    return {
                        ...prevState,
                        comments: updateCommentReplies(prevState.comments, newComment)
                    };
                }
                return prevState;
            });
        } else {
            // The existing logic to handle new top-level comments
            setComments(prevState => {
                if (prevState) {
                    return {
                        ...prevState,
                        comments: [newComment, ...prevState.comments]
                    };
                } else {
                    return {
                        comments: [newComment],
                        hasMore: false
                    };
                }
            });
        }
    }, []);

    const handleDeleteComment = useCallback(async (commentId: string) => {
        try {
            const deletedCommentRes: CommentsBySlugDTO = await api_delete_comments([commentId]);
            const deletedComment: CommentPopUserDTO = deletedCommentRes.comments[0];

            setComments(prevState => {
                if (!prevState) return undefined;

                const findAndReplaceComment = (comments: CommentPopUserDTO[]): CommentPopUserDTO[] => {
                    return comments.map(comment => {
                        if (comment._id === deletedComment._id) {
                            return deletedComment;
                        }
                        if (comment.childComments && comment.childComments.length) {
                            return {
                                ...comment,
                                childComments: findAndReplaceComment(comment.childComments as CommentPopUserDTO[])
                            };
                        }
                        return comment;
                    });
                };

                return {
                    ...prevState,
                    comments: findAndReplaceComment(prevState.comments)
                };
            });
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    }, []);

    return (
        <div>
            {allowComments &&
                <CommentForm slug={slug} onSubmit={handleNewComment} />
            }
            <CommentList
                slug={slug}
                comments={comments?.comments || []}
                onDelete={handleDeleteComment}
            />
        </div>
    );
};

export default React.memo(CommentSection);

// CONTINUE: need to be able to modify the comments tree directly, to delete reply. Currently if reply and then delete the reply nothing happens.