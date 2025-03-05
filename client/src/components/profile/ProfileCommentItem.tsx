import React from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import { format, formatDistanceToNow } from 'date-fns';
import { CommentType } from '@components/comments/types';
import { User } from '@context/AuthContext';

// Styled components similar to the original profile page
const CommentItemContainer = styled.div<{
    selected?: boolean;
    deleted?: boolean;
}>`
    border: 1px solid
        ${(props) =>
            props.selected
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    padding: 15px;
    background: ${(props) =>
        props.selected
            ? props.theme.theme_colours[9]()
            : props.deleted
              ? '#f8f8f8'
              : props.theme.container.background.colour.content()};
    transition: all 0.2s ease;
    margin-bottom: 10px;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const CommentMetadata = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const CommentDate = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.small};
    position: relative;
    cursor: ${(props) => (props['data-title'] ? 'help' : 'default')};

    /* Custom tooltip styling using data-title instead of title to avoid native tooltips */
    &[data-title]:hover::after {
        content: attr(data-title);
        position: absolute;
        left: 0;
        top: 100%;
        z-index: 100;
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        margin-top: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        pointer-events: none;
    }
`;

const CommentActions = styled.div`
    display: flex;
    gap: 5px;
`;

const ActionButton = styled.button`
    padding: 5px 10px;
    border: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) => props.theme.colours.error};
    color: white;
    font-size: ${(props) => props.theme.text.size.small};
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;

const CommentText = styled.p<{ deleted?: boolean }>`
    margin: 0 0 10px 0;
    color: ${(props) =>
        props.deleted
            ? props.theme.text.colour.light_grey()
            : props.theme.text.colour.primary()};
    font-style: ${(props) => (props.deleted ? 'italic' : 'normal')};
    line-height: 1.5;

    p {
        margin: 0.5em 0;
        &:first-child {
            margin-top: 0;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const PostLink = styled.a`
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: ${(props) => props.theme.text.size.small};

    &:hover {
        text-decoration: underline;
    }
`;

// Props interface
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

export const ProfileCommentItem: React.FC<ProfileCommentItemProps> = ({
    comment,
    currentUser,
    selected,
    toggleSelect,
    onDelete,
    Checkbox
}) => {
    const isAuthor = currentUser && currentUser.id === comment.author?._id;

    // Check if comment has been edited
    const isEdited =
        comment.lastEditedAt && comment.lastEditedAt !== comment.createdAt;

    // Display fixed timestamp with seconds and 24-hour format
    const displayDate =
        isEdited && comment.lastEditedAt
            ? format(new Date(comment.lastEditedAt), 'yyyy-MM-dd HH:mm:ss')
            : format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss');

    // Only provide hover tooltip for edited comments
    const tooltipDate = isEdited
        ? `Created: ${format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss')}`
        : '';

    return (
        <CommentItemContainer selected={selected} deleted={comment.deleted}>
            <CommentHeader>
                <CommentMetadata>
                    {!comment.deleted && (
                        <Checkbox
                            checked={selected}
                            onChange={() => toggleSelect(comment._id)}
                        />
                    )}
                    <CommentDate data-title={tooltipDate}>
                        {displayDate}
                    </CommentDate>
                </CommentMetadata>

                {!comment.deleted && isAuthor && (
                    <CommentActions>
                        <ActionButton onClick={() => onDelete(comment._id)}>
                            Delete
                        </ActionButton>
                    </CommentActions>
                )}
            </CommentHeader>

            <CommentText deleted={comment.deleted}>
                {comment.deleted ? (
                    '[This comment has been deleted]'
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
        </CommentItemContainer>
    );
};
