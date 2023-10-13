import { useEffect, useState } from "react";
import styled from "styled-components";

import { theme } from "@styles/theme";

// --------------------------------------
import CommentForm from "./CommentForm";
import Comment from "./Comment";

// --------------------------------------
import api_get_article_comments from "@utils/api/interact/get_article_comments";

// --------------------------------------
import IndicateLoading from "@components/atomic/IndicateLoading";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";

const CommentSectionContainer = styled.div`
    background-color: ${theme.container.background.colour.primary()};
    border-top: 1px dashed ${theme.container.border.colour.primary()};
    margin-top: 20px;
`;

interface CommentSectionProps {
    slug: string;
    allowComments: boolean;
}

const CommentSection = ({ slug, allowComments }: CommentSectionProps) => {
    const loggedIn = useSelector((state: RootState) => state.user.isAuthenticated);

    const [comments, setComments] = useState<CommentPopUserDTO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res: CommentsBySlugDTO = await api_get_article_comments(slug);
                setComments(res.comments);
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
            }
        }
        fetchComments();
    }, [slug]);

    if (loading) return <IndicateLoading />;

    // -----------------
    // new comment update dom using callback from CommentForm
    const handleNewComment = (newComment: CommentPopUserDTO) => {
        setComments(prevState => {
            return [newComment, ...prevState];
        });
    }

    return (
        <CommentSectionContainer>
            <h2>Comments</h2>
            {allowComments === false ? (
                <DisabledCommentForm type="commentsDisabled" />
            ) : loggedIn ? (
                <CommentForm slug={slug} onSubmit={handleNewComment} />
            ) : (
                <DisabledCommentForm type="loginRequired" />
            )}
            <br />
            {
                comments
                    .sort((a, b) => {
                        return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
                    })
                    .map(comment => (
                        <Comment
                            key={comment._id! + comment.latestContent!._id!}
                            commentObj={comment}
                            slug={slug}
                            depth={0}
                        />
                    ))
            }
        </CommentSectionContainer>
    )
}

export default CommentSection;

// --------------------------------------
// --------------------------------------
import React from 'react';
import { FaComments, FaSignInAlt } from 'react-icons/fa';
import Auth from "@components/modals/auth/Auth";

interface DisabledCommentFormProps {
    type: 'commentsDisabled' | 'loginRequired';
}

const DisabledCommentFormContainer = styled.div<{ borderColor: string }>`
    padding: 2px 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-left: 0.25em solid ${props => props.borderColor};
    font-family: Helvetica;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        opacity: 0.4;
        transition: opacity 0.3s ease-in-out;
    }
`;

const MessageTitle = styled.p<{ titleColor: string }>`
    display: flex;
    align-items: center;
    color: ${props => props.titleColor};
    svg {
        margin-right: 8px;
    }
`;

const DisabledCommentForm: React.FC<DisabledCommentFormProps> = ({ type }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const isCommentsDisabled = type === 'commentsDisabled';
    const borderColor = isCommentsDisabled ? 'rgb(210, 153, 34)' : 'rgb(47, 129, 247)';
    const titleColor = borderColor;
    const Icon = isCommentsDisabled ? FaComments : FaSignInAlt;
    const title = isCommentsDisabled ? 'Comments Disabled' : 'Login to Comment';

    return (
        <>
            <DisabledCommentFormContainer
                borderColor={borderColor}
                onClick={() => setIsAuthModalOpen(true)}
            >
                <MessageTitle titleColor={titleColor}>
                    <Icon size={16} color={titleColor} />
                    {title}
                </MessageTitle>
            </DisabledCommentFormContainer>
            {isAuthModalOpen && <Auth onClose={() => setIsAuthModalOpen(false)} />}
        </>
    );
};