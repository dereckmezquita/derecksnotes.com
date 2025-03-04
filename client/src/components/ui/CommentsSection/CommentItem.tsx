import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '@utils/api/api';
import { User } from '@context/AuthContext';
import { CommentType, ReplyResponse } from './Comments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { toast } from 'sonner';
import { MAX_COMMENT_DEPTH } from '@lib/constants';
import { formatDistanceToNow, format } from 'date-fns';

interface CommentItemProps {
    comment: CommentType;
    postSlug: string;
    currentUser: User | null;
    level: number;
    onUpdateComment: (
        commentId: string,
        updateFn: (comment: CommentType) => CommentType
    ) => void;
    onAddReply: (parentId: string, newReply: CommentType) => void;
}

// Styled components
const SingleComment = styled.div<{ isDeleted?: boolean; isEditing?: boolean }>`
    position: relative;
    padding: 15px 0;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    opacity: ${(props) => (props.isDeleted ? 0.7 : 1)};

    &:last-child {
        border-bottom: none;
    }

    ${(props) =>
        props.isEditing &&
        `
        background-color: ${props.theme.container.background.colour.light_contrast()};
        border-radius: 5px;
        padding: 15px;
        margin: 5px 0;
    `}
`;

const CommentHeader = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
`;

const CommentAuthor = styled.span`
    font-weight: bold;
    color: ${(props) => props.theme.text.colour.primary()};
    font-size: 0.95em;
`;

const CommentMetadata = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const CommentDate = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: 0.85em;
`;

const EditedMark = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: 0.8em;
    font-style: italic;
`;

const CommentText = styled.div`
    margin: 10px 0;
    color: ${(props) => props.theme.text.colour.primary()};
    font-size: 0.95em;
    line-height: 1.6;
    word-break: break-word;
    overflow-wrap: break-word;

    p {
        margin: 0.5em 0;

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    ul,
    ol {
        margin: 0.5em 0;
        padding-left: 1.5em;
    }

    code {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.9em;
    }

    pre {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.5em 0;
    }

    a {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const DeletedText = styled.p`
    font-style: italic;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const CommentActions = styled.div`
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.anchor()};
    cursor: pointer;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0;
    transition: color 0.2s;

    &:hover {
        color: ${(props) =>
            props.theme.text.colour.anchor(undefined, undefined, 80)};
        text-decoration: underline;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ReplyContainer = styled.div<{ level: number }>`
    margin-left: ${(props) =>
        props.level < MAX_COMMENT_DEPTH - 1 ? '20px' : '0'};
    padding-left: ${(props) =>
        props.level < MAX_COMMENT_DEPTH - 1 ? '15px' : '0'};
    border-left: ${(props) =>
        props.level < MAX_COMMENT_DEPTH - 1
            ? `1px solid ${props.theme.container.border.colour.primary()}`
            : 'none'};
    margin-top: ${(props) =>
        props.level < MAX_COMMENT_DEPTH - 1 ? '10px' : '20px'};
`;

const CommentControls = styled.div`
    margin-left: auto;
    display: flex;
    gap: 5px;
`;

const ReactionButton = styled.button<{ isActive?: boolean }>`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 3px;
    color: ${(props) =>
        props.isActive
            ? props.theme.theme_colours[5]()
            : props.theme.text.colour.light_grey()};
    font-size: 0.85em;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: ${(props) =>
            props.isActive
                ? props.theme.theme_colours[5]()
                : props.theme.text.colour.anchor()};
    }
`;

const ReactionCount = styled.span`
    font-size: 0.85em;
`;

const LoadMoreRepliesButton = styled.button`
    background: none;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    color: ${(props) => props.theme.text.colour.primary()};
    padding: 5px 10px;
    font-size: 0.85em;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }
`;

// History modal components
const HistoryModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const HistoryContent = styled.div`
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
`;

const HistoryTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const HistoryItem = styled.div`
    margin-bottom: 20px;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: 15px;

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
`;

const HistoryItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const HistoryDate = styled.span`
    font-size: 0.9em;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const HistoryText = styled.div`
    font-size: 0.95em;
    line-height: 1.5;
    color: ${(props) => props.theme.text.colour.primary()};
    white-space: pre-wrap;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: ${(props) => props.theme.text.colour.primary()};

    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
    }
`;

const DiffView = styled.div`
    margin-top: 15px;
    padding: 10px;
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: 4px;
`;

const DiffLine = styled.div<{ type: 'added' | 'removed' | 'unchanged' }>`
    padding: 2px 0;
    font-family: monospace;
    white-space: pre-wrap;
    font-size: 0.9em;

    ${(props) =>
        props.type === 'added' &&
        `
        background-color: rgba(0, 255, 0, 0.1);
        color: green;
    `}

    ${(props) =>
        props.type === 'removed' &&
        `
        background-color: rgba(255, 0, 0, 0.1);
        color: red;
        text-decoration: line-through;
    `}
`;

// Main component
export function CommentItem({
    comment,
    postSlug,
    currentUser,
    level,
    onUpdateComment,
    onAddReply
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [commentHistory, setCommentHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasMoreReplies, setHasMoreReplies] = useState(false);
    const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);
    const [replyPagination, setReplyPagination] = useState({
        currentSkip: 0,
        pageSize: 10,
        total: 0,
        hasMore: false
    });

    // Determine if the current user is the author
    const isAuthor = currentUser && currentUser.id === comment.author?._id;

    // Determine display name for author
    const authorName = comment.deleted
        ? '[deleted]'
        : comment.author?.username || 'Unknown User';

    // Format dates
    const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true
    });
    const fullDate = format(new Date(comment.createdAt), 'PPpp');

    // Check if comment has been edited
    const isEdited =
        comment.lastEditedAt && comment.lastEditedAt !== comment.createdAt;

    // Check user reactions to this comment
    const hasUserLiked: boolean | undefined = currentUser
        ? comment.likes.some((id) => id === currentUser.id)
        : undefined;
    const hasUserDisliked: boolean | undefined = currentUser
        ? comment.dislikes.some((id) => id === currentUser.id)
        : undefined;

    // Handle like/dislike
    const handleReaction = async (action: 'like' | 'dislike' | 'clear') => {
        if (!currentUser) return;

        try {
            let endpoint;
            if (action === 'like') {
                endpoint = `/comments/${comment._id}/like`;
            } else if (action === 'dislike') {
                endpoint = `/comments/${comment._id}/dislike`;
            } else {
                endpoint = `/comments/${comment._id}/clear-reaction`;
            }

            const res = await api.post(endpoint);

            // Update the comment's likes and dislikes
            onUpdateComment(comment._id, (c) => ({
                ...c,
                likes: Array(res.data.likes)
                    .fill('')
                    .map((_, i) => i.toString()),
                dislikes: Array(res.data.dislikes)
                    .fill('')
                    .map((_, i) => i.toString())
            }));
        } catch (error) {
            console.error(`Error ${action}ing comment:`, error);
            toast.error(`Failed to ${action} comment`);
        }
    };

    // Handle reply submission
    const handleReplySubmit = async (text: string) => {
        setIsSubmitting(true);
        try {
            const res = await api.post('/comments', {
                text,
                postSlug,
                parentCommentId: comment._id
            });

            onAddReply(comment._id, res.data);
            setShowReplyForm(false);
            toast.success('Reply added');
        } catch (error) {
            console.error('Error posting reply:', error);
            toast.error('Failed to post reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle comment editing
    const handleEdit = async (text: string) => {
        if (!isAuthor) return;

        setIsSubmitting(true);
        try {
            const res = await api.put(`/comments/${comment._id}`, { text });

            // Update the comment in the UI
            onUpdateComment(comment._id, () => res.data);
            setIsEditing(false);
            toast.success('Comment updated');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle comment deletion
    const handleDelete = async () => {
        if (!isAuthor) return;

        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await api.delete(`/comments/${comment._id}`);

            // Update the comment in the UI to show as deleted
            onUpdateComment(comment._id, (c) => ({
                ...c,
                deleted: true,
                text: '[deleted]'
            }));

            toast.success('Comment deleted');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    // Fetch comment history
    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await api.get(`/comments/${comment._id}/history`);
            setCommentHistory(res.data.history);
        } catch (error) {
            console.error('Error fetching comment history:', error);
            toast.error('Failed to load comment history');
        } finally {
            setLoadingHistory(false);
        }
    };

    // Show comment history
    const handleShowHistory = () => {
        fetchHistory();
        setShowHistory(true);
    };

    // Simple diff algorithm for showing changes
    const computeTextDiff = (oldText: string, newText: string) => {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');

        const result: {
            type: 'added' | 'removed' | 'unchanged';
            text: string;
        }[] = [];

        // Simple line-by-line diff (this could be improved with a real diff library)
        for (const line of oldLines) {
            if (!newLines.includes(line)) {
                result.push({ type: 'removed', text: line });
            }
        }

        for (const line of newLines) {
            if (!oldLines.includes(line)) {
                result.push({ type: 'added', text: line });
            } else if (oldLines.includes(line)) {
                result.push({ type: 'unchanged', text: line });
            }
        }

        return result;
    };

    // Check for reply count and set initial state
    useEffect(() => {
        if (comment.replies) {
            // If we already have replies loaded, check if we need to show the "load more" button
            const currentReplyCount = comment.replies.length;
            if (replyPagination.total > 0) {
                setHasMoreReplies(currentReplyCount < replyPagination.total);
                setReplyPagination((prev) => ({
                    ...prev,
                    currentSkip: currentReplyCount,
                    hasMore: currentReplyCount < replyPagination.total
                }));
            } else if (currentReplyCount === 10) {
                // If we have exactly the default page size, we might have more
                // We can either check the total here or wait until loadMoreReplies is called
                setHasMoreReplies(true);
            }
        }
    }, [comment.replies, replyPagination.total]);

    // Load more replies for a comment
    const loadMoreReplies = async () => {
        if (loadingMoreReplies) return;

        setLoadingMoreReplies(true);
        try {
            const res = await api.get<ReplyResponse>(
                `/comments/${comment._id}/replies?skip=${replyPagination.currentSkip}&limit=${replyPagination.pageSize}`
            );

            // Extract the replies and pagination data
            const { replies, pagination } = res.data;

            // Update the comment with additional replies
            onUpdateComment(comment._id, (c) => ({
                ...c,
                replies: [...(c.replies || []), ...replies]
            }));

            // Update pagination state
            setReplyPagination({
                currentSkip:
                    pagination.nextSkip ||
                    replyPagination.currentSkip + replyPagination.pageSize,
                pageSize: pagination.pageSize,
                total: pagination.total,
                hasMore: pagination.hasMore
            });

            // Update UI state
            setHasMoreReplies(pagination.hasMore);
        } catch (error) {
            console.error('Error loading more replies:', error);
            toast.error('Failed to load more replies');
        } finally {
            setLoadingMoreReplies(false);
        }
    };

    return (
        <>
            <SingleComment isDeleted={comment.deleted} isEditing={isEditing}>
                <CommentHeader>
                    <CommentAuthor>{authorName}</CommentAuthor>

                    <CommentMetadata>
                        <CommentDate title={fullDate}>
                            {formattedDate}
                        </CommentDate>

                        {isEdited && (
                            <EditedMark
                                title={`Edited ${formatDistanceToNow(new Date(comment.lastEditedAt!), { addSuffix: true })}`}
                            >
                                (edited)
                            </EditedMark>
                        )}
                    </CommentMetadata>

                    {!comment.deleted && (
                        <CommentControls>
                            <ReactionButton
                                isActive={hasUserLiked}
                                onClick={() =>
                                    hasUserLiked
                                        ? handleReaction('clear')
                                        : handleReaction('like')
                                }
                                title={hasUserLiked ? 'Remove like' : 'Like'}
                                disabled={!currentUser}
                            >
                                👍{' '}
                                <ReactionCount>
                                    {comment.likes.length || ''}
                                </ReactionCount>
                            </ReactionButton>

                            <ReactionButton
                                isActive={hasUserDisliked}
                                onClick={() =>
                                    hasUserDisliked
                                        ? handleReaction('clear')
                                        : handleReaction('dislike')
                                }
                                title={
                                    hasUserDisliked
                                        ? 'Remove dislike'
                                        : 'Dislike'
                                }
                                disabled={!currentUser}
                            >
                                👎{' '}
                                <ReactionCount>
                                    {comment.dislikes.length || ''}
                                </ReactionCount>
                            </ReactionButton>
                        </CommentControls>
                    )}
                </CommentHeader>

                {isEditing ? (
                    <CommentForm
                        onSubmit={handleEdit}
                        initialValue={comment.text}
                        submitLabel="Save Changes"
                        onCancel={() => setIsEditing(false)}
                        isEdit={true}
                    />
                ) : (
                    <CommentText>
                        {comment.deleted ? (
                            <DeletedText>
                                [This comment has been deleted]
                            </DeletedText>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: comment.text
                                }}
                            />
                        )}
                    </CommentText>
                )}

                {!isEditing && !comment.deleted && (
                    <CommentActions>
                        {currentUser && level < MAX_COMMENT_DEPTH - 1 && (
                            <ActionButton
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                {showReplyForm ? 'Cancel Reply' : 'Reply'}
                            </ActionButton>
                        )}

                        {isAuthor && (
                            <>
                                <ActionButton
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </ActionButton>

                                <ActionButton onClick={handleDelete}>
                                    Delete
                                </ActionButton>
                            </>
                        )}

                        {(isEdited ||
                            (comment.revisions &&
                                comment.revisions.length > 0)) && (
                            <ActionButton onClick={handleShowHistory}>
                                History
                            </ActionButton>
                        )}
                    </CommentActions>
                )}

                {showReplyForm && (
                    <ReplyContainer level={level}>
                        <CommentForm
                            onSubmit={handleReplySubmit}
                            isReply={true}
                            submitLabel="Post Reply"
                            onCancel={() => setShowReplyForm(false)}
                        />
                    </ReplyContainer>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <ReplyContainer level={level}>
                        <CommentList
                            comments={comment.replies}
                            postSlug={postSlug}
                            currentUser={currentUser}
                            level={level + 1}
                            onUpdateComment={onUpdateComment}
                            onAddReply={onAddReply}
                        />

                        {hasMoreReplies && (
                            <LoadMoreRepliesButton
                                onClick={loadMoreReplies}
                                disabled={loadingMoreReplies}
                            >
                                {loadingMoreReplies
                                    ? 'Loading...'
                                    : `Load more replies (${replyPagination.total - (comment.replies?.length || 0)} remaining)`}
                            </LoadMoreRepliesButton>
                        )}
                    </ReplyContainer>
                )}
            </SingleComment>

            {/* History Modal */}
            {showHistory && (
                <HistoryModal onClick={() => setShowHistory(false)}>
                    <HistoryContent onClick={(e) => e.stopPropagation()}>
                        <HistoryTitle>Comment History</HistoryTitle>
                        <CloseButton onClick={() => setShowHistory(false)}>
                            ×
                        </CloseButton>

                        {loadingHistory ? (
                            <p>Loading history...</p>
                        ) : commentHistory.length === 0 ? (
                            <p>No history available</p>
                        ) : (
                            commentHistory.map((version, index) => (
                                <HistoryItem key={index}>
                                    <HistoryItemHeader>
                                        <HistoryDate>
                                            {index === 0
                                                ? 'Current version'
                                                : `Previous version ${commentHistory.length - index}`}
                                        </HistoryDate>
                                        <HistoryDate>
                                            {format(
                                                new Date(version.timestamp),
                                                'PPpp'
                                            )}
                                        </HistoryDate>
                                    </HistoryItemHeader>

                                    <HistoryText>{version.text}</HistoryText>

                                    {/* Show diff with next version if not the first item */}
                                    {index < commentHistory.length - 1 && (
                                        <DiffView>
                                            <div
                                                style={{
                                                    marginBottom: '5px',
                                                    fontSize: '0.85em',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Changes from previous version:
                                            </div>
                                            {computeTextDiff(
                                                commentHistory[index + 1].text,
                                                version.text
                                            ).map((line, i) => (
                                                <DiffLine
                                                    key={i}
                                                    type={line.type}
                                                >
                                                    {line.type === 'added'
                                                        ? '+ '
                                                        : line.type ===
                                                            'removed'
                                                          ? '- '
                                                          : '  '}
                                                    {line.text}
                                                </DiffLine>
                                            ))}
                                        </DiffView>
                                    )}
                                </HistoryItem>
                            ))
                        )}
                    </HistoryContent>
                </HistoryModal>
            )}
        </>
    );
}
