import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

import api_get_articles_meta from '@utils/api/interact/get_articles_meta';
import { api_judge_article, api_judge_comment } from '@utils/api/interact/judge';

const LikeDislikeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0px;
`;

const Button = styled.button`
    border: none;
    background: none;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`;

const CountDisplay = styled.span`
    font-size: 1rem;
`;

interface LikeDislikeProps {
    likesDislikes: {
        likesCount: number;
        dislikesCount: number;
    };
    id: string;
    type: 'article' | 'comment';
    onStateChange?: (data: any) => void;
}

const LikeDislike = ({ likesDislikes, id, type, onStateChange }: LikeDislikeProps) => {
    const [likes, setLikes] = useState(likesDislikes.likesCount);
    const [dislikes, setDislikes] = useState(likesDislikes.dislikesCount);

    const handleJudgement = async (judgement: 'like' | 'dislike') => {
        try {
            let data;
            if (type === 'article') {
                data = await api_judge_article(id, judgement);
            } else if (type === 'comment') {
                data = await api_judge_comment(id, judgement);
            }

            if (data) {
                setLikes(data.data.likesCount);
                setDislikes(data.data.dislikesCount);
                if (onStateChange) {
                    onStateChange(data.data);
                }
            }
        } catch (error) {
            console.error('Error updating judgement:', error);
        }
    };

    return (
        <LikeDislikeContainer>
            <Button onClick={() => handleJudgement('like')}>
                <FaArrowUp />
            </Button>
            <CountDisplay>{likes}</CountDisplay>
            <Button onClick={() => handleJudgement('dislike')}>
                <FaArrowDown />
            </Button>
            <CountDisplay>{dislikes}</CountDisplay>
        </LikeDislikeContainer>
    );
};

export default LikeDislike;