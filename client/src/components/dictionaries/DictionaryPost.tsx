'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { DictionarySideBar } from './DictionarySideBar';
import {
    Article,
    PostContainer,
    PostContentWrapper
} from '@components/pages/posts-dictionaries';
import { DefinitionMetadata } from '@utils/dictionaries/fetchDefinitionMetadata';
import { Comments } from '@components/comments/Comments';
import { PostReactionButtons } from '@components/posts/PostReactionButtons';
import { usePageView } from '@hooks/usePageView';

const PostEngagement = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: ${(props) => props.theme.container.spacing.large};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
    padding-top: ${(props) => props.theme.container.spacing.medium};
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

interface DictionaryPostProps {
    source: React.ReactNode;
    frontmatter: DefinitionMetadata;
    relatedDefinitions: DefinitionMetadata[];
}

export function DictionaryPost({
    source,
    frontmatter,
    relatedDefinitions
}: DictionaryPostProps) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    const slug = pathname.startsWith('/') ? pathname.substring(1) : pathname;
    const title = frontmatter.word;

    usePageView({
        slug,
        title,
        enabled: isClient
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <PostContainer>
            <DictionarySideBar definitions={relatedDefinitions} />
            <Article>
                <h1>{title}</h1>
                {isClient && <PostContentWrapper>{source}</PostContentWrapper>}

                {isClient && (
                    <PostEngagement>
                        <PostReactionButtons slug={slug} title={title} />
                    </PostEngagement>
                )}

                {frontmatter.comments && <Comments slug={slug} title={title} />}
            </Article>
        </PostContainer>
    );
}
