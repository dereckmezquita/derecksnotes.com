import { useEffect, useState } from "react";
import styled from "styled-components";

import { theme } from "@styles/theme";

// --------------------------------------
import CommentForm from "./CommentForm";

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
                <CommentForm slug={slug} onSubmit={handleNewComment}/>}
            {comments.map(comment => (
                <div key={comment._id}>
                    <p>{comment.latestContent?.comment}</p>
                </div>
            ))}
        </CommentSectionContainer>
    )
}

export default CommentSection;