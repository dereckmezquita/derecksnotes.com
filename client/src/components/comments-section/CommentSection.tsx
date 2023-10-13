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

const CommentSectionContainer = styled.div`
    background-color: ${theme.container.background.colour.primary()};
    border-top: 1px dashed ${theme.container.border.colour.primary()};
`;

interface CommentSectionProps {
    slug: string;
    allowComments?: boolean;
}

const CommentSection = ({ slug, allowComments }: CommentSectionProps) => {
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
    }, []);

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
            {allowComments &&
                <CommentForm slug={slug} onSubmit={handleNewComment} />}
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