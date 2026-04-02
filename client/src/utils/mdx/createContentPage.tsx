import fs from 'fs';
import path from 'path';
import { APPLICATION_DEFAULT_METADATA } from '@lib/constants';
import { processMdx } from '@utils/mdx/processMdx';
import { notFound } from 'next/navigation';
import { accessReadFile } from '@utils/accessReadFile';
import { Metadata } from 'next';
import { decodeSlug } from '@utils/helpers';

import {
    isSeriesDirectory,
    loadSeriesMetadata,
    loadContentMetadata,
    findPartByPath,
    getPartNavigation,
    getStandaloneNavigation,
    getSidebarContent,
    resolveSlugToPath,
    getAllContentPaths,
    SERIES_MANIFEST_FILENAME
} from '@utils/mdx/fetchContentMetadata';
import { ContentPost } from '@components/content/ContentPost';
import { SeriesOverview } from '@components/content/SeriesOverview';

/**
 * Factory function that creates a complete content page setup for a given section.
 * Returns the Page component, generateStaticParams, and generateMetadata functions.
 *
 * Usage:
 * ```typescript
 * // In your page.tsx file:
 * import { createContentPage } from '@utils/mdx/createContentPage';
 *
 * const { Page, generateStaticParams, generateMetadata } = createContentPage('courses');
 *
 * export { generateStaticParams, generateMetadata };
 * export default Page;
 * ```
 *
 * @param section - The content section name (e.g., 'courses', 'blog', 'references')
 */
export function createContentPage(section: string) {
    // ========================================================================
    // Static Params Generation
    // ========================================================================

    async function generateStaticParams(): Promise<{ slug: string[] }[]> {
        const paths = getAllContentPaths(section);
        return paths.map((segments) => ({ slug: segments }));
    }

    // ========================================================================
    // Page Component
    // ========================================================================

    async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
        const decodedSegments = (await params).slug.map(decodeSlug);
        const firstSegment = decodedSegments[0];

        // Find the actual path (may be inside a passthrough folder)
        const itemPath = resolveSlugToPath(section, firstSegment);

        // Get sidebar content for this section
        const otherContent = getSidebarContent(section);

        // Check if this is a series
        if (
            itemPath &&
            fs.existsSync(itemPath) &&
            fs.statSync(itemPath).isDirectory()
        ) {
            if (!isSeriesDirectory(itemPath)) {
                throw new Error(
                    `Directory "${itemPath}" is missing ${SERIES_MANIFEST_FILENAME}. ` +
                        `All content directories must have a ${SERIES_MANIFEST_FILENAME} manifest file.`
                );
            }

            const series = loadSeriesMetadata(itemPath, section);
            if (!series || !series.published) {
                notFound();
            }

            // Series overview page
            if (decodedSegments.length === 1) {
                const manifestPath = path.join(
                    itemPath,
                    SERIES_MANIFEST_FILENAME
                );
                const manifestContent = await accessReadFile(manifestPath);

                if (!manifestContent) {
                    notFound();
                }

                const { source: prefaceSource } =
                    await processMdx<any>(manifestContent);

                return (
                    <SeriesOverview
                        series={series}
                        section={section}
                        prefaceSource={prefaceSource}
                        otherContent={otherContent}
                    />
                );
            }

            // Series part
            const partPath = decodedSegments.slice(1).join('/');
            const part = findPartByPath(series, partPath);

            if (!part || !part.published) {
                notFound();
            }

            const partContent = await accessReadFile(part.absolutePath);
            if (!partContent) {
                notFound();
            }

            const { source } = await processMdx<any>(partContent);
            const { previous, next } = getPartNavigation(series, partPath);

            return (
                <ContentPost
                    source={source}
                    section={section}
                    series={series}
                    currentPart={part}
                    previousPart={previous}
                    nextPart={next}
                    otherContent={otherContent}
                />
            );
        }

        // Standalone content
        if (!itemPath) {
            notFound();
        }

        const filePath = itemPath.endsWith('.mdx')
            ? itemPath
            : itemPath + '.mdx';
        const markdown = await accessReadFile(filePath);

        if (!markdown) {
            notFound();
        }

        const { source, frontmatter } = await processMdx<any>(markdown);

        if (!frontmatter.published) {
            notFound();
        }

        const content = loadContentMetadata(filePath, section);
        if (!content) {
            notFound();
        }

        const { previous, next } = getStandaloneNavigation(
            section,
            content.slug
        );

        return (
            <ContentPost
                source={source}
                section={section}
                content={content}
                previousContent={previous}
                nextContent={next}
                otherContent={otherContent}
            />
        );
    }

    // ========================================================================
    // Metadata Generation
    // ========================================================================

    async function generateMetadata({
        params
    }: {
        params: Promise<{ slug: string[] }>;
    }): Promise<Metadata> {
        const decodedSegments = (await params).slug.map(decodeSlug);
        const firstSegment = decodedSegments[0];

        // Find the actual path (may be inside a passthrough folder)
        const itemPath = resolveSlugToPath(section, firstSegment);

        // Series
        if (
            itemPath &&
            fs.existsSync(itemPath) &&
            fs.statSync(itemPath).isDirectory()
        ) {
            if (!isSeriesDirectory(itemPath)) {
                return { title: 'Not Found' };
            }

            const series = loadSeriesMetadata(itemPath, section);
            if (!series) {
                return { title: 'Series Not Found' };
            }

            // Series overview
            if (decodedSegments.length === 1) {
                return {
                    metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
                    title: `Dn | ${series.title}`,
                    description: series.blurb || series.summary,
                    openGraph: {
                        title: series.title,
                        description: series.blurb || series.summary,
                        images: [
                            {
                                url: series.coverImage,
                                width: 800,
                                height: 600,
                                alt: "Dereck's Notes Logo"
                            }
                        ]
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: series.title,
                        description: series.blurb || series.summary,
                        images: [series.coverImage]
                    }
                };
            }

            // Series part
            const partPath = decodedSegments.slice(1).join('/');
            const part = findPartByPath(series, partPath);

            if (part) {
                const description = `${part.displayTitle} - ${series.title}`;
                return {
                    metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
                    title: `Dn | ${part.title}`,
                    description,
                    openGraph: {
                        title: part.title,
                        description,
                        images: [
                            {
                                url: series.coverImage,
                                width: 800,
                                height: 600,
                                alt: "Dereck's Notes Logo"
                            }
                        ]
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: part.title,
                        description,
                        images: [series.coverImage]
                    }
                };
            }
        }

        // Standalone content
        if (!itemPath) {
            return { title: 'Not Found' };
        }

        const filePath = itemPath.endsWith('.mdx')
            ? itemPath
            : itemPath + '.mdx';
        const content = loadContentMetadata(filePath, section);

        if (!content) {
            return { title: 'Not Found' };
        }

        return {
            metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
            title: `Dn | ${content.title}`,
            description: content.summary || content.blurb,
            openGraph: {
                title: content.title,
                description: content.summary || content.blurb,
                images: [
                    {
                        url: content.coverImage,
                        width: 800,
                        height: 600,
                        alt: "Dereck's Notes Logo"
                    }
                ]
            },
            twitter: {
                card: 'summary_large_image',
                title: content.title,
                description: content.summary || content.blurb,
                images: [content.coverImage]
            }
        };
    }

    return {
        Page,
        generateStaticParams,
        generateMetadata
    };
}
