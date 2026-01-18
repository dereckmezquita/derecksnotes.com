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
import { usePathname } from 'next/navigation';

const CourseTitle = styled(Link)`
    display: block;
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-decoration: none;
    margin-bottom: ${(props) => props.theme.container.spacing.small};

    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

// Navigation component for prev/next links
const Navigation = styled.nav`
    display: flex;
    justify-content: space-between;
    margin-top: ${(props) => props.theme.container.spacing.xlarge};
    padding-top: ${(props) => props.theme.container.spacing.large};
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const NavLink = styled(Link)<{ $align?: 'left' | 'right' }>`
    display: flex;
    flex-direction: column;
    text-decoration: none;
    max-width: 45%;
    text-align: ${(props) => (props.$align === 'right' ? 'right' : 'left')};

    &:hover {
        text-decoration: underline;
    }
`;

const NavLabel = styled.span`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-bottom: ${(props) => props.theme.container.spacing.xsmall};
`;

const NavTitle = styled.span`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.anchor()};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

const NavPlaceholder = styled.div`
    width: 45%;
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

interface CoursePostProps {
    course: CourseMetadata;
    currentPart: CourseNode;
    source: React.ReactNode;
    previousPart: CourseNode | null;
    nextPart: CourseNode | null;
}

export function CoursePost({
    course,
    currentPart,
    source,
    previousPart,
    nextPart
}: CoursePostProps) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    const slug = pathname.startsWith('/') ? pathname.substring(1) : pathname;
    const courseBaseUrl = `/courses/${course.slug}`;

    usePageView({
        slug,
        title: currentPart.title,
        enabled: isClient
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <PostContainer>
            <CourseSideBar course={course} />
            <Article>
                <CourseTitle href={courseBaseUrl}>{course.title}</CourseTitle>
                <h1>{currentPart.displayTitle}</h1>
                {isClient && <PostContentWrapper>{source}</PostContentWrapper>}

                <Navigation>
                    {previousPart ? (
                        <NavLink
                            href={`${courseBaseUrl}/${previousPart.path}`}
                            $align="left"
                        >
                            <NavLabel>← Previous</NavLabel>
                            <NavTitle>{previousPart.displayTitle}</NavTitle>
                        </NavLink>
                    ) : (
                        <NavPlaceholder />
                    )}
                    {nextPart ? (
                        <NavLink
                            href={`${courseBaseUrl}/${nextPart.path}`}
                            $align="right"
                        >
                            <NavLabel>Next →</NavLabel>
                            <NavTitle>{nextPart.displayTitle}</NavTitle>
                        </NavLink>
                    ) : (
                        <NavPlaceholder />
                    )}
                </Navigation>

                {isClient && (
                    <PostEngagement>
                        <PostReactionButtons
                            slug={slug}
                            title={currentPart.title}
                        />
                    </PostEngagement>
                )}

                {course.comments && (
                    <Comments slug={slug} title={currentPart.title} />
                )}
            </Article>
        </PostContainer>
    );
}

export default CoursePost;
