import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import api_judge from '@utils/api/interact/judge';

const BadgeContainer = styled.div`
    display: inline-block;
    cursor: pointer;
    border-radius: 50%;
    padding: 4px;
    margin: 3px;
    font-size: 0.7em;
    font-family: ${theme.text.font.times};

    &.neutral {
        color: ${theme.text.colour.light_grey()};
    }

    &.like {
        color: ${theme.container.background.colour.green()};
    }

    &.dislike {
        color: ${theme.container.background.colour.red()};
    }
`;

interface LikeDislikeBadgeProps {
    initialCount: number;
    commentId: string;
    currentUserJudgement: 'like' | 'dislike' | 'neutral';
    onJudgementChange: (judgement: 'like' | 'dislike' | 'neutral', newTotal: number) => void;
}

const LikeDislikeBadge = ({ initialCount, commentId, currentUserJudgement, onJudgementChange }: LikeDislikeBadgeProps) => {
    const [count, setCount] = useState(initialCount);
    const [judgement, setJudgement] = useState<'like' | 'dislike' | 'neutral'>(currentUserJudgement);

    const handleBadgeClick = async () => {
        let newJudgement: 'like' | 'dislike' | 'neutral';

        if (judgement === 'neutral') {
            newJudgement = 'like';
        } else if (judgement === 'like') {
            newJudgement = 'dislike';
        } else {
            newJudgement = 'neutral';
        }

        let response;
        try {
            response = await api_judge('comment', commentId, newJudgement === 'neutral' ? 'dislike' : newJudgement);
            setJudgement(newJudgement);
            setCount(response.totalJudgement);
            onJudgementChange(newJudgement, response.totalJudgement);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setCount(initialCount);
        if (initialCount > 0) {
            setJudgement('like');
        } else if (initialCount < 0) {
            setJudgement('dislike');
        } else {
            setJudgement('neutral');
        }
    }, [initialCount]);

    return (
        <BadgeContainer className={judgement} onClick={handleBadgeClick}>
            {count}
        </BadgeContainer>
    );
};

export default LikeDislikeBadge;