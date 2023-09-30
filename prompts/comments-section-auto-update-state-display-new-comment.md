I have these components I created for my website for implementing comments functionality. Please help me to fix and complete them. I want to get all features working.

I am a student so please take my code as a start point, let's work on it modify it and get it to the final state.

Now I want to make it so that when a user submits a new comment we leverage the states to update the comments being rendered and add the new comment to the page. At the moment the user has to refresh the page so we fetch the new comment from the api. Instead what I want to do is get the response from the server and use that to update the dom to add their comment to the comments section being displayed.

First I will start by showing you what the server communications is like.

If you access the get_article_comments endpoint this is what the response from the server looks like:

```json
{
    "comments": [
        {
            "_id": "6516334978a1c4f861ecc94a",
            "childComments": [],
            "parentComment": null,
            "reportTarget": null,
            "mentions": [],
            "slug": "chemistry_general-chemistry_a_acid",
            "content": [
                {
                    "comment": "Some first comment!",
                    "_id": "6516334978a1c4f861ecc94b",
                    "createdAt": "2023-09-29T02:15:37.991Z",
                    "updatedAt": "2023-09-29T02:15:37.991Z"
                }
            ],
            "userId": "65150eaf09acd7d63838949b",
            "judgement": {},
            "deleted": false,
            "createdAt": "2023-09-29T02:15:37.991Z",
            "updatedAt": "2023-09-29T02:15:37.991Z",
            "likesCount": 0,
            "dislikesCount": 0,
            "totalJudgement": 0,
            "latestContent": {
                "comment": "Some first comment!",
                "_id": "6516334978a1c4f861ecc94b",
                "createdAt": "2023-09-29T02:15:37.991Z",
                "updatedAt": "2023-09-29T02:15:37.991Z"
            },
            "username": "dereck",
            "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg"
        }
    ],
    "total": 1,
    "hasMore": false
}
```

Now if you access the new_comment end point this is what the response from the server looks like; note this is a single object of one comment that we receive back.

```json
{
    "childComments": [],
    "parentComment": null,
    "reportTarget": null,
    "mentions": [],
    "slug": "chemistry_general-chemistry_a_acid",
    "content": [
        {
            "comment": "New comment received!",
            "_id": "651845ba4a09f09cce03e027",
            "createdAt": "2023-09-30T15:58:50.518Z",
            "updatedAt": "2023-09-30T15:58:50.518Z"
        }
    ],
    "userId": "65150eaf09acd7d63838949b",
    "judgement": {},
    "deleted": false,
    "_id": "651845ba4a09f09cce03e026",
    "createdAt": "2023-09-30T15:58:50.518Z",
    "updatedAt": "2023-09-30T15:58:50.518Z",
    "likesCount": 0,
    "dislikesCount": 0,
    "totalJudgement": 0,
    "latestContent": {
        "comment": "New comment received!",
        "_id": "651845ba4a09f09cce03e027",
        "createdAt": "2023-09-30T15:58:50.518Z",
        "updatedAt": "2023-09-30T15:58:50.518Z"
    },
    "username": "dereck",
    "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg"
}
```

Now here are the components that handle my comments section. Reminder our goal is to use the new_comment response from the server that we receive on the client to update the DOM and display the new comment to the user.

```tsx
import React, { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

import api_get_article_comments from '@utils/api/interact/get_article_comments';

interface CommentsSectionProps {
    slug: string;
    allowComments?: boolean;
}

const CommentSection: React.FC<CommentsSectionProps> = ({ slug, allowComments }) => {
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

    return (
        <div>
            {allowComments &&
                <CommentForm slug={slug} onSubmit={() => { }} />
            }
            <CommentList
                slug={slug}
                comments={comments?.comments || []}
            />
        </div>
    );
};

export default React.memo(CommentSection);
```

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import api_new_comment from '@utils/api/interact/new_comment';

import Button from '@components/atomic/Button';

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
    onSubmit: (comment: CommentInfo) => void; 
}

const CommentForm: React.FC<CommentFormProps> = ({ slug, parentComment, onSubmit }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const response = await api_new_comment(comment, slug, parentComment);
                console.log(response);
                if (response) {
                    onSubmit(response); // This should be called to update parent's state
                }
                setComment('');
            } catch (error: any) {
                console.error("Error submitting the comment:", error.message);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {parentComment ? null : <h2 style={{ marginTop: '20px' }}>Comments</h2>}
            <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={1}
            />
            <Button type="submit">Post</Button>
        </Form>
    );
};

export default CommentForm;
```

```tsx
import React from 'react';
import Comment from './Comment';

interface CommentListProps {
    comments: CommentInfo[];
    slug: string;
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
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
import path from 'path';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import api_get_comments_by_array_of_ids from '@utils/api/interact/get_comments_by_array_of_ids';
import { DEFAULT_PROFILE_IMAGE, ROOT_PUBLIC, MAX_COMMENT_DEPTH } from '@constants/config';
import CommentForm from './CommentForm';
import api_delete_comments from '@utils/api/interact/delete_comments';

const CommentContainer = styled.div`
    position: relative;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
`;

const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%; // Makes the image circular
    margin-right: 10px; // Spacing between image and username
`;

const Username = styled.span`
    font-weight: bold;
    font-family: ${theme.text.font.times};
    color: hsl(205, 70%, 50%);
`;

const CommentText = styled.p`
    font-family: ${theme.text.font.times};
    font-size: 0.9em;
    margin-bottom: 10px;
`;

const RepliesContainer = styled.div`
    position: relative;
    margin-left: 30px;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 2px;
        height: 100%;
        background-color: ${theme.container.border.colour.primary()};
    }
`;

const ActionsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const ActionButton = styled.button`
    background-color: transparent;
    border: none;
    font-family: ${theme.text.font.times};
    font-size: 0.8em;
    cursor: pointer;
    color: hsl(0, 0%, 70%);
    &:hover {
        color: hsl(205, 70%, 50%);
        text-decoration: underline;
    }
`;

interface CommentProps {
    comment: CommentInfo;
    slug: string; // used for the CommentForm replies
    depth: number;
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, slug, onReply, onEdit, onDelete, depth }) => {
    // ---------------------------------------------------
    // if user id of comment matches current viewer (session) then allow edit and delete buttons
    const currentUserId = useSelector((state: RootState) => state.user.data.userInfo._id);
    const isCurrentUser = currentUserId === comment.userId;

    const profilePhoto: string = comment.latestProfilePhoto ?
        path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', comment.latestProfilePhoto) :
        DEFAULT_PROFILE_IMAGE;

    // ---------------------------------------------------
    // toggle show reply button on off
    const [showReplyForm, setShowReplyForm] = useState(false);

    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    // ---------------------------------------------------
    // get replies of the comment
    const [replies, setReplies] = useState<CommentInfoResponse | null>(null);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                setReplies(await api_get_comments_by_array_of_ids(comment.childComments));
            } catch (error) {
                console.error('Failed to fetch replies:', error);
            }
        }

        fetchReplies();
    }, [comment.userId]); // Run the effect when comment.userId changes

    // ---------------------------------------------------
    // onClick load more replies
    const [loadedReplies, setLoadedReplies] = useState(5); // incrementor
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(comment.childComments.length > 5);

    const loadMoreReplies = async () => {
        try {
            const newReplies = await api_get_comments_by_array_of_ids(comment.childComments, loadedReplies + 5);
            setReplies(newReplies);
            setLoadedReplies(prev => prev + 5);

            // Hide "Load More" button if all replies are loaded
            setShowLoadMoreButton(newReplies.comments.length < loadedReplies + 5);
        } catch (error) {
            console.error('Failed to fetch more replies:', error);
        }
    }

    if (!replies) return null;

    // ---------------------------------------------------
    // onClick delete comment
    const handleDelete = async (commentId: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) return;

        try {
            await api_delete_comments([commentId]);
            // If the parent component provided onDelete callback, call it after successful deletion
            onDelete && onDelete(commentId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    return (
        <CommentContainer key={comment._id}>
            <CommentHeader>
                <UserProfile>
                    <ProfileImage src={profilePhoto} alt={`${comment.username}'s profile`} />
                    <Username>{comment.username}</Username>
                </UserProfile>
                <ActionsContainer>
                    {isCurrentUser && (<>
                        <ActionButton onClick={() => onEdit && onEdit(comment._id)}>edit</ActionButton>
                        {/* <ActionButton onClick={() => onDelete && onDelete(comment._id)}>delete</ActionButton> */}
                        <ActionButton onClick={() => handleDelete(comment._id)}>delete</ActionButton>
                    </>)}
                    {depth < MAX_COMMENT_DEPTH && <ActionButton onClick={toggleReplyForm}>reply</ActionButton>}
                </ActionsContainer>
            </CommentHeader>
            <CommentText>{comment.latestContent.comment}</CommentText>
            {showReplyForm &&
                <CommentForm slug={slug} parentComment={comment._id} onSubmit={() => { }} />
            }
            <RepliesContainer>
                {replies.comments.map((reply: CommentInfo) => (
                    <Comment
                        key={reply._id}
                        comment={reply}
                        slug={slug}
                        onReply={onReply}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        depth={depth + 1}
                    />
                ))}
                {showLoadMoreButton && (
                    <ActionButton onClick={loadMoreReplies}>Load More Replies</ActionButton>
                )}
            </RepliesContainer>
        </CommentContainer>
    );
};

export default Comment;
```