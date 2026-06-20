'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  SeriesMetadata,
  ContentNode,
  ContentCardMetadata
} from '@/utils/mdx/contentTypes';
import { ContentSideBar } from '@/components/content/ContentSideBar';
import {
  PostContainer,
  Article,
  PostContentWrapper
} from '@/components/pages/posts-dictionaries';
import { Comments } from '@/components/comments/Comments';
import { PostReactionButtons } from '@/components/posts/PostReactionButtons';
import { BookmarkButton } from '@/components/posts/BookmarkButton';
import { usePageView } from '@/hooks/usePageView';

// ============================================================================
// Styled Components
// ============================================================================

const Breadcrumb = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 6px;
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  margin-bottom: ${(p) => p.theme.container.spacing.small};
`;

const Crumb = styled(Link)`
  color: ${(p) => p.theme.text.colour.light_grey()};
  text-decoration: none;
  &:hover {
    color: ${(p) => p.theme.text.colour.anchor()};
    text-decoration: underline;
  }
`;

const CrumbSep = styled.span`
  &::before {
    content: '›';
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.container.spacing.medium};
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

const Description = styled.p`
  font-size: ${(p) => p.theme.text.size.medium};
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-style: italic;
  margin: 0 0 ${(p) => p.theme.container.spacing.large} 0;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.container.spacing.xsmall};
  margin-bottom: ${(p) => p.theme.container.spacing.large};
`;

const Tag = styled.span`
  background-color: ${(p) =>
    p.theme.container.background.colour.light_contrast()};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
`;

const TableOfContents = styled.section`
  margin-top: ${(p) => p.theme.container.spacing.xlarge};
  padding-top: ${(p) => p.theme.container.spacing.large};
  border-top: 1px solid ${(p) => p.theme.container.border.colour.primary()};
`;

const ChapterBlock = styled.div`
  margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

const ChapterHeading = styled.h3`
  font-size: ${(p) => p.theme.text.size.medium};
  color: ${(p) => p.theme.text.colour.primary()};
  margin: 0 0 ${(p) => p.theme.container.spacing.xsmall} 0;
`;

const ChapterHeadingLink = styled(Link)`
  font-size: ${(p) => p.theme.text.size.medium};
  font-weight: ${(p) => p.theme.text.weight.bold};
  color: ${(p) => p.theme.text.colour.primary()};
  text-decoration: none;
  &:hover {
    color: ${(p) => p.theme.text.colour.anchor()};
    text-decoration: underline;
  }
`;

const ChapterSummary = styled.p`
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  margin: 0 0 ${(p) => p.theme.container.spacing.small} 0;
  font-style: italic;
`;

const PartsList = styled.ol`
  list-style: none;
  margin: 0;
  padding-left: ${(p) => p.theme.container.spacing.medium};
`;

const PartItem = styled.li`
  margin-bottom: 2px;
`;

const PartLink = styled(Link)`
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.anchor()};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const PostEngagement = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.medium};
  margin-top: ${(p) => p.theme.container.spacing.large};
  margin-bottom: ${(p) => p.theme.container.spacing.large};
  padding-top: ${(p) => p.theme.container.spacing.medium};
  border-top: 1px solid ${(p) => p.theme.container.border.colour.primary()};
`;

// ============================================================================
// Component
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ContentContainerProps {
  section: string;
  work: SeriesMetadata;
  /** The container being viewed; null = the work overview (work root). */
  node: ContentNode | null;
  bodySource: React.ReactNode;
  breadcrumb: BreadcrumbItem[];
  otherContent?: ContentCardMetadata[];
}

export function ContentContainer({
  section,
  work,
  node,
  bodySource,
  breadcrumb,
  otherContent = []
}: ContentContainerProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const baseUrl = `/${section}/${work.slug}`;
  const slug = node ? `${baseUrl.slice(1)}/${node.path}` : baseUrl.slice(1);
  const title = node ? node.title : work.title;
  const displayTitle = node ? node.displayTitle : work.title;
  const author = node?.author || work.author;
  const date = node?.date || work.date;
  const tags = node?.tags || work.tags;
  const comments = node?.comments ?? work.comments;
  const children = node ? node.children : work.hierarchy;

  usePageView({ slug, title, enabled: isClient });

  // Render the contents tree: directories become headings (linked when they
  // have their own page), leaves become links. Recurses to any depth so every
  // node is reachable from the overview regardless of the sidebar depth limit.
  const renderNode = (n: ContentNode): React.ReactNode => {
    if (!n.published) return null;
    const url = `${baseUrl}/${n.path}`;

    if (n.isDirectory) {
      const kids = n.children.filter((c) => c.published);
      return (
        <ChapterBlock key={n.path}>
          {n.hasPage ? (
            <ChapterHeadingLink href={url}>{n.displayTitle}</ChapterHeadingLink>
          ) : (
            <ChapterHeading>{n.displayTitle}</ChapterHeading>
          )}
          {n.summary && <ChapterSummary>{n.summary}</ChapterSummary>}
          {kids.length > 0 && (
            <PartsList>{kids.map((c) => renderNode(c))}</PartsList>
          )}
        </ChapterBlock>
      );
    }

    return (
      <PartItem key={n.path}>
        <PartLink href={url}>{n.displayTitle}</PartLink>
      </PartItem>
    );
  };

  const publishedChildren = children.filter((c) => c.published);
  const partsCount = work.allParts.filter((p) => p.published).length;

  return (
    <PostContainer>
      <ContentSideBar
        section={section}
        series={work}
        otherContent={otherContent}
      />
      <Article>
        {breadcrumb.length > 0 && (
          <Breadcrumb>
            {breadcrumb.map((item, i) => (
              <React.Fragment key={`${item.label}-${i}`}>
                {i > 0 && <CrumbSep />}
                {item.href ? (
                  <Crumb href={item.href}>{item.label}</Crumb>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </Breadcrumb>
        )}

        <h1>{displayTitle}</h1>

        {node?.summary && <Description>{node.summary}</Description>}

        <Meta>
          {author && <span>By {author}</span>}
          {date && <span>Last updated: {date}</span>}
          {!node && partsCount > 0 && <span>{partsCount} parts</span>}
        </Meta>

        {tags && tags.length > 0 && (
          <TagsList>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsList>
        )}

        {bodySource && isClient && (
          <PostContentWrapper>{bodySource}</PostContentWrapper>
        )}

        {publishedChildren.length > 0 && (
          <TableOfContents>
            <h2>Contents</h2>
            {publishedChildren.map((c) => renderNode(c))}
          </TableOfContents>
        )}

        {isClient && (
          <PostEngagement>
            <PostReactionButtons slug={slug} title={title} />
            <BookmarkButton slug={slug} title={title} />
          </PostEngagement>
        )}

        {comments && <Comments slug={slug} title={title} />}
      </Article>
    </PostContainer>
  );
}

export default ContentContainer;
