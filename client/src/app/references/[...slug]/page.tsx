import fs from 'fs';
import path from 'path';
import { APPLICATION_DEFAULT_METADATA } from '@lib/constants';
import { ROOT_DIR_APP } from '@lib/constants.server';
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
    SERIES_MANIFEST_FILENAME
} from '@utils/mdx/fetchContentMetadata';
import { ContentPost } from '@components/content/ContentPost';
import { SeriesOverview } from '@components/content/SeriesOverview';

const section = 'references';
const postsDir = path.join(ROOT_DIR_APP, section, 'posts');

// ============================================================================
// Helper Functions
// ============================================================================

const IGNORED_DIRS = ['drafts', 'deprecated', 'ignore', 'src', 'data'];

/**
 * Collect all paths for a series (overview + all parts)
 */
function collectSeriesPaths(seriesSlug: string, seriesDir: string): string[][] {
    const series = loadSeriesMetadata(seriesDir, section);
    if (!series) return [];

    const paths: string[][] = [];

    // Series overview page
    paths.push([seriesSlug]);

    // All published parts
    for (const part of series.allParts) {
        if (part.published) {
            const segments = part.path.split('/');
            paths.push([seriesSlug, ...segments]);
        }
    }

    return paths;
}

// ============================================================================
// Static Params Generation
// ============================================================================

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    const items = fs.readdirSync(postsDir);
    const params: { slug: string[] }[] = [];

    for (const item of items) {
        const itemPath = path.join(postsDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            if (IGNORED_DIRS.includes(item)) continue;

            // Series directory (has _series.mdx)
            if (isSeriesDirectory(itemPath)) {
                const seriesPaths = collectSeriesPaths(item, itemPath);
                params.push(
                    ...seriesPaths.map((segments) => ({ slug: segments }))
                );
            }
            // Folder without _series.mdx - error will be thrown at build time
        } else if (item.endsWith('.mdx')) {
            // Standalone content
            const slug = item.replace('.mdx', '');
            params.push({ slug: [slug] });
        }
    }

    return params;
}

// ============================================================================
// Page Component
// ============================================================================

async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    const decodedSegments = (await params).slug.map(decodeSlug);
    const firstSegment = decodedSegments[0];
    const itemPath = path.join(postsDir, firstSegment);

    // Get sidebar content for this section
    const otherContent = getSidebarContent(section);

    // Check if this is a series
    if (fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()) {
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
            const manifestPath = path.join(itemPath, SERIES_MANIFEST_FILENAME);
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
    const filePath = itemPath + '.mdx';
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

    const { previous, next } = getStandaloneNavigation(section, content.slug);

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

export default Page;

// ============================================================================
// Metadata Generation
// ============================================================================

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const decodedSegments = (await params).slug.map(decodeSlug);
    const firstSegment = decodedSegments[0];
    const itemPath = path.join(postsDir, firstSegment);

    // Series
    if (fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()) {
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
    const filePath = itemPath + '.mdx';
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
