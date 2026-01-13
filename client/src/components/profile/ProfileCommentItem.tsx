import React from 'react';
import { marked } from 'marked';
import { format } from 'date-fns';
import { CommentType } from '@components/comments/types';
import { User } from '@context/AuthContext';
import {
    ProfileCommentItem as ProfileCommentItemStyled,
    CommentHeader,
    CommentMetadata,
    CommentDate,
    CommentText,
    CommentActions,
    ActionButton,
    PostLink,
    EditedMark,
    PendingBadge
} from '@components/comments/CommentStyles';

interface ProfileCommentItemProps {
    comment: CommentType;
    currentUser: User | null;
    selected: boolean;
    toggleSelect: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
    Checkbox: React.ComponentType<{
        checked: boolean;
        onChange: () => void;
    }>;
}

function renderMarkdown(content: string): string {
    try {
        const result = marked.parse(content);
        return typeof result === 'string' ? result : content;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return content;
    }
}

export const ProfileCommentItem: React.FC<ProfileCommentItemProps> = ({
    comment,
    currentUser,
    selected,
    toggleSelect,
    onDelete,
    Checkbox
}) => {
    const isAuthor = comment.isOwner;
    const isEdited = !!comment.editedAt;

    const displayDate =
        isEdited && comment.editedAt
            ? format(new Date(comment.editedAt), 'yyyy-MM-dd HH:mm:ss')
            : format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss');

    const tooltipDate = isEdited
        ? `Created: ${format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss')}`
        : '';

    return (
        <ProfileCommentItemStyled
            selected={selected}
            deleted={comment.isDeleted}
        >
            <CommentHeader>
                <CommentMetadata>
                    {!comment.isDeleted && (
                        <Checkbox
                            checked={selected}
                            onChange={() => toggleSelect(comment.id)}
                        />
                    )}
                    <CommentDate data-title={tooltipDate}>
                        {displayDate}
                    </CommentDate>
                    {isEdited && <EditedMark>(edited)</EditedMark>}
                    {!comment.approved && comment.isOwner && (
                        <PendingBadge>pending approval</PendingBadge>
                    )}
                </CommentMetadata>

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

            {comment.postSlug && (
                <PostLink href={comment.postSlug}>
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
                    View Post
                </PostLink>
            )}
        </ProfileCommentItemStyled>
    );
};
