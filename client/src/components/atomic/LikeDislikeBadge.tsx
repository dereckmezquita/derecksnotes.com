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
    color: white;

    &.neutral {
        background-color: ${theme.container.border.colour.primary(undefined, undefined, 65)};
        border: 2px solid ${theme.container.border.colour.primary(undefined, undefined, 80)};
    }

    &.like {
        background-color: ${theme.container.background.colour.green()};
        border: 2px solid ${theme.container.background.colour.green(undefined, undefined, 80)};
    }

    &.dislike {
        background-color: ${theme.container.background.colour.red()};
        border: 2px solid ${theme.container.background.colour.red(undefined, undefined, 80)};
    }
`;

interface LikeDislikeBadgeProps {
    initialCount: number;
    commentId: string;
    currentUserJudgement: 'like' | 'dislike' | 'neutral';
    onJudgementChange: (judgement: 'like' | 'dislike' | 'neutral') => void;
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

        setJudgement(newJudgement);
        onJudgementChange(newJudgement);

        try {
            const response = await api_judge('comment', commentId, newJudgement);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setCount(initialCount);
        setJudgement('neutral');
    }, [initialCount]);

    return (
        <BadgeContainer className={judgement} onClick={handleBadgeClick}>
            {count}
        </BadgeContainer>
    );
};

export default LikeDislikeBadge;