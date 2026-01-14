'use client';

import React from 'react';
import { marked } from 'marked';
import styled from 'styled-components';
import { CommentType } from '@components/comments/types';
import { CommentItem } from '@components/comments/CommentItem';
import { User } from '@context/AuthContext';

// ============================================================================
// STYLED COMPONENTS - Only for profile-specific wrapper
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
    margin: ${(props) => props.theme.container.spacing.small};
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

const CommentContent = styled.div`
    padding: ${(props) => props.theme.container.spacing.small};
`;

const SelectionBar = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.xsmall}
        ${(props) => props.theme.container.spacing.small};
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
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
    const parts = postSlug.split('/');
    const lastPart = parts[parts.length - 1] || postSlug;
    const withoutDate = lastPart.replace(/^\d{8}_/, '');
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
    const parentAuthorName = comment.parentComment?.user
        ? comment.parentComment.user.displayName ||
          comment.parentComment.user.username
        : 'Unknown User';

    // Handler for CommentItem's onUpdateComment
    const handleUpdateComment = (
        commentId: string,
        updateFn: (c: CommentType) => CommentType
    ) => {
        // Extract the reaction update from the updated comment
        const updated = updateFn(comment);
        if (
            onReactionUpdate &&
            updated.reactions.userReaction !== comment.reactions.userReaction
        ) {
            onReactionUpdate(commentId, updated.reactions.userReaction);
        }
    };

    return (
        <ProfileCommentWrapper selected={selected}>
            {/* Selection checkbox */}
            {!comment.isDeleted && (
                <SelectionBar>
                    <Checkbox
                        checked={selected}
                        onChange={() => toggleSelect(comment.id)}
                    />
                    <span>Select for bulk action</span>
                </SelectionBar>
            )}

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

            {/* The actual comment using the real CommentItem */}
            <CommentContent>
                <CommentItem
                    comment={comment}
                    postSlug={comment.postSlug}
                    currentUser={currentUser}
                    level={0}
                    onUpdateComment={handleUpdateComment}
                    isProfileView={true}
                    onDelete={onDelete}
                />
            </CommentContent>
        </ProfileCommentWrapper>
    );
};
