import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '@utils/api/api';

interface CommentItemProps {
    comment: any;
    postSlug: string;
}

const SingleComment = styled.div`
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding: 15px 0;
    &:last-child {
        border-bottom: none;
    }
`;

const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const CommentAuthor = styled.span`
    font-weight: bold;
    color: ${(props) => props.theme.text.colour.primary()};
    margin-right: 10px;
    font-size: 0.95em;
`;

const CommentDate = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: 0.85em;
`;

const CommentText = styled.p`
    margin: 5px 0;
    color: ${(props) => props.theme.text.colour.primary()};
    font-size: 0.95em;
    line-height: 1.5;
`;

const CommentActions = styled.div`
    margin-top: 10px;
    display: flex;
    gap: 10px;
`;

const ActionLink = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.anchor()};
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.85em;
    &:hover {
        color: ${(props) =>
            props.theme.text.colour.anchor(undefined, undefined, 80)};
    }
`;

const ReplyContainer = styled.div`
    margin-left: 20px;
    padding-left: 10px;
    border-left: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    margin-top: 10px;
`;

const ReplyTextArea = styled.textarea`
    width: 100%;
    height: 50px;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    resize: vertical;
    font-family: inherit;
    font-size: 0.9em;
    color: ${(props) => props.theme.text.colour.primary()};
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
`;

const SubmitReplyButton = styled.button`
    padding: 6px 12px;
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85em;
    font-weight: bold;
    &:hover {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

export function CommentItem({ comment, postSlug }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReply = async () => {
        try {
            const res = await api.post('/comments', {
                text: replyText,
                postSlug,
                parentCommentId: comment._id
            });
            comment.replies = [res.data, ...(comment.replies || [])];
            setReplyText('');
            setShowReplyForm(false);
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    // Determine author name
    const authorName = comment.author?.username || 'Unknown User';

    // Format date if needed
    const formattedDate = new Date(comment.createdAt).toLocaleString();

    return (
        <SingleComment>
            <CommentHeader>
                <CommentAuthor>
                    {comment.deleted ? '[deleted user]' : authorName}
                </CommentAuthor>
                <CommentDate>{formattedDate}</CommentDate>
            </CommentHeader>
            <CommentText>
                {comment.deleted ? '[deleted]' : comment.text}
            </CommentText>
            {!comment.deleted && (
                <CommentActions>
                    <ActionLink
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        Reply
                    </ActionLink>
                </CommentActions>
            )}
            {showReplyForm && (
                <ReplyContainer>
                    <ReplyTextArea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <SubmitReplyButton onClick={handleReply}>
                        Submit Reply
                    </SubmitReplyButton>
                </ReplyContainer>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <ReplyContainer>
                    {comment.replies.map((reply: any) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            postSlug={postSlug}
                        />
                    ))}
                </ReplyContainer>
            )}
        </SingleComment>
    );
}
