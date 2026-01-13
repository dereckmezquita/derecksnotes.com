'use client';

import React from 'react';
import { marked } from 'marked';
import { format } from 'date-fns';
import { toast } from 'sonner';
import styled from 'styled-components';
import { api } from '@utils/api/api';
import { CommentType } from '@components/comments/types';
import { User } from '@context/AuthContext';
import {
    SingleComment,
    CommentHeader,
    CommentAuthorName,
    CommentMetadata,
    CommentDate,
    CommentText,
    CommentActions,
    ActionButton,
    EditedMark,
    PendingBadge,
    CommentControls,
    ReactionButton,
    ReactionCount
} from '@components/comments/CommentStyles';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ProfileCommentWrapper = styled.div<{ selected?: boolean }>`
    border: 1px solid
        ${(props) =>
            props.selected
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    background: ${(props) =>
        props.selected
            ? props.theme.theme_colours[9]()
            : props.theme.container.background.colour.content()};
    overflow: hidden;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const CommentContent = styled.div`
    padding: ${(props) => props.theme.container.spacing.small};
`;

const PostLinkContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.small};
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    font-size: ${(props) => props.theme.text.size.small};
`;

const PostLinkLabel = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const PostLink = styled.a`
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: none;
    font-weight: ${(props) => props.theme.text.weight.medium};

    &:hover {
        text-decoration: underline;
    }
`;

const ParentCommentContainer = styled.div`
    margin: ${(props) => props.theme.container.spacing.small} 0;
    padding: ${(props) => props.theme.container.spacing.small};
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-left: 3px solid ${(props) => props.theme.theme_colours[5]()};
    border-radius: 0 ${(props) => props.theme.container.border.radius}
        ${(props) => props.theme.container.border.radius} 0;
`;

const ParentCommentLabel = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-bottom: ${(props) => props.theme.container.spacing.xsmall};
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
`;

const ParentCommentAuthor = styled.span`
    color: ${(props) => props.theme.theme_colours[5]()};
    font-weight: ${(props) => props.theme.text.weight.medium};
`;

const ParentCommentText = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.primary()};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    p {
        margin: 0;
    }
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function renderMarkdown(content: string): string {
    try {
        const result = marked.parse(content);
        return typeof result === 'string' ? result : content;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return content;
    }
}

function extractPostName(postSlug: string): string {
    // Extract a readable post name from the slug
    // e.g., "/blog/posts/my-awesome-post" -> "my-awesome-post"
    // or "20191025_productivity-and-computers" -> "productivity-and-computers"
    const parts = postSlug.split('/');
    const lastPart = parts[parts.length - 1] || postSlug;

    // Remove date prefix if present (e.g., "20191025_")
    const withoutDate = lastPart.replace(/^\d{8}_/, '');

    // Replace dashes and underscores with spaces and capitalize
    return withoutDate
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ============================================================================
// COMPONENT
// ============================================================================

interface ProfileCommentItemProps {
    comment: CommentType;
    currentUser: User | null;
    selected: boolean;
    toggleSelect: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
    onReactionUpdate?: (
        commentId: string,
        newReaction: 'like' | 'dislike' | null
    ) => void;
    Checkbox: React.ComponentType<{
        checked: boolean;
        onChange: () => void;
    }>;
}

export const ProfileCommentItem: React.FC<ProfileCommentItemProps> = ({
    comment,
    currentUser,
    selected,
    toggleSelect,
    onDelete,
    onReactionUpdate,
    Checkbox
}) => {
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

            if (onReactionUpdate) {
                onReactionUpdate(
                    comment.id,
                    res.data.reaction as 'like' | 'dislike' | null
                );
            }
        } catch (error) {
            console.error(`Error reacting to comment:`, error);
            toast.error('Failed to react to comment');
        }
    };

    const parentAuthorName = comment.parentComment?.user
        ? comment.parentComment.user.displayName ||
          comment.parentComment.user.username
        : 'Unknown User';

    return (
        <ProfileCommentWrapper selected={selected}>
            {/* Post Link Header */}
            {comment.postSlug && (
                <PostLinkContainer>
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
                    <PostLinkLabel>Posted on:</PostLinkLabel>
                    <PostLink href={comment.postSlug}>
                        {extractPostName(comment.postSlug)}
                    </PostLink>
                </PostLinkContainer>
            )}

            <CommentContent>
                {/* Parent Comment Context (for replies) */}
                {comment.parentComment && (
                    <ParentCommentContainer>
                        <ParentCommentLabel>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="9 14 4 9 9 4"></polyline>
                                <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                            </svg>
                            Replying to{' '}
                            <ParentCommentAuthor>
                                {parentAuthorName}
                            </ParentCommentAuthor>
                        </ParentCommentLabel>
                        <ParentCommentText>
                            {comment.parentComment.isDeleted ? (
                                <em>[This comment has been deleted]</em>
                            ) : (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: renderMarkdown(
                                            comment.parentComment.content
                                        )
                                    }}
                                />
                            )}
                        </ParentCommentText>
                    </ParentCommentContainer>
                )}

                <SingleComment isDeleted={comment.isDeleted}>
                    <CommentHeader>
                        {!comment.isDeleted && (
                            <CheckboxWrapper>
                                <Checkbox
                                    checked={selected}
                                    onChange={() => toggleSelect(comment.id)}
                                />
                            </CheckboxWrapper>
                        )}

                        <CommentAuthorName>{authorName}</CommentAuthorName>

                        <CommentMetadata>
                            <CommentDate data-title={tooltipDate}>
                                {displayDate}
                            </CommentDate>

                            {isEdited && <EditedMark>(edited)</EditedMark>}

                            {!comment.approved && comment.isOwner && (
                                <PendingBadge>pending approval</PendingBadge>
                            )}
                        </CommentMetadata>

                        {/* Like/Dislike Controls */}
                        {!comment.isDeleted && (
                            <CommentControls>
                                <ReactionButton
                                    isActive={hasUserLiked}
                                    onClick={() => handleReaction('like')}
                                    title={
                                        hasUserLiked ? 'Remove like' : 'Like'
                                    }
                                    disabled={!currentUser}
                                    aria-label={
                                        hasUserLiked
                                            ? 'Remove like'
                                            : 'Like comment'
                                    }
                                    aria-pressed={hasUserLiked}
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
                                    aria-label={
                                        hasUserDisliked
                                            ? 'Remove dislike'
                                            : 'Dislike comment'
                                    }
                                    aria-pressed={hasUserDisliked}
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

                    <CommentText deleted={comment.isDeleted}>
                        {comment.isDeleted ? (
                            '[This comment has been deleted]'
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(comment.content)
                                }}
                            />
                        )}
                    </CommentText>

                    {!comment.isDeleted && isAuthor && (
                        <CommentActions>
                            <ActionButton
                                onClick={() => onDelete(comment.id)}
                                style={{ color: 'inherit' }}
                            >
                                Delete
                            </ActionButton>
                        </CommentActions>
                    )}
                </SingleComment>
            </CommentContent>
        </ProfileCommentWrapper>
    );
};
