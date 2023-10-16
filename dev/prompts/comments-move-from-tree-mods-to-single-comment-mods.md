This is my comments section for my website. Here is how it all works.

When a user loads the page the comments section is attached to. There is a request made to the backend for the comments for that page. The backend sends a tree structure with comments and child comments nested. When a user makes a delete request the request id of the comment they are requesting be deleted is sent to the back end. The backend then soft deletes this comment by simply changing the content to be "[deleted]", the backend then sends back the same exact strucutre that is originally requested on page load.

I want you to review my code and help me revise it. Currently like I said I am storing comments in a state and then that state is worked on through callbacks. Instead I want each comment to have it's own state and then those can be modified if necessary.

I still want so that if a user adds a new comment or a reply then they should still be rendered on the screen without the user having to reload the page.

Here is the code I have for my comments section, please use this as a starting point. Please note that I am learning and not an expert. I am looking for guidance, please help me.

Please start by giving me back the fully revised code for the Comment component. Then instructions on how to modify the other components to work with the new Comment component. Also discuss and remove if necessary the callbacks.

```tsx
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
```
```tsx
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
```
```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import api_new_comment from '@utils/api/interact/new_comment';

import Button from '@components/atomic/Button';

import IndicateLoading from '@components/atomic/IndicateLoading';
import IndicateError from '@components/atomic/IndicateError';
import IndicateSuccess from '@components/atomic/IndicateSuccess';

const Form = styled.form`
    background-color: ${theme.container.background.colour.primary()};
    border-top: 1px dashed ${theme.container.border.colour.primary()};
    margin-top: 20px;
    margin-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
`;

const Input = styled.textarea`
    width: 100%;
    padding: 10px;
    font-family: ${theme.text.font.arial};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    resize: vertical;
    min-height: 100px;
`;

interface CommentFormProps {
    slug: string;
    parentComment?: string;
    onSubmit: (comment: CommentPopUserDTO) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ slug, parentComment, onSubmit }) => {
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [shouldRenderMessage, setShouldRenderMessage] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);  // Set loading state
        setMessage(null); // Clear any existing messages
        if (comment.trim()) {
            try {
                const response = await api_new_comment(comment, slug, parentComment);
                setIsLoading(false); // Reset loading state
                if (response) {
                    onSubmit(response);
                    setComment('');
                    setMessage('Comment posted successfully'); // Set success message
                } else {
                    setMessage('Failed to post comment'); // Handle non-successful response here
                }
            } catch (error: any) {
                setIsLoading(false); // Reset loading state
                setMessage('An error occurred while posting the comment'); // Set error message
                console.error("Error submitting the comment:", error.message);
            }
        } else {
            setIsLoading(false); // Reset loading state
            setMessage('Comment cannot be empty'); // Set message for empty comment
        }
    };

    // Function to clear the message and initiate the "animate out" process
    const clearMessage = () => {
        setShouldRenderMessage(false);
    };

    useEffect(() => {
        if (message) {
            setShouldRenderMessage(true);
            // Optionally, clear the message after a timeout, for example, 5 seconds
            const timerId = setTimeout(() => {
                clearMessage();
            }, 1000);

            // Cleanup
            return () => {
                clearTimeout(timerId);
            };
        }
    }, [message]);

    return (
        <Form onSubmit={handleSubmit}>
            {parentComment ? null : <h2 style={{ marginTop: '20px' }}>Comments</h2>}
            <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={1}
            />
            <Button type="submit" disabled={isLoading}>Post</Button>
            {isLoading &&
                <IndicateLoading />
            }
            {message && shouldRenderMessage && (
                message === 'Comment posted successfully' ?
                    <IndicateSuccess message={message} shouldRender={shouldRenderMessage} /> :
                    <IndicateError message={message} shouldRender={shouldRenderMessage} />
            )}
        </Form>
    );
};

export default CommentForm;
```
```tsx
import React, { useEffect, useState } from 'react';
import path from 'path';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import { DEFAULT_PROFILE_IMAGE, ROOT_PUBLIC, MAX_COMMENT_DEPTH } from '@constants/config';
import CommentForm from './CommentForm';
import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@constants/dates';

// styled components omitted for brevity

interface CommentProps {
    comment: CommentPopUserDTO;
    slug: string; // used for the CommentForm replies
    depth: number;
    onReply?: (id: any) => void;
    onEdit?: (id: string) => void;
    onDelete: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, slug, onReply, onEdit, onDelete, depth }) => {
    console.log("Rendering comment with ID:", comment._id);

    // ---------------------------------------------------
    // if user id of comment matches current viewer (session) then allow edit and delete buttons
    const userData = useSelector((state: RootState) => state.user);

    const currentUserId: string | undefined = userData?.data?.userInfo?._id;
    const isCurrentUser = currentUserId === comment.userId;

    const profilePhoto: string = comment.user?.latestProfilePhoto
        ? path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', comment.user?.latestProfilePhoto)
        : DEFAULT_PROFILE_IMAGE;


    // // ---------------------------------------------------
    // toggle show reply button on off
    const [showReplyForm, setShowReplyForm] = useState(false);

    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleDeleteComment = async (commentId: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) return;

        onDelete(commentId);
    };

    const [, forceUpdate] = useState({});

    return (
        <CommentContainer key={comment._id + comment.latestContent!._id!}>
            <CommentHeader>
                <UserProfile>
                    <ProfileImage src={profilePhoto} alt={`${comment.user.username}'s profile`} />
                    <Username currentUser={isCurrentUser}>{comment.user.username}</Username>
                </UserProfile>
                <ActionsContainer>
                    {isCurrentUser && (<>
                        <ActionButton onClick={() => onEdit && onEdit(comment._id!)}>
                            edit
                        </ActionButton>
                        <ActionButton onClick={() => handleDeleteComment(comment._id!)}>
                            delete
                        </ActionButton>
                    </>)}
                    {depth < MAX_COMMENT_DEPTH && <ActionButton onClick={toggleReplyForm}>reply</ActionButton>}
                </ActionsContainer>
            </CommentHeader>
            <CommentText>{comment.latestContent!.comment}</CommentText>
            <DateContainer>
                <CreatedAtDate>{FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.updatedAt!)}</CreatedAtDate>
                {comment.content.length > 1 &&
                    <UpdatedAtDate>Created: {FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.content[0].createdAt!)}</UpdatedAtDate>
                }
            </DateContainer>
            {showReplyForm &&
                <CommentForm
                    slug={slug}
                    parentComment={comment._id}
                    onSubmit={(newReply) => {
                        // Existing logic
                        if (comment._id === newReply.parentComment) {
                            comment.childComments = [...(comment.childComments as CommentPopUserDTO[]), newReply];
                            // Trigger re-render
                            forceUpdate({});
                        } else if (onReply) { // Otherwise, propagate the new reply to parent Comment
                            onReply(newReply);
                        }

                        // Close the reply form after a successful reply
                        setShowReplyForm(false);
                    }}
                />
            }
            {comment.childComments && comment.childComments.length > 0 && (
                <RepliesContainer>
                    {(comment.childComments as CommentPopUserDTO[]).map((child: CommentPopUserDTO) => (
                        <Comment
                            key={child._id! + child.latestContent?._id!}
                            comment={child}
                            slug={slug}
                            depth={depth + 1}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </RepliesContainer>
            )}
        </CommentContainer>
    );
};

export default React.memo(Comment, (prevProps, nextProps) => {
    return prevProps.comment._id === nextProps.comment._id &&
        prevProps.comment!.latestContent!._id === nextProps.comment!.latestContent!._id;
});
```