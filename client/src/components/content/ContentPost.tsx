'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  ContentMetadata,
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
import { ReadProgressTracker } from '@/components/posts/ReadProgressTracker';
import { usePageView } from '@/hooks/usePageView';
import { usePathname } from 'next/navigation';

// ============================================================================
// Styled Components
// ============================================================================

const SeriesTitle = styled(Link)`
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

/**
 * Meta line under the H1: date · author. Rendered for every post that
 * has a frontmatter date; falls back gracefully on either piece. Date is
 * formatted en-GB (day-first long form). Read time + word count are not
 * surfaced here because the source is already a React tree at this point;
 * the build step would need to thread them through if we ever want them.
 */
const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  margin: 0 0 ${(p) => p.theme.container.spacing.small};
`;

const MetaDot = styled.span`
  &::before {
    content: '·';
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.container.spacing.xsmall};
  margin-bottom: ${(props) => props.theme.container.spacing.medium};
`;

const Tag = styled.span`
  background-color: ${(props) =>
    props.theme.container.background.colour.light_contrast()};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: ${(props) => props.theme.text.size.small};
  color: ${(props) => props.theme.text.colour.light_grey()};
`;

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
  gap: ${(props) => props.theme.container.spacing.medium};
  margin-top: ${(props) => props.theme.container.spacing.large};
  margin-bottom: ${(props) => props.theme.container.spacing.large};
  padding-top: ${(props) => props.theme.container.spacing.medium};
  border-top: 1px solid
    ${(props) => props.theme.container.border.colour.primary()};
`;

// ============================================================================
// Component Props
// ============================================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BaseContentPostProps {
  source: React.ReactNode;
  section: string;
  otherContent: ContentCardMetadata[];
  // Optional container ancestors (e.g. the chapter a part lives in), rendered
  // above the title. Used by the recursive tree (courses); omitted elsewhere.
  breadcrumb?: BreadcrumbItem[];
}

interface StandaloneContentPostProps extends BaseContentPostProps {
  content: ContentMetadata;
  previousContent: ContentCardMetadata | null;
  nextContent: ContentCardMetadata | null;
}

interface SeriesContentPostProps extends BaseContentPostProps {
  series: SeriesMetadata;
  currentPart: ContentNode;
  previousPart: ContentNode | null;
  nextPart: ContentNode | null;
}

type ContentPostProps = StandaloneContentPostProps | SeriesContentPostProps;

// Type guards
function isSeriesPost(
  props: ContentPostProps
): props is SeriesContentPostProps {
  return 'series' in props && 'currentPart' in props;
}

// ============================================================================
// Component
// ============================================================================

export function ContentPost(props: ContentPostProps) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const slug = pathname.startsWith('/') ? pathname.substring(1) : pathname;

  const { source, section, otherContent } = props;

  // Determine title, comments, tags based on content type
  const title = isSeriesPost(props)
    ? props.currentPart.title
    : props.content.title;

  const displayTitle = isSeriesPost(props)
    ? props.currentPart.displayTitle
    : props.content.title;

  const comments = isSeriesPost(props)
    ? props.series.comments
    : props.content.comments;

  const tags = isSeriesPost(props)
    ? props.currentPart.tags || props.series.tags
    : props.content.tags;

  // Date prefers the most specific source: the current chapter for a series,
  // the standalone post otherwise. Author comes from the series for chapters
  // (a series carries one author across its parts).
  const isoDate = isSeriesPost(props)
    ? props.currentPart.date || props.series.date
    : props.content.date;
  const author = isSeriesPost(props)
    ? props.series.author
    : props.content.author;
  const formattedDate = isoDate
    ? new Date(isoDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  usePageView({
    slug,
    title,
    enabled: isClient
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render navigation for series content
  const renderSeriesNavigation = () => {
    if (!isSeriesPost(props)) return null;

    const { series, previousPart, nextPart } = props;
    const seriesBaseUrl = `/${section}/${series.slug}`;

    return (
      <Navigation>
        {previousPart ? (
          <NavLink href={`${seriesBaseUrl}/${previousPart.path}`} $align="left">
            <NavLabel>← Previous</NavLabel>
            <NavTitle>{previousPart.displayTitle}</NavTitle>
          </NavLink>
        ) : (
          <NavPlaceholder />
        )}
        {nextPart ? (
          <NavLink href={`${seriesBaseUrl}/${nextPart.path}`} $align="right">
            <NavLabel>Next →</NavLabel>
            <NavTitle>{nextPart.displayTitle}</NavTitle>
          </NavLink>
        ) : (
          <NavPlaceholder />
        )}
      </Navigation>
    );
  };

  // Render navigation for standalone content
  const renderStandaloneNavigation = () => {
    if (isSeriesPost(props)) return null;

    const { previousContent, nextContent } = props;

    // Don't render if no navigation available
    if (!previousContent && !nextContent) return null;

    return (
      <Navigation>
        {previousContent ? (
          <NavLink href={`/${previousContent.path}`} $align="left">
            <NavLabel>← Newer</NavLabel>
            <NavTitle>{previousContent.title}</NavTitle>
          </NavLink>
        ) : (
          <NavPlaceholder />
        )}
        {nextContent ? (
          <NavLink href={`/${nextContent.path}`} $align="right">
            <NavLabel>Older →</NavLabel>
            <NavTitle>{nextContent.title}</NavTitle>
          </NavLink>
        ) : (
          <NavPlaceholder />
        )}
      </Navigation>
    );
  };

  return (
    <PostContainer>
      <ContentSideBar
        section={section}
        series={isSeriesPost(props) ? props.series : undefined}
        otherContent={otherContent}
      />
      <Article>
        {/* Series title link (only for series content) */}
        {isSeriesPost(props) && (
          <SeriesTitle href={`/${section}/${props.series.slug}`}>
            {props.series.title}
          </SeriesTitle>
        )}

        {/* Container ancestors (e.g. the chapter this part belongs to) */}
        {props.breadcrumb && props.breadcrumb.length > 0 && (
          <Breadcrumb>
            {props.breadcrumb.map((item, i) => (
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

        {/* Meta: date · author */}
        {(formattedDate || author) && (
          <PostMeta>
            {formattedDate && <time dateTime={isoDate}>{formattedDate}</time>}
            {formattedDate && author && <MetaDot />}
            {author && <span>{author}</span>}
          </PostMeta>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <TagsList>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsList>
        )}

        {isClient && <PostContentWrapper>{source}</PostContentWrapper>}

        {/* Navigation */}
        {isSeriesPost(props)
          ? renderSeriesNavigation()
          : renderStandaloneNavigation()}

        {isClient && (
          <>
            <PostEngagement>
              <PostReactionButtons slug={slug} title={title} />
              <BookmarkButton slug={slug} title={title} />
            </PostEngagement>
            <ReadProgressTracker slug={slug} title={title} />
          </>
        )}

        {comments && <Comments slug={slug} title={title} />}
      </Article>
    </PostContainer>
  );
}

export default ContentPost;
