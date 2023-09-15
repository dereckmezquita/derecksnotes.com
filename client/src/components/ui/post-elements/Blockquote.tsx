import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

const StyledBlockquote = styled.blockquote`
    font-style: italic;
    position: relative;
    padding: 1em 2em;
    margin: 2em 0;
    background-color: #f9f9f9;
    border-left: 5px solid #a1a1a1;
    box-shadow: ${theme.container.shadow.box};

    &:before {
        content: '“';
        font-size: 3em;
        position: absolute;
        top: 10px;
        left: 10px;
        color: #a1a1a1;
    }

    &:after {
        content: '”';
        font-size: 3em;
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #a1a1a1;
  }
`;

const Author = styled.footer`
    margin-top: 0.75em;
    font-size: 1.1em;
    font-weight: bold;
    text-align: right;
    color: #666;
`;

interface BlockquoteProps {
    src?: string;
    children: React.ReactNode;
}

const Blockquote: React.FC<BlockquoteProps> = ({ src, children }) => {
    const parseMarkdownLink = (markdown: string) => {
        const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/;  // Matches [text](url)
        const match = markdown.match(markdownLinkPattern);

        if (match && match[1] && match[2]) {
            return <a href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>;
        }
        return markdown;
    };

    return (
        <StyledBlockquote>
            {children}
            {src && <Author>{parseMarkdownLink(src)}</Author>}
        </StyledBlockquote>
    );
};

export default Blockquote;
