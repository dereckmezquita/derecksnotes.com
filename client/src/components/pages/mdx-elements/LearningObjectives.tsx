// src/components/LearningObjectives.tsx
import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

interface LearningObjectivesProps {
    children?: React.ReactNode;
}

const ObjectivesContainer = styled.div`
    padding: 20px;
    margin-bottom: 20px;
    border-left: 0.25em solid rgb(47, 129, 247);
`;

const ObjectivesTitle = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans',
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
`;

const Icon = styled(FaStar)`
    margin-right: 8px;
    color: rgb(47, 129, 247);
`;

const LearningObjectives: React.FC<LearningObjectivesProps> = ({
    children
}) => {
    return (
        <ObjectivesContainer>
            <ObjectivesTitle>
                <Icon />
                Learning Objectives
            </ObjectivesTitle>
            {children}
        </ObjectivesContainer>
    );
};

export default LearningObjectives;

// Usage in MDX:
// <LearningObjectives>
// - Understand the basics of React
// - Learn styled-components
// - Master TypeScript
// </LearningObjectives>
