'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { CourseMetadata, CourseNode } from '@utils/mdx/fetchCourseMetadata';
import { CourseSideBar } from '@components/courses/CourseSideBar';
import {
    PostContainer,
    Article,
    PostContentWrapper
} from '@components/pages/posts-dictionaries';
import { Comments } from '@components/comments/Comments';
import { PostReactionButtons } from '@components/posts/PostReactionButtons';
import { usePageView } from '@hooks/usePageView';

const CourseMeta = styled.div`
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

interface CourseOverviewProps {
    course: CourseMetadata;
    prefaceSource: React.ReactNode;
}

export function CourseOverview({ course, prefaceSource }: CourseOverviewProps) {
    const [isClient, setIsClient] = useState(false);
    const slug = `courses/${course.slug}`;

    usePageView({
        slug,
        title: course.title,
        enabled: isClient
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const courseBaseUrl = `/courses/${course.slug}`;

    const renderNode = (node: CourseNode): React.ReactNode => {
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
                                            href={`${courseBaseUrl}/${child.path}`}
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

        return (
            <PartItem key={node.path}>
                <PartLink href={`${courseBaseUrl}/${node.path}`}>
                    {node.displayTitle}
                </PartLink>
            </PartItem>
        );
    };

    return (
        <PostContainer>
            <CourseSideBar course={course} />
            <Article>
                <h1>{course.title}</h1>
                <CourseMeta>
                    <span>By {course.author}</span>
                    <span>Last updated: {course.date}</span>
                    <span>
                        {course.allParts.filter((p) => p.published).length}{' '}
                        parts
                    </span>
                </CourseMeta>

                {course.tags.length > 0 && (
                    <TagsList>
                        {course.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </TagsList>
                )}

                {course.prefaceContent && isClient && (
                    <PostContentWrapper>{prefaceSource}</PostContentWrapper>
                )}

                <TableOfContents>
                    <h2>Course Contents</h2>
                    {course.hierarchy
                        .filter((node) => node.published)
                        .map((node) => renderNode(node))}
                </TableOfContents>

                {isClient && (
                    <PostEngagement>
                        <PostReactionButtons slug={slug} title={course.title} />
                    </PostEngagement>
                )}

                {course.comments && (
                    <Comments slug={slug} title={course.title} />
                )}
            </Article>
        </PostContainer>
    );
}

export default CourseOverview;
