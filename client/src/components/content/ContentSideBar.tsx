'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import {
    SeriesMetadata,
    ContentNode,
    ContentCardMetadata,
    SIDEBAR_DEFAULT_LIMIT
} from '@utils/mdx/contentTypes';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideBarAbout
} from '@components/pages/posts-dictionaries';

// ============================================================================
// Styled Components
// ============================================================================

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

const OtherContentSection = styled.div`
    margin-top: ${(props) => props.theme.container.spacing.large};
    padding-top: ${(props) => props.theme.container.spacing.medium};
    border-top: 1px dashed
        ${(props) => props.theme.container.border.colour.primary()};
`;

const OtherContentLink = styled(Link)`
    display: block;
    font-size: 13px;
    text-decoration: none;
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-bottom: 4px;

    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

// ============================================================================
// Helper Functions
// ============================================================================

function formatSectionTitle(section: string): string {
    // Capitalize first letter
    return section.charAt(0).toUpperCase() + section.slice(1);
}

// ============================================================================
// Component
// ============================================================================

interface ContentSideBarProps {
    section: string;
    series?: SeriesMetadata;
    otherContent?: ContentCardMetadata[];
    sidebarLimit?: number;
}

export function ContentSideBar({
    section,
    series,
    otherContent = [],
    sidebarLimit = SIDEBAR_DEFAULT_LIMIT
}: ContentSideBarProps) {
    const pathname = usePathname();

    // Render a node in the series hierarchy
    const renderNode = (
        node: ContentNode,
        baseUrl: string
    ): React.ReactNode => {
        if (!node.published) return null;

        const nodeUrl = `${baseUrl}/${node.path}`;
        const isActive = pathname === nodeUrl || pathname === `${nodeUrl}/`;

        if (node.isDirectory) {
            const hasActiveChild = node.children.some((child) => {
                const childUrl = `${baseUrl}/${child.path}`;
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
                                        {renderNode(child, baseUrl)}
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

    // Render the "Other in [Section]" list
    const renderOtherContent = () => {
        if (otherContent.length === 0) return null;

        // Filter out the current series if viewing one
        const filteredContent = series
            ? otherContent.filter((item) => item.slug !== series.slug)
            : otherContent;

        const limitedContent = filteredContent.slice(0, sidebarLimit);

        if (limitedContent.length === 0) return null;

        return (
            <OtherContentSection>
                <SideBarSectionTitle>
                    Other in {formatSectionTitle(section)}
                </SideBarSectionTitle>
                {limitedContent.map((item) => (
                    <OtherContentLink key={item.slug} href={`/${item.path}`}>
                        <span style={{ fontWeight: 'bold' }}>{item.date}</span>:{' '}
                        {item.title}
                    </OtherContentLink>
                ))}
            </OtherContentSection>
        );
    };

    // If viewing a series, show series tree + other content
    if (series) {
        const seriesBaseUrl = `/${section}/${series.slug}`;

        return (
            <SideBarContainer>
                <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
                <SideBarEntriesContainer>
                    <SideBarSectionTitle>{series.title}</SideBarSectionTitle>
                    <SideEntryLink href={seriesBaseUrl}>
                        <em>Series Overview</em>
                    </SideEntryLink>
                    {series.hierarchy
                        .filter((node) => node.published)
                        .map((node) => renderNode(node, seriesBaseUrl))}
                </SideBarEntriesContainer>
                {renderOtherContent()}
                <SideBarAbout />
            </SideBarContainer>
        );
    }

    // Standalone content - just show other content in section
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            <SideBarEntriesContainer>
                <SideBarSectionTitle>
                    {formatSectionTitle(section)}
                </SideBarSectionTitle>
                {otherContent.slice(0, sidebarLimit).map((item) => (
                    <OtherContentLink key={item.slug} href={`/${item.path}`}>
                        <span style={{ fontWeight: 'bold' }}>{item.date}</span>:{' '}
                        {item.title}
                    </OtherContentLink>
                ))}
            </SideBarEntriesContainer>
            <SideBarAbout />
        </SideBarContainer>
    );
}

export default ContentSideBar;
