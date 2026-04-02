'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
    SeriesMetadata,
    ContentNode,
    ContentCardMetadata
} from '@utils/mdx/contentTypes';
import { ContentSideBar } from '@components/content/ContentSideBar';
import {
    PostContainer,
    Article,
    PostContentWrapper
} from '@components/pages/posts-dictionaries';
import { Comments } from '@components/comments/Comments';
import { PostReactionButtons } from '@components/posts/PostReactionButtons';
import { usePageView } from '@hooks/usePageView';

// ============================================================================
// Styled Components
// ============================================================================

const SeriesMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.medium};
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
`;

const TagsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
`;

const Tag = styled.span`
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    padding: 2px 8px;
    border-radius: 4px;
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const TableOfContents = styled.section`
    margin-top: ${(props) => props.theme.container.spacing.xlarge};
    padding-top: ${(props) => props.theme.container.spacing.large};
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const ChapterBlock = styled.div`
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
`;

const ChapterTitle = styled.h3`
    font-size: ${(props) => props.theme.text.size.medium};
    color: ${(props) => props.theme.text.colour.primary()};
    margin: 0 0 ${(props) => props.theme.container.spacing.xsmall} 0;
`;

const ChapterSummary = styled.p`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    font-style: italic;
`;

const PartsList = styled.ol`
    list-style: none;
    margin: 0;
    padding-left: ${(props) => props.theme.container.spacing.medium};
`;

const PartItem = styled.li`
    margin-bottom: 2px;
`;

const PartLink = styled(Link)`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

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

// ============================================================================
// Component
// ============================================================================

interface SeriesOverviewProps {
    series: SeriesMetadata;
    section: string;
    prefaceSource: React.ReactNode;
    otherContent?: ContentCardMetadata[];
}

export function SeriesOverview({
    series,
    section,
    prefaceSource,
    otherContent = []
}: SeriesOverviewProps) {
    const [isClient, setIsClient] = useState(false);
    const slug = `${section}/${series.slug}`;

    usePageView({
        slug,
        title: series.title,
        enabled: isClient
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const seriesBaseUrl = `/${section}/${series.slug}`;

    const renderNode = (node: ContentNode): React.ReactNode => {
        if (!node.published) return null;

        if (node.isDirectory) {
            const publishedChildren = node.children.filter(
                (child) => child.published
            );

            return (
                <ChapterBlock key={node.path}>
                    <ChapterTitle>{node.displayTitle}</ChapterTitle>
                    {node.summary && (
                        <ChapterSummary>{node.summary}</ChapterSummary>
                    )}
                    {publishedChildren.length > 0 && (
                        <PartsList>
                            {publishedChildren.map((child) => (
                                <PartItem key={child.path}>
                                    {child.isDirectory ? (
                                        renderNode(child)
                                    ) : (
                                        <PartLink
                                            href={`${seriesBaseUrl}/${child.path}`}
                                        >
                                            {child.displayTitle}
                                        </PartLink>
                                    )}
                                </PartItem>
                            ))}
                        </PartsList>
                    )}
                </ChapterBlock>
            );
        }

        // Flat part (no chapter wrapper)
        return (
            <PartItem key={node.path}>
                <PartLink href={`${seriesBaseUrl}/${node.path}`}>
                    {node.displayTitle}
                </PartLink>
            </PartItem>
        );
    };

    // Check if hierarchy is flat (no directories, just parts)
    const isFlat = series.hierarchy.every((node) => !node.isDirectory);

    return (
        <PostContainer>
            <ContentSideBar
                section={section}
                series={series}
                otherContent={otherContent}
            />
            <Article>
                <h1>{series.title}</h1>
                <SeriesMeta>
                    <span>By {series.author}</span>
                    <span>Last updated: {series.date}</span>
                    <span>
                        {series.allParts.filter((p) => p.published).length}{' '}
                        parts
                    </span>
                </SeriesMeta>

                {series.tags.length > 0 && (
                    <TagsList>
                        {series.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </TagsList>
                )}

                {series.prefaceContent && isClient && (
                    <PostContentWrapper>{prefaceSource}</PostContentWrapper>
                )}

                <TableOfContents>
                    <h2>Contents</h2>
                    {isFlat ? (
                        // Flat structure - render as simple list
                        <PartsList>
                            {series.hierarchy
                                .filter((node) => node.published)
                                .map((node) => renderNode(node))}
                        </PartsList>
                    ) : (
                        // Hierarchical structure - render chapters
                        series.hierarchy
                            .filter((node) => node.published)
                            .map((node) => renderNode(node))
                    )}
                </TableOfContents>

                {isClient && (
                    <PostEngagement>
                        <PostReactionButtons slug={slug} title={series.title} />
                    </PostEngagement>
                )}

                {series.comments && (
                    <Comments slug={slug} title={series.title} />
                )}
            </Article>
        </PostContainer>
    );
}

export default SeriesOverview;
