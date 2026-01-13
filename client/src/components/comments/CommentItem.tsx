import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { api } from '@utils/api/api';
import { marked } from 'marked';
import { MAX_COMMENT_DEPTH } from '@lib/constants';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { CommentItemProps, CommentType, CommentHistoryEntry } from './types';
import {
    SingleComment,
    CommentHeader,
    CommentAuthorName,
    CommentMetadata,
    CommentDate,
    EditedMark,
    CommentControls,
    ReactionButton,
    ReactionCount,
    CommentText,
    DeletedText,
    CommentActions,
    ActionButton,
    ReplyContainer,
    HistoryModal,
    HistoryContent,
    HistoryTitle,
    CloseButton,
    HistoryItem,
    HistoryItemHeader,
    HistoryDate,
    HistoryText,
    DiffView,
    DiffLine
} from './CommentStyles';

function renderMarkdown(content: string): string {
    try {
        const result = marked.parse(content);
        return typeof result === 'string' ? result : content;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return content;
    }
}

export function CommentItem({
    comment,
    postSlug,
    currentUser,
    level,
    onUpdateComment,
    onAddReply,
    isProfileView = false,
    onDelete
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [commentHistory, setCommentHistory] = useState<CommentHistoryEntry[]>(
        []
    );
    const [loadingHistory, setLoadingHistory] = useState(false);

    const isAuthor = comment.isOwner;
    const authorName = comment.isDeleted
        ? '[deleted]'
        : comment.user?.displayName || comment.user?.username || 'Unknown User';

    const isEdited = !!comment.editedAt;
    const displayDate =
        isEdited && comment.editedAt
            ? format(new Date(comment.editedAt), 'yyyy-MM-dd HH:mm:ss')
            : format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss');

    const tooltipDate = isEdited
        ? `Created: ${format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss')}`
        : '';

    const hasUserLiked = comment.reactions.userReaction === 'like';
    const hasUserDisliked = comment.reactions.userReaction === 'dislike';

    const handleReaction = async (type: 'like' | 'dislike') => {
        if (!currentUser) return;

        try {
            const res = await api.post<{ reaction: string | null }>(
                `/comments/${comment.id}/react`,
                { type }
            );

            onUpdateComment(comment.id, (c) => ({
                ...c,
                reactions: {
                    ...c.reactions,
                    likes:
                        type === 'like' && res.data.reaction === 'like'
                            ? c.reactions.likes + 1
                            : type === 'like' &&
                                res.data.reaction === null &&
                                c.reactions.userReaction === 'like'
                              ? c.reactions.likes - 1
                              : c.reactions.likes,
                    dislikes:
                        type === 'dislike' && res.data.reaction === 'dislike'
                            ? c.reactions.dislikes + 1
                            : type === 'dislike' &&
                                res.data.reaction === null &&
                                c.reactions.userReaction === 'dislike'
                              ? c.reactions.dislikes - 1
                              : c.reactions.dislikes,
                    userReaction: res.data.reaction as 'like' | 'dislike' | null
                }
            }));
        } catch (error) {
            console.error(`Error reacting to comment:`, error);
            toast.error('Failed to react to comment');
        }
    };

    const handleReplySubmit = async (content: string) => {
        if (!postSlug) return;

        setIsSubmitting(true);
        try {
            const res = await api.post<{ comment: CommentType }>('/comments', {
                postSlug,
                content,
                parentId: comment.id
            });

            if (onAddReply) {
                onAddReply(comment.id, res.data.comment);
            }
            setShowReplyForm(false);

            if (res.data.comment.approved) {
                toast.success('Reply added');
            } else {
                toast.success('Reply submitted for approval');
            }
        } catch (error) {
            console.error('Error posting reply:', error);
            toast.error('Failed to post reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (content: string) => {
        if (!isAuthor) return;

        setIsSubmitting(true);
        try {
            const res = await api.patch<{ comment: CommentType }>(
                `/comments/${comment.id}`,
                { content }
            );

            onUpdateComment(comment.id, () => ({
                ...res.data.comment,
                replies: comment.replies
            }));
            setIsEditing(false);
            toast.success('Comment updated');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!isAuthor && !currentUser) return;

        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            if (isProfileView && onDelete) {
                await onDelete(comment.id);
            } else {
                await api.delete(`/comments/${comment.id}`);
                onUpdateComment(comment.id, (c) => ({
                    ...c,
                    isDeleted: true,
                    content: '[deleted]'
                }));
            }

            toast.success('Comment deleted');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await api.get<{ history: CommentHistoryEntry[] }>(
                `/comments/${comment.id}/history`
            );
            setCommentHistory(res.data.history);
        } catch (error) {
            console.error('Error fetching comment history:', error);
            toast.error('Failed to load comment history');
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleShowHistory = () => {
        fetchHistory();
        setShowHistory(true);
    };

    const computeTextDiff = (oldText: string, newText: string) => {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');

        const result: {
            type: 'added' | 'removed' | 'unchanged';
            text: string;
        }[] = [];

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

    return (
        <>
            <SingleComment isDeleted={comment.isDeleted} isEditing={isEditing}>
                <CommentHeader>
                    <CommentAuthorName>{authorName}</CommentAuthorName>

                    <CommentMetadata>
                        <CommentDate data-title={tooltipDate}>
                            {displayDate}
                        </CommentDate>

                        {isEdited && <EditedMark>(edited)</EditedMark>}

                        {!comment.approved && (
                            <EditedMark style={{ color: 'orange' }}>
                                (pending approval)
                            </EditedMark>
                        )}
                    </CommentMetadata>

                    {!comment.isDeleted && (
                        <CommentControls>
                            <ReactionButton
                                isActive={hasUserLiked}
                                onClick={() => handleReaction('like')}
                                title={hasUserLiked ? 'Remove like' : 'Like'}
                                disabled={!currentUser}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7 10v12" />
                                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                                </svg>{' '}
                                <ReactionCount>
                                    {comment.reactions.likes || ''}
                                </ReactionCount>
                            </ReactionButton>

                            <ReactionButton
                                isActive={hasUserDisliked}
                                onClick={() => handleReaction('dislike')}
                                title={
                                    hasUserDisliked
                                        ? 'Remove dislike'
                                        : 'Dislike'
                                }
                                disabled={!currentUser}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 14V2" />
                                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                                </svg>{' '}
                                <ReactionCount>
                                    {comment.reactions.dislikes || ''}
                                </ReactionCount>
                            </ReactionButton>
                        </CommentControls>
                    )}
                </CommentHeader>

                {isEditing ? (
                    <CommentForm
                        onSubmit={handleEdit}
                        initialValue={comment.content}
                        submitLabel="Save Changes"
                        onCancel={() => setIsEditing(false)}
                        isEdit={true}
                    />
                ) : (
                    <CommentText deleted={comment.isDeleted}>
                        {comment.isDeleted ? (
                            <DeletedText>
                                [This comment has been deleted]
                            </DeletedText>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(comment.content)
                                }}
                            />
                        )}
                    </CommentText>
                )}

                {!isEditing && !comment.isDeleted && (
                    <CommentActions>
                        {currentUser &&
                            level < MAX_COMMENT_DEPTH - 1 &&
                            postSlug &&
                            onAddReply && (
                                <ActionButton
                                    onClick={() =>
                                        setShowReplyForm(!showReplyForm)
                                    }
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

                        {isEdited && (
                            <ActionButton onClick={handleShowHistory}>
                                History
                            </ActionButton>
                        )}
                    </CommentActions>
                )}

                {showReplyForm && postSlug && onAddReply && (
                    <ReplyContainer level={level}>
                        <CommentForm
                            onSubmit={handleReplySubmit}
                            isReply={true}
                            submitLabel="Post Reply"
                            onCancel={() => setShowReplyForm(false)}
                        />
                    </ReplyContainer>
                )}

                {comment.replies && comment.replies.length > 0 && postSlug && (
                    <ReplyContainer level={level}>
                        <CommentList
                            comments={comment.replies}
                            postSlug={postSlug}
                            currentUser={currentUser}
                            level={level + 1}
                            onUpdateComment={onUpdateComment}
                            onAddReply={onAddReply}
                        />
                    </ReplyContainer>
                )}
            </SingleComment>

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
                                            {version.isCurrent
                                                ? 'Current version'
                                                : `Previous version ${commentHistory.length - index}`}
                                        </HistoryDate>
                                        <HistoryDate>
                                            {format(
                                                new Date(version.editedAt),
                                                'PPpp'
                                            )}
                                        </HistoryDate>
                                    </HistoryItemHeader>

                                    <HistoryText>{version.content}</HistoryText>

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
                                                commentHistory[index + 1]
                                                    .content,
                                                version.content
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
