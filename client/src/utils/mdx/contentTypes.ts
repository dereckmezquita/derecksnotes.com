// ============================================================================
// Content Types - Can be imported by client components
// ============================================================================

export const SIDEBAR_DEFAULT_LIMIT = 20;

// How many levels of a content tree the sidebar shows before deeper nodes must
// be reached by drilling into a container page. The branch containing the active
// page is always expanded past this, so the current node is always navigable.
export const SIDEBAR_DEFAULT_DEPTH = 3;

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
  // Recursive-tree engine (courses) additions:
  hasPage?: boolean; // node renders its own page (containers with an index, and all leaves)
  transparent?: boolean; // container contributes no URL segment; its children promote up
  author?: string;
  coverImage?: string;
  comments?: boolean;
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
