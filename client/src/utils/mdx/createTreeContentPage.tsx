import React from 'react';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { APPLICATION_DEFAULT_METADATA } from '@/lib/constants';
import { processMdx } from '@/utils/mdx/processMdx';
import { accessReadFile } from '@/utils/accessReadFile';
import { decodeSlug } from '@/utils/helpers';

import {
  resolveTreePath,
  getAllTreePaths,
  getTreeSidebarContent,
  getTreePartNavigation,
  getTreeAncestors,
  INDEX_FILENAME
} from '@/utils/mdx/fetchTreeContent';
import { ContentNode, SeriesMetadata } from '@/utils/mdx/contentTypes';
import { ContentPost } from '@/components/content/ContentPost';
import {
  ContentContainer,
  BreadcrumbItem
} from '@/components/content/ContentContainer';

/**
 * Page factory for the recursive content tree (courses). Mirrors
 * createContentPage's surface (Page / generateStaticParams / generateMetadata)
 * but resolves URLs against each work's built dist/ tree under posts/ and renders:
 *   - work overview  (segments = [workSlug])           -> ContentContainer
 *   - container page (a chapter, etc.)                 -> ContentContainer
 *   - leaf page      (a part)                          -> ContentPost
 */
export function createTreeContentPage(section: string) {
  const workBase = (work: SeriesMetadata) => `/${section}/${work.slug}`;

  // Container page breadcrumb: work title + every container above `node`.
  const containerBreadcrumb = (
    work: SeriesMetadata,
    node: ContentNode | null
  ): BreadcrumbItem[] => {
    const base = workBase(work);
    const items: BreadcrumbItem[] = [{ label: work.title, href: base }];
    if (node) {
      for (const ancestor of getTreeAncestors(work, node)) {
        items.push({
          label: ancestor.displayTitle,
          href: `${base}/${ancestor.path}`
        });
      }
    }
    return items;
  };

  // Leaf breadcrumb: only the container ancestors (the work title is rendered
  // separately by ContentPost's SeriesTitle link).
  const leafBreadcrumb = (
    work: SeriesMetadata,
    node: ContentNode
  ): BreadcrumbItem[] => {
    const base = workBase(work);
    return getTreeAncestors(work, node).map((ancestor) => ({
      label: ancestor.displayTitle,
      href: `${base}/${ancestor.path}`
    }));
  };

  // Compile an index/preface body, returning null when there is no prose.
  async function readBody(filePath: string): Promise<React.ReactNode | null> {
    const raw = await accessReadFile(filePath);
    if (!raw) return null;
    const body = raw.replace(/^---[\s\S]*?---\s*/, '').trim();
    if (!body) return null;
    const { source } = await processMdx<any>(raw);
    return source;
  }

  // ========================================================================
  async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    try {
      return getAllTreePaths(section).map((segments) => ({ slug: segments }));
    } catch {
      // Content directory may not exist during some build contexts
      return [];
    }
  }

  // ========================================================================
  async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    const segments = (await params).slug.map(decodeSlug);
    const resolved = resolveTreePath(section, segments);
    if (!resolved) notFound();

    const { work, node } = resolved;
    if (!work.published) notFound();

    const otherContent = getTreeSidebarContent(section);

    // Work overview
    if (node === null) {
      const bodySource = await readBody(
        path.join(work.absolutePath, INDEX_FILENAME)
      );
      return (
        <ContentContainer
          section={section}
          work={work}
          node={null}
          bodySource={bodySource}
          breadcrumb={[]}
          otherContent={otherContent}
        />
      );
    }

    if (!node.published) notFound();

    // Container page (chapter, sub-chapter, ...)
    if (node.isDirectory) {
      const bodySource = await readBody(
        path.join(node.absolutePath, INDEX_FILENAME)
      );
      return (
        <ContentContainer
          section={section}
          work={work}
          node={node}
          bodySource={bodySource}
          breadcrumb={containerBreadcrumb(work, node)}
          otherContent={otherContent}
        />
      );
    }

    // Leaf page (a part)
    const markdown = await accessReadFile(node.absolutePath);
    if (!markdown) notFound();

    const { source, frontmatter } = await processMdx<any>(markdown);
    if (frontmatter.published === false) notFound();

    const { previous, next } = getTreePartNavigation(work, node.path);

    return (
      <ContentPost
        source={source}
        section={section}
        series={work}
        currentPart={node}
        previousPart={previous}
        nextPart={next}
        otherContent={otherContent}
        breadcrumb={leafBreadcrumb(work, node)}
      />
    );
  }

  // ========================================================================
  async function generateMetadata({
    params
  }: {
    params: Promise<{ slug: string[] }>;
  }): Promise<Metadata> {
    const segments = (await params).slug.map(decodeSlug);
    const resolved = resolveTreePath(section, segments);
    if (!resolved) return { title: 'Not Found' };

    const { work, node } = resolved;
    const metadataBase = new URL(APPLICATION_DEFAULT_METADATA.url!);
    const image = node?.coverImage || work.coverImage;

    const title = node ? node.title : work.title;
    const description = !node
      ? work.blurb || work.summary
      : node.isDirectory
        ? node.summary || work.title
        : `${node.displayTitle} — ${work.title}`;

    return {
      metadataBase,
      title: `Dn | ${title}`,
      description,
      openGraph: {
        title,
        description,
        images: [
          { url: image, width: 800, height: 600, alt: "Dereck's Notes Logo" }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image]
      }
    };
  }

  return { Page, generateStaticParams, generateMetadata };
}
