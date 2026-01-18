'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { CourseMetadata, CourseNode } from '@utils/courses/fetchCourseMetadata';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideBarAbout
} from '@components/pages/posts-dictionaries';

const SideBarSectionTitle = styled.h3`
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    padding-bottom: ${(props) => props.theme.container.spacing.xsmall};
    border-bottom: 1px dashed
        ${(props) => props.theme.container.border.colour.primary()};
`;

const ChapterTitle = styled.div<{ $isActive?: boolean }>`
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) =>
        props.$isActive
            ? props.theme.text.colour.anchor()
            : props.theme.text.colour.primary()};
    margin-top: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.xsmall};
`;

const PartsList = styled.ul`
    list-style: none;
    margin: 0;
    padding-left: ${(props) => props.theme.container.spacing.small};
`;

const PartItem = styled.li`
    margin-bottom: 2px;
`;

const PartLink = styled(Link)<{ $isActive?: boolean }>`
    display: block;
    font-size: 13px;
    text-decoration: none;
    color: ${(props) =>
        props.$isActive
            ? props.theme.text.colour.anchor()
            : props.theme.text.colour.light_grey()};
    font-weight: ${(props) =>
        props.$isActive
            ? props.theme.text.weight.bold
            : props.theme.text.weight.normal};

    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

interface CourseSideBarProps {
    course: CourseMetadata;
}

export function CourseSideBar({ course }: CourseSideBarProps) {
    const pathname = usePathname();
    const courseBaseUrl = `/courses/${course.slug}`;

    const renderNode = (node: CourseNode): React.ReactNode => {
        if (!node.published) return null;

        const nodeUrl = `${courseBaseUrl}/${node.path}`;
        const isActive = pathname === nodeUrl || pathname === `${nodeUrl}/`;

        if (node.isDirectory) {
            const hasActiveChild = node.children.some((child) => {
                const childUrl = `${courseBaseUrl}/${child.path}`;
                return pathname.startsWith(childUrl);
            });

            return (
                <div key={node.path}>
                    <ChapterTitle $isActive={hasActiveChild}>
                        {node.displayTitle}
                    </ChapterTitle>
                    {node.children.length > 0 && (
                        <PartsList>
                            {node.children
                                .filter((child) => child.published)
                                .map((child) => (
                                    <PartItem key={child.path}>
                                        {renderNode(child)}
                                    </PartItem>
                                ))}
                        </PartsList>
                    )}
                </div>
            );
        }

        return (
            <PartLink href={nodeUrl} $isActive={isActive}>
                {node.displayTitle}
            </PartLink>
        );
    };

    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            <SideBarEntriesContainer>
                <SideBarSectionTitle>{course.title}</SideBarSectionTitle>
                <SideEntryLink href={courseBaseUrl}>
                    <em>Course Overview</em>
                </SideEntryLink>
                {course.hierarchy
                    .filter((node) => node.published)
                    .map((node) => renderNode(node))}
            </SideBarEntriesContainer>
            <SideBarAbout />
        </SideBarContainer>
    );
}

export default CourseSideBar;
