import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

import { DATE_YYYY_MM_DD } from '@lib/dates';
import { ROOT_DIR_APP } from '@lib/constants.server';
import { extractSummaryFromMdx } from './extractMdxSummary';

// Re-export types for convenience
export * from './contentTypes';

import {
    ContentLabels,
    SeriesManifest,
    ChapterMeta,
    ContentFrontmatter,
    ContentNode,
    ContentMetadata,
    SeriesMetadata,
    ContentCardMetadata,
    SIDEBAR_DEFAULT_LIMIT
} from './contentTypes';

// ============================================================================
// Constants
// ============================================================================

export const SERIES_MANIFEST_FILENAME = '_series.mdx';
export const CHAPTER_META_FILENAME = '_meta.yaml';

const IGNORED_DIRS = [
    'drafts',
    'deprecated',
    'ignore',
    'src',
    'data',
    'node_modules',
    '.git'
];

const DEFAULT_LABELS: ContentLabels = {
    1: 'Chapter',
    2: 'Part',
    3: 'Section',
    4: 'Topic'
};

// ============================================================================
// Helper Functions
// ============================================================================

function readYamlFile<T>(filePath: string): T | null {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return yaml.load(content) as T;
    } catch (error) {
        console.error(`Error reading YAML file: ${filePath}`, error);
        return null;
    }
}

function readMdxFrontmatter<T>(
    filePath: string
): { frontmatter: T; content: string } | null {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const file = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(file);
        return { frontmatter: data as T, content };
    } catch (error) {
        console.error(`Error reading MDX file: ${filePath}`, error);
        return null;
    }
}

function sortByNumericPrefix(items: string[]): string[] {
    return items.sort((a, b) => {
        const numA = parseInt(a.match(/^(\d+)/)?.[1] || '999', 10);
        const numB = parseInt(b.match(/^(\d+)/)?.[1] || '999', 10);
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
    });
}

function formatCoverImage(coverImage: string | number): string {
    const img = String(coverImage);
    if (img.startsWith('/')) {
        return img;
    }
    return `/site-images/card-covers/${img}.png`;
}

// ============================================================================
// Core Detection Functions
// ============================================================================

/**
 * Check if a directory is a multi-part series (has _series.mdx)
 */
export function isSeriesDirectory(dirPath: string): boolean {
    const manifestPath = path.join(dirPath, SERIES_MANIFEST_FILENAME);
    return fs.existsSync(manifestPath);
}

/**
 * Validate that a directory has proper structure
 * Throws error if folder exists without _series.mdx
 */
export function validateContentDirectory(dirPath: string): void {
    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) return;

    const name = path.basename(dirPath);
    if (IGNORED_DIRS.includes(name)) return;

    if (!isSeriesDirectory(dirPath)) {
        throw new Error(
            `Directory "${dirPath}" is missing ${SERIES_MANIFEST_FILENAME}. ` +
                `All content directories must have a ${SERIES_MANIFEST_FILENAME} manifest file.`
        );
    }
}

// ============================================================================
// Hierarchy Building Functions
// ============================================================================

/**
 * Recursively build the content hierarchy tree
 */
function buildHierarchyTree(
    dirPath: string,
    seriesDir: string,
    labels: ContentLabels,
    parentPublished: boolean,
    depth: number,
    siblingIndex: number
): ContentNode | null {
    const stat = fs.statSync(dirPath);
    const name = path.basename(dirPath);
    const relativePath = path.relative(seriesDir, dirPath);

    const label = labels[depth] || '';

    if (stat.isDirectory()) {
        if (IGNORED_DIRS.includes(name)) {
            return null;
        }

        const metaPath = path.join(dirPath, CHAPTER_META_FILENAME);
        const meta = readYamlFile<ChapterMeta>(metaPath);

        if (!meta) {
            // No _meta.yaml - skip this directory
            return null;
        }

        const isPublished =
            meta.published !== undefined ? meta.published : parentPublished;

        const items = fs.readdirSync(dirPath);
        const subdirs = sortByNumericPrefix(
            items.filter((item) => {
                const itemPath = path.join(dirPath, item);
                return (
                    fs.statSync(itemPath).isDirectory() &&
                    !IGNORED_DIRS.includes(item)
                );
            })
        );
        const mdxFiles = sortByNumericPrefix(
            items.filter(
                (item) =>
                    item.endsWith('.mdx') && item !== SERIES_MANIFEST_FILENAME
            )
        );

        const children: ContentNode[] = [];
        let childIndex = 1;

        for (const subdir of subdirs) {
            const childNode = buildHierarchyTree(
                path.join(dirPath, subdir),
                seriesDir,
                labels,
                isPublished,
                depth + 1,
                childIndex
            );
            if (childNode) {
                children.push(childNode);
                childIndex++;
            }
        }

        for (const mdxFile of mdxFiles) {
            const mdxPath = path.join(dirPath, mdxFile);
            const mdxData = readMdxFrontmatter<ContentFrontmatter>(mdxPath);

            if (!mdxData) continue;

            const partPublished =
                mdxData.frontmatter.published !== undefined
                    ? mdxData.frontmatter.published
                    : isPublished;

            const childLabel = labels[depth + 1] || '';
            const partTitle = mdxData.frontmatter.title;
            const displayTitle = childLabel
                ? `${childLabel} ${childIndex}: ${partTitle}`
                : partTitle;

            children.push({
                slug: path.basename(mdxFile, '.mdx'),
                path: path.join(relativePath, mdxFile).replace('.mdx', ''),
                absolutePath: mdxPath,
                title: partTitle,
                label: childLabel,
                number: childIndex,
                displayTitle,
                depth: depth + 1,
                isDirectory: false,
                children: [],
                published: partPublished,
                date: mdxData.frontmatter.date,
                tags: mdxData.frontmatter.tags
            });
            childIndex++;
        }

        const displayTitle = label
            ? `${label} ${siblingIndex}: ${meta.title}`
            : meta.title;

        return {
            slug: name,
            path: relativePath,
            absolutePath: dirPath,
            title: meta.title,
            label,
            number: siblingIndex,
            displayTitle,
            summary: meta.summary,
            depth,
            isDirectory: true,
            children,
            published: isPublished
        };
    }

    return null;
}

/**
 * Build hierarchy for flat series (MDX files directly in series folder, no chapters)
 */
function buildFlatHierarchy(
    seriesDir: string,
    labels: ContentLabels,
    parentPublished: boolean
): ContentNode[] {
    const items = fs.readdirSync(seriesDir);
    const mdxFiles = sortByNumericPrefix(
        items.filter(
            (item) => item.endsWith('.mdx') && item !== SERIES_MANIFEST_FILENAME
        )
    );

    const nodes: ContentNode[] = [];
    let index = 1;
    const label = labels[1] || '';

    for (const mdxFile of mdxFiles) {
        const mdxPath = path.join(seriesDir, mdxFile);
        const mdxData = readMdxFrontmatter<ContentFrontmatter>(mdxPath);

        if (!mdxData) continue;

        const partPublished =
            mdxData.frontmatter.published !== undefined
                ? mdxData.frontmatter.published
                : parentPublished;

        const partTitle = mdxData.frontmatter.title;
        const displayTitle = label
            ? `${label} ${index}: ${partTitle}`
            : partTitle;

        nodes.push({
            slug: path.basename(mdxFile, '.mdx'),
            path: path.basename(mdxFile, '.mdx'),
            absolutePath: mdxPath,
            title: partTitle,
            label,
            number: index,
            displayTitle,
            depth: 1,
            isDirectory: false,
            children: [],
            published: partPublished,
            date: mdxData.frontmatter.date,
            tags: mdxData.frontmatter.tags
        });
        index++;
    }

    return nodes;
}

/**
 * Flatten hierarchy tree to get all leaf nodes (content files)
 */
function flattenHierarchy(nodes: ContentNode[]): ContentNode[] {
    const result: ContentNode[] = [];

    for (const node of nodes) {
        if (!node.isDirectory) {
            result.push(node);
        }
        if (node.children.length > 0) {
            result.push(...flattenHierarchy(node.children));
        }
    }

    return result;
}

/**
 * Get first content node in hierarchy
 */
function getFirstContentNode(nodes: ContentNode[]): ContentNode | null {
    for (const node of nodes) {
        if (!node.isDirectory && node.published) {
            return node;
        }
        if (node.children.length > 0) {
            const found = getFirstContentNode(node.children);
            if (found) return found;
        }
    }
    return null;
}

// ============================================================================
// Content Loading Functions
// ============================================================================

/**
 * Load standalone content metadata from a single MDX file
 */
export function loadContentMetadata(
    filePath: string,
    section: string
): ContentMetadata | null {
    const mdxData = readMdxFrontmatter<ContentFrontmatter>(filePath);
    if (!mdxData) return null;

    const { frontmatter, content } = mdxData;
    const slug = path.basename(filePath, '.mdx');
    const summary = extractSummaryFromMdx(content);

    return {
        slug,
        title: frontmatter.title,
        blurb: frontmatter.blurb || '',
        summary: summary ? summary.substring(0, 300) + '...' : undefined,
        coverImage: formatCoverImage(frontmatter.coverImage || '1'),
        author: frontmatter.author || 'Unknown',
        date: frontmatter.date
            ? DATE_YYYY_MM_DD(frontmatter.date)
            : DATE_YYYY_MM_DD(new Date().toISOString()),
        tags: frontmatter.tags || [],
        published: frontmatter.published,
        comments: frontmatter.comments ?? true,
        section,
        path: `${section}/${slug}`,
        absolutePath: filePath
    };
}

/**
 * Load full series metadata from a series directory
 */
export function loadSeriesMetadata(
    seriesDir: string,
    section: string
): SeriesMetadata | null {
    const manifestPath = path.join(seriesDir, SERIES_MANIFEST_FILENAME);

    if (!fs.existsSync(manifestPath)) {
        return null;
    }

    const manifestData = readMdxFrontmatter<SeriesManifest>(manifestPath);
    if (!manifestData) {
        return null;
    }

    const { frontmatter, content } = manifestData;

    const labels: ContentLabels = {
        ...DEFAULT_LABELS,
        ...frontmatter.labels
    };

    // Check for subdirectories with _meta.yaml (hierarchical structure)
    const items = fs.readdirSync(seriesDir);
    const subdirs = sortByNumericPrefix(
        items.filter((item) => {
            const itemPath = path.join(seriesDir, item);
            return (
                fs.statSync(itemPath).isDirectory() &&
                !IGNORED_DIRS.includes(item)
            );
        })
    );

    let hierarchy: ContentNode[] = [];

    // Check if we have chapter subdirectories
    const hasChapters = subdirs.some((subdir) => {
        const metaPath = path.join(seriesDir, subdir, CHAPTER_META_FILENAME);
        return fs.existsSync(metaPath);
    });

    if (hasChapters) {
        // Hierarchical structure
        let siblingIndex = 1;
        for (const subdir of subdirs) {
            const node = buildHierarchyTree(
                path.join(seriesDir, subdir),
                seriesDir,
                labels,
                frontmatter.published,
                1,
                siblingIndex
            );
            if (node) {
                hierarchy.push(node);
                siblingIndex++;
            }
        }
    } else {
        // Flat structure (MDX files directly in series folder)
        hierarchy = buildFlatHierarchy(
            seriesDir,
            labels,
            frontmatter.published
        );
    }

    const allParts = flattenHierarchy(hierarchy);

    // Get date from frontmatter or first content
    let seriesDate = frontmatter.date;
    if (!seriesDate) {
        const firstContent = getFirstContentNode(hierarchy);
        if (firstContent?.date) {
            seriesDate = firstContent.date;
        }
    }

    const slug = path.basename(seriesDir);
    const summary = extractSummaryFromMdx(content);

    return {
        slug,
        title: frontmatter.title,
        blurb: frontmatter.blurb || '',
        summary: summary ? summary.substring(0, 300) + '...' : undefined,
        coverImage: formatCoverImage(frontmatter.coverImage),
        author: frontmatter.author,
        date: seriesDate
            ? DATE_YYYY_MM_DD(seriesDate)
            : DATE_YYYY_MM_DD(new Date().toISOString()),
        tags: frontmatter.tags || [],
        published: frontmatter.published,
        comments: frontmatter.comments,
        section,
        path: `${section}/${slug}`,
        absolutePath: seriesDir,
        labels,
        prefaceContent: content,
        hierarchy,
        allParts
    };
}

// ============================================================================
// Section Content Functions
// ============================================================================

/**
 * Get all content for a section (for landing page cards)
 */
export function getSectionContent(section: string): ContentCardMetadata[] {
    const postsDir = path.join(ROOT_DIR_APP, section, 'posts');

    if (!fs.existsSync(postsDir)) {
        return [];
    }

    const items = fs.readdirSync(postsDir);
    const content: ContentCardMetadata[] = [];

    for (const item of items) {
        const itemPath = path.join(postsDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            if (IGNORED_DIRS.includes(item)) continue;

            // Validate directory has manifest
            if (!isSeriesDirectory(itemPath)) {
                throw new Error(
                    `Directory "${itemPath}" is missing ${SERIES_MANIFEST_FILENAME}. ` +
                        `All content directories must have a ${SERIES_MANIFEST_FILENAME} manifest file.`
                );
            }

            const series = loadSeriesMetadata(itemPath, section);
            if (series && series.published) {
                content.push({
                    slug: series.slug,
                    title: series.title,
                    blurb: series.blurb,
                    summary: series.summary || series.blurb,
                    coverImage: series.coverImage,
                    author: series.author,
                    date: series.date,
                    tags: series.tags,
                    published: series.published,
                    section,
                    path: series.path,
                    isSeries: true
                });
            }
        } else if (item.endsWith('.mdx')) {
            // Standalone content
            const metadata = loadContentMetadata(itemPath, section);
            if (metadata && metadata.published) {
                content.push({
                    slug: metadata.slug,
                    title: metadata.title,
                    blurb: metadata.blurb,
                    summary: metadata.summary || metadata.blurb,
                    coverImage: metadata.coverImage,
                    author: metadata.author,
                    date: metadata.date,
                    tags: metadata.tags,
                    published: metadata.published,
                    section,
                    path: metadata.path,
                    isSeries: false
                });
            }
        }
    }

    // Sort by date (newest first)
    return content.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/**
 * Get sidebar content for a section (last N items)
 */
export function getSidebarContent(
    section: string,
    limit: number = SIDEBAR_DEFAULT_LIMIT
): ContentCardMetadata[] {
    const content = getSectionContent(section);
    return content.slice(0, limit);
}

// ============================================================================
// Navigation Functions
// ============================================================================

/**
 * Find a specific part within a series by its path
 */
export function findPartByPath(
    series: SeriesMetadata,
    partPath: string
): ContentNode | null {
    const normalizedPath = partPath.replace(/\.mdx$/, '');

    for (const part of series.allParts) {
        if (part.path === normalizedPath) {
            return part;
        }
    }

    return null;
}

/**
 * Get navigation info (previous/next) for a series part
 */
export function getPartNavigation(
    series: SeriesMetadata,
    currentPath: string
): {
    previous: ContentNode | null;
    next: ContentNode | null;
} {
    const publishedParts = series.allParts.filter((p) => p.published);
    const currentIndex = publishedParts.findIndex(
        (p) => p.path === currentPath.replace(/\.mdx$/, '')
    );

    return {
        previous: currentIndex > 0 ? publishedParts[currentIndex - 1] : null,
        next:
            currentIndex < publishedParts.length - 1
                ? publishedParts[currentIndex + 1]
                : null
    };
}

/**
 * Get navigation info (previous/next) for standalone content by date
 */
export function getStandaloneNavigation(
    section: string,
    currentSlug: string
): {
    previous: ContentCardMetadata | null;
    next: ContentCardMetadata | null;
} {
    const allContent = getSectionContent(section);
    const currentIndex = allContent.findIndex((c) => c.slug === currentSlug);

    if (currentIndex === -1) {
        return { previous: null, next: null };
    }

    return {
        // Previous = newer post (lower index since sorted newest first)
        previous: currentIndex > 0 ? allContent[currentIndex - 1] : null,
        // Next = older post (higher index)
        next:
            currentIndex < allContent.length - 1
                ? allContent[currentIndex + 1]
                : null
    };
}
