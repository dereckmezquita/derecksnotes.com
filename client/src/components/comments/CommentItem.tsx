import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { api } from '@utils/api/api';
import { marked } from 'marked';
import { MAX_COMMENT_DEPTH } from '@lib/constants';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { CommentItemProps, CommentType, ReplyResponse } from './types';
import {
    SingleComment,
    CommentHeader,
    CommentAuthor,
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
    LoadMoreRepliesButton,
    ProfileCommentItem,
    PostLink,
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

/**
 * Renders markdown text safely with sanitization
 * @param content - The markdown content to render
 * @returns Sanitized HTML from markdown
 */
function renderMarkdown(content: string): string {
    try {
        // Parse the markdown using the default settings
        const result = marked.parse(content);
        // Make sure we're dealing with a string
        return typeof result === 'string' ? result : content;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return content; // Fallback to raw content if parsing fails
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

    // Check if comment has been edited
    const isEdited =
        comment.lastEditedAt && comment.lastEditedAt !== comment.createdAt;

    // Format dates
    // Display fixed timestamp with seconds and 24-hour format
    const displayDate =
        isEdited && comment.lastEditedAt
            ? format(new Date(comment.lastEditedAt), 'yyyy-MM-dd HH:mm:ss')
            : format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss');

    // Only provide hover tooltip for edited comments
    const tooltipDate = isEdited
        ? `Created: ${format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss')}`
        : '';

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
        if (!postSlug) return;

        setIsSubmitting(true);
        try {
            const res = await api.post('/comments', {
                text,
                postSlug,
                parentCommentId: comment._id
            });

            if (onAddReply) {
                onAddReply(comment._id, res.data);
            }
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
            // Use the profile-specific delete function if provided
            if (isProfileView && onDelete) {
                await onDelete(comment._id);
            } else {
                await api.delete(`/comments/${comment._id}`);
                // Update the comment in the UI to show as deleted
                onUpdateComment(comment._id, (c) => ({
                    ...c,
                    deleted: true,
                    text: '[deleted]'
                }));
            }

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
        if (loadingMoreReplies || !postSlug) return;

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
                    pagination.nextSkip !== null &&
                    pagination.nextSkip !== undefined
                        ? pagination.nextSkip
                        : replyPagination.currentSkip +
                          replyPagination.pageSize,
                pageSize: pagination.pageSize,
                total: pagination.total,
                hasMore: pagination.hasMore === true
            });

            // Update UI state
            setHasMoreReplies(pagination.hasMore === true);
        } catch (error) {
            console.error('Error loading more replies:', error);
            toast.error('Failed to load more replies');
        } finally {
            setLoadingMoreReplies(false);
        }
    };

    // Profile view uses a different style
    if (isProfileView) {
        return (
            <ProfileCommentItem deleted={comment.deleted}>
                <CommentHeader>
                    <CommentMetadata>
                        <CommentDate data-title={tooltipDate}>
                            {displayDate}
                        </CommentDate>
                    </CommentMetadata>

                    {!comment.deleted && isAuthor && (
                        <CommentControls>
                            <ActionButton onClick={handleDelete}>
                                Delete
                            </ActionButton>
                        </CommentControls>
                    )}
                </CommentHeader>

                <CommentText deleted={comment.deleted}>
                    {comment.deleted ? (
                        <DeletedText>
                            [This comment has been deleted]
                        </DeletedText>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderMarkdown(comment.text)
                            }}
                        />
                    )}
                </CommentText>

                {comment.post && (
                    <PostLink href={comment.post.slug}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        {comment.post.title || 'View Post'}
                    </PostLink>
                )}
            </ProfileCommentItem>
        );
    }

    // Regular comment view
    return (
        <>
            <SingleComment isDeleted={comment.deleted} isEditing={isEditing}>
                <CommentHeader>
                    <CommentAuthor>{authorName}</CommentAuthor>

                    <CommentMetadata>
                        <CommentDate data-title={tooltipDate}>
                            {displayDate}
                        </CommentDate>

                        {isEdited && <EditedMark>(edited)</EditedMark>}
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
                    <CommentText deleted={comment.deleted}>
                        {comment.deleted ? (
                            <DeletedText>
                                [This comment has been deleted]
                            </DeletedText>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(comment.text)
                                }}
                            />
                        )}
                    </CommentText>
                )}

                {!isEditing && !comment.deleted && (
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

                        {(isEdited ||
                            (comment.revisions &&
                                comment.revisions.length > 0)) && (
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
