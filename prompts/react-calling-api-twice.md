I am building an nextjs front end and an express server separately. I noticed that when my front end makes a request to the backend the request happens twice. Why is that and how to avoid it?

It was fine before when it was just retreiving data but now I am trying to implement a delete comment functionality and it's causing me errors.

Here is the front end that calls the delete_comment end point:

```tsx
import React, { useEffect, useState } from 'react';
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

    const handleDeleteComment = async (commentId: string) => {
        try {
            const deletedResponse = await api_delete_comments([commentId]);
            if (deletedResponse && deletedResponse.comments && deletedResponse.comments.length > 0) {
                setComments(prevState => {
                    if (prevState) {
                        return {
                            ...prevState,
                            comments: prevState.comments.filter(comment => comment._id !== deletedResponse.comments[0]._id)
                        };
                    }
                    return prevState;
                });
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

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

// styled components...

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
                        <ActionButton onClick={() => onEdit && onEdit(comment._id)}>
                            edit
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(comment._id)}>
                            delete
                        </ActionButton>
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

And here is the backend code end point. Note my backend api is being called twice on every api call from the front end.

```ts
import { Router } from 'express';

import CommentInfo from '@models/CommentInfo';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import mongoose, { mongo } from 'mongoose';

const delete_comments = Router();

delete_comments.use(isAuthenticated);

delete_comments.delete('/delete_comments', async (req, res) => {
    // instead of deleting the comment set the content to [deleted]
    try {
        const { commentIds } = req.body as { commentIds: string[] };

        if (!commentIds || !Array.isArray(commentIds)) return res.status(400).json({ message: "Comment Ids are required." });
        if (commentIds.length > 50) return res.status(400).json({ message: "Cannot delete more than 50 comments at once." });

        const userId = req.session.userId;

        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        const deletedComments = await CommentInfo.deleteManyOwnedByUser(commentIds, userId);

        deletedComments.map(comment => {
            if (comment.userId.toString() !== userId) {
                return res.status(401).json({ message: `You do not own this comment: ${comment._id}` });
            }
        })

        // get the user's username and profile photo
        const userInfo = await User.findOne({ _id: userId }) as { username: string, latestProfilePhoto: string } & mongoose.Document;

        if (!userInfo) return res.status(404).json({ message: "User not found." });

        const username = userInfo.username;
        const latestProfilePhoto = userInfo.latestProfilePhoto;

        const enrichedDeletedComments = deletedComments.map(comment => {
            const commentObj = comment.toObject({ virtuals: true, versionKey: false });
            delete commentObj.id;

            commentObj.username = username;
            commentObj.latestProfilePhoto = latestProfilePhoto;

            return commentObj;
        });

        const message: CommentInfoResponse = {
            comments: enrichedDeletedComments,
            total: enrichedDeletedComments.length,
            hasMore: false
        }

        res.status(200).json(message);
    } catch(error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;
```

Here is the method that is being called twice on DELETE:

```ts
commentInfoSchema.methods.markAsDeleted = function(this: CommentInfoDocument, userId: string) {
    if (this.userId.toString() !== userId) {
        throw new Error("You do not own this comment.");
    }

    console.log('Mongo: ', this.content[this.content.length - 1].comment);
    console.log('Mongo: ', this.content[this.content.length - 1].comment === "[deleted]")

    if (this.content[this.content.length - 1].comment === "[deleted]") {
        throw new Error("This comment has already been deleted.");
    }

    this.content.push({ comment: "[deleted]" });
}

// ---- static methods ----
commentInfoSchema.statics.deleteManyOwnedByUser = async function(this: any, commentIds: string[], userId: string) {
    const comments = await this.find({ _id: { $in: commentIds }, userId });

    if (comments.length !== commentIds.length) {
        throw new Error("Some comments do not belong to this user or do not exist.");
    }

    const promises = comments.map(async (comment: any) => {
        comment.markAsDeleted(userId);
        return comment.save();
    });

    return await Promise.all(promises);
};

// ---------------------------------------
// interface for adding virtuals and methods
interface CommentInfoModel extends mongoose.Model<CommentInfoDocument> {
    deleteManyOwnedByUser: (commentIds: string[], userId: string) => Promise<CommentInfoDocument[]>;
    findByUser: (userId: string) => Promise<CommentInfoDocument[]>;
    countByUser: (userId: string) => Promise<number>;
    commentsJudgedByUser: (userId: string) => Promise<CommentInfoDocument[]>;
    // ... any other static methods you add
}

interface CommentInfoDocument extends mongoose.Document {
    userId: ObjectId;
    content: { comment: string }[];
    judgement: Map<string, 'like' | 'dislike'>;
    likesCount: number;
    dislikesCount: number;
    totalJudgement: number;
    latestContent: () => { content: string, createdAt: Date, updatedAt: Date };
    setJudgement: (userId: string, judgement: 'like' | 'dislike') => void;
    markAsDeleted: (userId: string) => void;
    // ... any other methods or virtuals you add
}

const CommentInfo = mongoose.model<CommentInfoDocument, CommentInfoModel>('Comment', commentInfoSchema);

export default CommentInfo;
```

Here is the console logs from the server notice how it's being called twice on DELETE. Why and how to fix this?

```
Incoming request: DELETE /api/v3/interact/delete_comments
Mongo:  Comment
Mongo:  false
Incoming request: DELETE /api/v3/interact/delete_comments
Mongo:  [deleted]
Mongo:  true
```