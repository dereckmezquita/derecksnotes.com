// ============================================================================
// Content Types - Can be imported by client components
// ============================================================================

export const SIDEBAR_DEFAULT_LIMIT = 20;

export interface ContentLabels {
    [depth: number]: string;
}

// Frontmatter for _series.mdx manifest
export interface SeriesManifest {
    title: string;
    blurb?: string;
    coverImage: string | number;
    author: string;
    date?: string;
    tags: string[];
    published: boolean;
    comments: boolean;
    labels?: ContentLabels;
}

// Frontmatter for _meta.yaml (chapter/section metadata)
export interface ChapterMeta {
    title: string;
    summary?: string;
    published?: boolean;
}

// Frontmatter for individual MDX content files
export interface ContentFrontmatter {
    title: string;
    blurb?: string;
    coverImage?: string | number;
    author?: string;
    date?: string;
    tags?: string[];
    published: boolean;
    comments?: boolean;
}

// Node in series hierarchy (chapter, section, part, etc.)
export interface ContentNode {
    slug: string;
    path: string;
    absolutePath: string;
    title: string;
    label?: string;
    number?: number;
    displayTitle: string;
    summary?: string;
    depth: number;
    isDirectory: boolean;
    children: ContentNode[];
    published: boolean;
    date?: string;
    tags?: string[];
}

// Standalone content metadata
export interface ContentMetadata {
    slug: string;
    title: string;
    blurb: string;
    summary?: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    comments: boolean;
    section: string;
    path: string;
    absolutePath: string;
}

// Multi-part series metadata
export interface SeriesMetadata extends ContentMetadata {
    labels: ContentLabels;
    prefaceContent?: string;
    hierarchy: ContentNode[];
    allParts: ContentNode[];
}

// For landing page cards (both standalone and series)
export interface ContentCardMetadata {
    slug: string;
    title: string;
    blurb: string;
    summary: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    section: string;
    path: string;
    isSeries: boolean;
    // Optional - populated at runtime from database
    likes?: number;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isSeriesMetadata(
    content: ContentMetadata | SeriesMetadata
): content is SeriesMetadata {
    return 'hierarchy' in content && 'allParts' in content;
}
