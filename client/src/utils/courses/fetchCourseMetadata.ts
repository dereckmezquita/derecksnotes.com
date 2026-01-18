import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import { visit } from 'unist-util-visit';

import { DATE_YYYY_MM_DD } from '@lib/dates';
import { ROOT_DIR_APP } from '@lib/constants.server';

// ============================================================================
// Types
// ============================================================================

export interface CourseLabels {
    [depth: number]: string;
}

export interface CourseManifest {
    title: string;
    blurb?: string;
    coverImage: number;
    author: string;
    date?: string;
    tags: string[];
    published: boolean;
    comments: boolean;
    labels?: CourseLabels;
}

export interface ChapterMeta {
    title: string;
    summary?: string;
    published?: boolean;
}

export interface PartMeta {
    title: string;
    published?: boolean;
    date?: string;
    tags?: string[];
}

// Represents a node in the course hierarchy (could be chapter, section, part, etc.)
export interface CourseNode {
    // Identification
    slug: string; // URL-safe identifier
    path: string; // Full path relative to course directory
    absolutePath: string; // Absolute filesystem path

    // Display
    title: string;
    label?: string; // e.g., "Chapter", "Part", "Section"
    number?: number; // Position among siblings (1-indexed)
    displayTitle: string; // e.g., "Chapter 1: Introduction"
    summary?: string;

    // Hierarchy
    depth: number;
    isDirectory: boolean;
    children: CourseNode[];

    // State
    published: boolean;

    // For leaf nodes (actual content files)
    date?: string;
    tags?: string[];
}

export interface CourseMetadata {
    // From course.mdx frontmatter
    slug: string;
    title: string;
    blurb: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    comments: boolean;

    // Hierarchy labels
    labels: CourseLabels;

    // Preface content (MDX body of course.mdx)
    prefaceContent?: string;

    // Full tree structure
    hierarchy: CourseNode[];

    // Flattened list of all content nodes (leaf nodes only)
    allParts: CourseNode[];

    // For backwards compatibility with PostMetadata
    section?: string;
    url?: string;
    path?: string;
}

// Simplified metadata for landing page cards
export interface CourseCardMetadata {
    slug: string;
    title: string;
    blurb: string;
    summary: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    section?: string;
    path: string; // URL path for card links
    isCourse: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

const DEFAULT_LABELS: CourseLabels = {
    1: 'Chapter',
    2: 'Part',
    3: 'Section',
    4: 'Topic'
};

const IGNORED_DIRS = [
    'drafts',
    'deprecated',
    'ignore',
    'src',
    'data',
    'node_modules',
    '.git'
];

function extractSummaryFromMdx(content: string): string {
    try {
        const parsedContent = remark()
            .use(remarkGfm)
            .use(remarkMath)
            .use(mdx)
            .use(strip)
            .parse(content);

        const paragraphs: string[] = [];
        visit(parsedContent, 'paragraph', (node: any) => {
            const textContent = node.children
                .map((child: any) => child.value?.trim() || '')
                .join('');

            if (textContent.trim() !== '') {
                paragraphs.push(textContent);
            }
        });

        const summary = remark()
            .processSync(paragraphs.join(' '))
            .toString()
            .trim();

        return summary.substring(0, 300) + (summary.length > 300 ? '...' : '');
    } catch {
        return '';
    }
}

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
        // Extract leading numbers
        const numA = parseInt(a.match(/^(\d+)/)?.[1] || '999', 10);
        const numB = parseInt(b.match(/^(\d+)/)?.[1] || '999', 10);
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
    });
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Check if a directory is a multi-part course (has course.mdx)
 */
export function isCourseDirectory(dirPath: string): boolean {
    const courseMdxPath = path.join(dirPath, 'course.mdx');
    return fs.existsSync(courseMdxPath);
}

/**
 * Recursively build the course hierarchy tree
 */
function buildHierarchyTree(
    dirPath: string,
    courseDir: string,
    labels: CourseLabels,
    parentPublished: boolean,
    depth: number,
    siblingIndex: number
): CourseNode | null {
    const stat = fs.statSync(dirPath);
    const name = path.basename(dirPath);
    const relativePath = path.relative(courseDir, dirPath);

    // Get label for this depth
    const label = labels[depth] || '';

    if (stat.isDirectory()) {
        // Skip ignored directories
        if (IGNORED_DIRS.includes(name)) {
            return null;
        }

        // Read _meta.yaml if it exists
        const metaPath = path.join(dirPath, '_meta.yaml');
        const meta = readYamlFile<ChapterMeta>(metaPath);

        if (!meta) {
            // No _meta.yaml - skip this directory (it's not a chapter)
            return null;
        }

        // Determine published status (cascade from parent)
        const isPublished =
            meta.published !== undefined ? meta.published : parentPublished;

        // Get children (subdirectories and mdx files)
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
                (item) => item.endsWith('.mdx') && item !== 'course.mdx'
            )
        );

        // Build children recursively
        const children: CourseNode[] = [];
        let childIndex = 1;

        // First, add subdirectories
        for (const subdir of subdirs) {
            const childNode = buildHierarchyTree(
                path.join(dirPath, subdir),
                courseDir,
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

        // Then, add mdx files at this level
        for (const mdxFile of mdxFiles) {
            const mdxPath = path.join(dirPath, mdxFile);
            const mdxData = readMdxFrontmatter<PartMeta>(mdxPath);

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
 * Flatten the hierarchy tree to get all leaf nodes (content files)
 */
function flattenHierarchy(nodes: CourseNode[]): CourseNode[] {
    const result: CourseNode[] = [];

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
 * Get the first content file in a hierarchy (for getting course date, etc.)
 */
function getFirstContentNode(nodes: CourseNode[]): CourseNode | null {
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

/**
 * Load full course metadata from a course directory
 */
export function loadCourseMetadata(courseDir: string): CourseMetadata | null {
    const courseMdxPath = path.join(courseDir, 'course.mdx');

    if (!fs.existsSync(courseMdxPath)) {
        return null;
    }

    const courseData = readMdxFrontmatter<CourseManifest>(courseMdxPath);
    if (!courseData) {
        return null;
    }

    const { frontmatter, content } = courseData;

    // Merge labels with defaults
    const labels: CourseLabels = { ...DEFAULT_LABELS, ...frontmatter.labels };

    // Build hierarchy tree from subdirectories
    const items = fs.readdirSync(courseDir);
    const subdirs = sortByNumericPrefix(
        items.filter((item) => {
            const itemPath = path.join(courseDir, item);
            return (
                fs.statSync(itemPath).isDirectory() &&
                !IGNORED_DIRS.includes(item)
            );
        })
    );

    const hierarchy: CourseNode[] = [];
    let siblingIndex = 1;

    for (const subdir of subdirs) {
        const node = buildHierarchyTree(
            path.join(courseDir, subdir),
            courseDir,
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

    // Flatten to get all parts
    const allParts = flattenHierarchy(hierarchy);

    // Get course date from frontmatter or first content
    let courseDate = frontmatter.date;
    if (!courseDate) {
        const firstContent = getFirstContentNode(hierarchy);
        if (firstContent?.date) {
            courseDate = firstContent.date;
        }
    }

    const slug = path.basename(courseDir);

    return {
        slug,
        title: frontmatter.title,
        blurb: frontmatter.blurb || '',
        coverImage: `/site-images/card-covers/${frontmatter.coverImage}.png`,
        author: frontmatter.author,
        date: courseDate
            ? DATE_YYYY_MM_DD(courseDate)
            : DATE_YYYY_MM_DD(new Date().toISOString()),
        tags: frontmatter.tags || [],
        published: frontmatter.published,
        comments: frontmatter.comments,
        labels,
        prefaceContent: content,
        hierarchy,
        allParts
    };
}

/**
 * Get course card metadata for landing page display
 */
export function getCourseCardMetadata(
    courseDir: string
): CourseCardMetadata | null {
    // Check if it's a multi-part course
    if (isCourseDirectory(courseDir)) {
        const course = loadCourseMetadata(courseDir);
        if (!course || !course.published) {
            return null;
        }

        // Extract summary from preface content
        const summary = course.prefaceContent
            ? extractSummaryFromMdx(course.prefaceContent)
            : course.blurb;

        return {
            slug: course.slug,
            title: course.title,
            blurb: course.blurb,
            summary: summary || course.blurb,
            coverImage: course.coverImage,
            author: course.author,
            date: course.date,
            tags: course.tags,
            published: course.published,
            path: `courses/${course.slug}`, // URL path for card links
            isCourse: true
        };
    }

    return null;
}

/**
 * Get all courses for the landing page
 */
export function getAllCourses(postsDir: string): CourseCardMetadata[] {
    const items = fs.readdirSync(postsDir);
    const courses: CourseCardMetadata[] = [];

    for (const item of items) {
        const itemPath = path.join(postsDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Check if it's a new-style course (has course.mdx)
            if (isCourseDirectory(itemPath)) {
                const card = getCourseCardMetadata(itemPath);
                if (card) {
                    courses.push(card);
                }
            }
            // TODO: Handle legacy courses (directories without course.mdx)
        } else if (item.endsWith('.mdx')) {
            // Single-file course
            const mdxData = readMdxFrontmatter<any>(itemPath);
            if (mdxData && mdxData.frontmatter.published) {
                const summary = extractSummaryFromMdx(mdxData.content);
                const slug = path.basename(item, '.mdx');
                courses.push({
                    slug,
                    title: mdxData.frontmatter.title,
                    blurb: mdxData.frontmatter.blurb || '',
                    summary: summary || mdxData.frontmatter.blurb || '',
                    coverImage: `/site-images/card-covers/${mdxData.frontmatter.coverImage}.png`,
                    author: mdxData.frontmatter.author,
                    date: DATE_YYYY_MM_DD(mdxData.frontmatter.date),
                    tags: mdxData.frontmatter.tags || [],
                    published: mdxData.frontmatter.published,
                    path: `courses/${slug}`, // URL path for card links
                    isCourse: false
                });
            }
        }
    }

    // Sort by date (newest first)
    return courses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/**
 * Find a specific part within a course by its path
 */
export function findPartByPath(
    course: CourseMetadata,
    partPath: string
): CourseNode | null {
    const normalizedPath = partPath.replace(/\.mdx$/, '');

    for (const part of course.allParts) {
        if (part.path === normalizedPath) {
            return part;
        }
    }

    return null;
}

/**
 * Get navigation info (previous/next) for a part
 */
export function getPartNavigation(
    course: CourseMetadata,
    currentPath: string
): {
    previous: CourseNode | null;
    next: CourseNode | null;
} {
    const publishedParts = course.allParts.filter((p) => p.published);
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
