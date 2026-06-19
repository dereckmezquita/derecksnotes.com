// ============================================================================
// Recursive tree content engine (courses)
// ============================================================================
//
// Reads the served course tree under ROOT_DIR_APP/<section>/posts and exposes it
// as a forest of uniform nodes. There is ONE concept: a node. A folder is a
// container; a file is a leaf. A folder describes itself with an optional
// `index.mdx` whose frontmatter is the same shape as a leaf's. This single
// recursion replaces the old series / chapter / part special-casing.
//
// Layout (uniform with blog/dictionaries — a `src/` of authored sources, with
// the built output served alongside):
//
//   posts/<family>/                 # organisational grouping
//     index.mdx                     # `transparent: true` -> kept out of the URL
//     data/                         # datasets (ignored)
//     <work>/
//       src/                        # AUTHORED sources (.Rmd + index.mdx) — ignored here
//       dist/                       # BUILT output (.mdx + index.mdx) — what we serve
//         index.mdx
//         01-chapter/ index.mdx + 01-part.mdx ...
//
// Rules:
//   - `src`, `data`, `assets`, drafts/deprecated/ignore, dotfiles -> ignored.
//   - A folder that contains a `dist/` is a built work: its content is the
//     `dist/` subtree, and `dist/` itself adds NO URL segment (transparent).
//   - `transparent: true` in a folder's index removes it from the URL at any
//     depth (its children promote up) — replaces the old `_passthrough` marker.
//   - Order prefixes ("01-") are a sort key only; stripped to form the slug.
//   - displayTitle = a positional dotted number + the node's OWN title; no node
//     stores an ancestor's title, so the "every part shows the series title" bug
//     cannot recur.
//
// Produces the existing SeriesMetadata / ContentNode shapes so the content
// components can be reused. A "work" (top routable unit — a book/volume) maps
// onto SeriesMetadata.
// ============================================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { DATE_YYYY_MM_DD } from '@/lib/dates';
import { ROOT_DIR_APP } from '@/lib/constants.server';
import { extractSummaryFromMdx } from './extractMdxSummary';
import {
  ContentNode,
  SeriesMetadata,
  ContentCardMetadata,
  SIDEBAR_DEFAULT_LIMIT
} from './contentTypes';

// Re-export shared types for convenience
export * from './contentTypes';

export const INDEX_FILENAME = 'index.mdx';
export const BUILD_DIR = 'dist';

const IGNORED_DIR_NAMES = new Set([
  'src',
  'dist',
  'data',
  'assets',
  'node_modules',
  'drafts',
  'deprecated',
  'ignore'
]);

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function isIgnored(name: string): boolean {
  return (
    IGNORED_DIR_NAMES.has(name) ||
    name.startsWith('.') ||
    name.endsWith('.ignore')
  );
}

// "01-describing-data" -> "describing-data"; "mathematical-statistics-1-foundations"
// is unchanged (no LEADING numeric-prefix segment).
function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+(?:[-_.]\d+)*[-_]/, '');
}

function humanize(slug: string): string {
  const s = slug.replace(/[-_]/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sortByPrefix(names: string[]): string[] {
  return [...names].sort((a, b) => {
    const na = parseInt(a.match(/^(\d+)/)?.[1] ?? '999999', 10);
    const nb = parseInt(b.match(/^(\d+)/)?.[1] ?? '999999', 10);
    if (na !== nb) return na - nb;
    return a.localeCompare(b);
  });
}

function formatCoverImage(coverImage?: string | number): string {
  const img = String(coverImage ?? '1');
  return img.startsWith('/') ? img : `/site-images/card-covers/${img}.png`;
}

function readDoc(filePath: string): { data: any; content: string } | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return { data, content };
  } catch (error) {
    console.error(`[tree] failed reading ${filePath}`, error);
    return null;
  }
}

function sectionRoot(section: string): string {
  return path.join(ROOT_DIR_APP, section, 'posts');
}

// The directory that actually holds a folder's served content: its `dist/` if it
// has one (a built work), otherwise the folder itself (a grouping / chapter).
function contentDirOf(dir: string): string {
  const built = path.join(dir, BUILD_DIR);
  try {
    if (fs.statSync(built).isDirectory()) return built;
  } catch {
    /* no dist/ */
  }
  return dir;
}

interface Inherited {
  published: boolean;
  author?: string;
  date?: string;
  tags?: string[];
  coverImage?: string | number;
  comments?: boolean;
}

function inheritFrom(
  fm: any,
  parent: Inherited,
  published: boolean
): Inherited {
  return {
    published,
    author: fm.author ?? parent.author,
    date: fm.date ?? parent.date,
    tags: fm.tags ?? parent.tags,
    coverImage: fm.coverImage ?? parent.coverImage,
    comments: fm.comments ?? parent.comments
  };
}

// ----------------------------------------------------------------------------
// Tree construction
// ----------------------------------------------------------------------------

/**
 * Build the child nodes found in `contentDir`. `parentPath` is the URL path
 * (slugs joined) of the containing node, relative to its work root.
 */
function buildChildren(
  contentDir: string,
  parentPath: string,
  inherited: Inherited,
  depth: number
): ContentNode[] {
  const entries = fs
    .readdirSync(contentDir)
    .filter((name) => !isIgnored(name) && name !== INDEX_FILENAME);
  const nodes: ContentNode[] = [];

  for (const name of sortByPrefix(entries)) {
    const abs = path.join(contentDir, name);
    const stat = fs.statSync(abs);

    if (stat.isDirectory()) {
      const cdir = contentDirOf(abs);
      const idx = readDoc(path.join(cdir, INDEX_FILENAME));
      const fm = idx?.data ?? {};
      const slug = stripOrderPrefix(name);
      const published = fm.published ?? inherited.published;
      const childInherited = inheritFrom(fm, inherited, published);

      // Transparent container: contributes no URL segment; promote its children.
      if (fm.transparent) {
        nodes.push(...buildChildren(cdir, parentPath, childInherited, depth));
        continue;
      }

      const nodePath = parentPath ? `${parentPath}/${slug}` : slug;
      const title = fm.title || humanize(slug);
      nodes.push({
        slug,
        path: nodePath,
        absolutePath: cdir,
        title,
        displayTitle: title,
        summary: fm.summary,
        depth,
        isDirectory: true,
        hasPage: true,
        children: buildChildren(cdir, nodePath, childInherited, depth + 1),
        published,
        date: fm.date ?? inherited.date,
        tags: fm.tags ?? inherited.tags,
        author: fm.author ?? inherited.author,
        coverImage:
          fm.coverImage != null ? formatCoverImage(fm.coverImage) : undefined,
        comments: fm.comments ?? inherited.comments
      });
    } else if (name.endsWith('.mdx')) {
      const doc = readDoc(abs);
      const fm = doc?.data ?? {};
      const slug = stripOrderPrefix(path.basename(name, '.mdx'));
      const nodePath = parentPath ? `${parentPath}/${slug}` : slug;
      const title = fm.title || humanize(slug);
      nodes.push({
        slug,
        path: nodePath,
        absolutePath: abs,
        title,
        displayTitle: title,
        summary: fm.summary,
        depth,
        isDirectory: false,
        hasPage: true,
        children: [],
        published: fm.published ?? inherited.published,
        date: fm.date ?? inherited.date,
        tags: fm.tags ?? inherited.tags,
        author: fm.author ?? inherited.author,
        coverImage:
          fm.coverImage != null ? formatCoverImage(fm.coverImage) : undefined,
        comments: fm.comments ?? inherited.comments
      });
    }
  }

  return nodes;
}

/**
 * Assign positional dotted numbers ("1", "1.2", "1.2.3") to published nodes and
 * fold them into displayTitle. Numbering is structural (derived from tree
 * position), never read from frontmatter — so it cannot echo an ancestor title.
 */
function assignNumbers(nodes: ContentNode[], prefix: string): void {
  let visible = 0;
  for (const node of nodes) {
    if (!node.published) {
      node.displayTitle = node.title;
      if (node.children.length) assignNumbers(node.children, prefix);
      continue;
    }
    visible += 1;
    const dotted = prefix ? `${prefix}.${visible}` : `${visible}`;
    node.number = visible;
    node.displayTitle = `${dotted} ${node.title}`;
    if (node.children.length) assignNumbers(node.children, dotted);
  }
}

function flattenLeaves(nodes: ContentNode[]): ContentNode[] {
  const out: ContentNode[] = [];
  for (const node of nodes) {
    if (!node.isDirectory) out.push(node);
    if (node.children.length) out.push(...flattenLeaves(node.children));
  }
  return out;
}

function flattenAll(nodes: ContentNode[]): ContentNode[] {
  const out: ContentNode[] = [];
  for (const node of nodes) {
    out.push(node);
    if (node.children.length) out.push(...flattenAll(node.children));
  }
  return out;
}

interface WorkDescriptor {
  dir: string;
  contentDir: string; // dir/dist if built, else dir
  slug: string;
  index: { data: any; content: string } | null;
}

/** Find the top-level works in a section, descending through transparent groupings. */
function collectWorks(dir: string, acc: WorkDescriptor[]): void {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (isIgnored(name) || name === INDEX_FILENAME) continue;
    const abs = path.join(dir, name);
    if (!fs.statSync(abs).isDirectory()) continue;
    const contentDir = contentDirOf(abs);
    const index = readDoc(path.join(contentDir, INDEX_FILENAME));
    if (index?.data?.transparent) {
      collectWorks(contentDir, acc); // organisational grouping: descend, no URL segment
    } else {
      acc.push({ dir: abs, contentDir, slug: stripOrderPrefix(name), index });
    }
  }
}

function getWorks(section: string): WorkDescriptor[] {
  const acc: WorkDescriptor[] = [];
  collectWorks(sectionRoot(section), acc);
  return acc;
}

/** Build full SeriesMetadata for a work. Hierarchy paths are relative to the work. */
function loadWork(work: WorkDescriptor, section: string): SeriesMetadata {
  const fm = work.index?.data ?? {};
  const inherited: Inherited = {
    published: fm.published ?? true,
    author: fm.author,
    date: fm.date,
    tags: fm.tags,
    coverImage: fm.coverImage,
    comments: fm.comments
  };
  const hierarchy = buildChildren(work.contentDir, '', inherited, 1);
  assignNumbers(hierarchy, '');
  const allParts = flattenLeaves(hierarchy);
  const summaryText = work.index
    ? extractSummaryFromMdx(work.index.content)
    : undefined;
  const date = fm.date ?? allParts.find((p) => p.date)?.date;

  return {
    slug: work.slug,
    title: fm.title || humanize(work.slug),
    blurb: fm.blurb || '',
    summary: summaryText ? summaryText.substring(0, 300) + '...' : undefined,
    coverImage: formatCoverImage(fm.coverImage),
    author: fm.author || 'Unknown',
    date: date
      ? DATE_YYYY_MM_DD(date)
      : DATE_YYYY_MM_DD(new Date().toISOString()),
    tags: fm.tags || [],
    published: fm.published ?? true,
    comments: fm.comments ?? true,
    section,
    path: `${section}/${work.slug}`,
    absolutePath: work.contentDir,
    labels: {},
    prefaceContent: work.index?.content,
    hierarchy,
    allParts
  };
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

/** Landing-page cards for a section (one per top-level work). */
export function getTreeSectionContent(section: string): ContentCardMetadata[] {
  const cards: ContentCardMetadata[] = [];
  try {
    for (const work of getWorks(section)) {
      const series = loadWork(work, section);
      if (!series.published) continue;
      cards.push({
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
        isSeries: series.hierarchy.length > 0
      });
    }
  } catch (error) {
    console.error(`[tree] error scanning section "${section}":`, error);
    return [];
  }
  return cards.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getTreeSidebarContent(
  section: string,
  limit: number = SIDEBAR_DEFAULT_LIMIT
): ContentCardMetadata[] {
  return getTreeSectionContent(section).slice(0, limit);
}

/**
 * Resolve URL segments to a work + node. `node` is null for a work overview.
 * The first segment is the work slug; the rest is the node path within the work.
 */
export function resolveTreePath(
  section: string,
  segments: string[]
): { work: SeriesMetadata; node: ContentNode | null } | null {
  if (segments.length === 0) return null;
  const [workSlug, ...rest] = segments;
  const work = getWorks(section).find((w) => w.slug === workSlug);
  if (!work) return null;

  const series = loadWork(work, section);
  if (!series.published) return null;
  if (rest.length === 0) return { work: series, node: null };

  const nodePath = rest.join('/');
  const node =
    flattenAll(series.hierarchy).find((n) => n.path === nodePath) ?? null;
  if (!node) return null;
  return { work: series, node };
}

/** All static-generation paths for a section: overviews, containers, and leaves. */
export function getAllTreePaths(section: string): string[][] {
  const paths: string[][] = [];
  try {
    for (const work of getWorks(section)) {
      const series = loadWork(work, section);
      if (!series.published) continue;
      paths.push([series.slug]);
      for (const node of flattenAll(series.hierarchy)) {
        if (node.published) paths.push([series.slug, ...node.path.split('/')]);
      }
    }
  } catch (error) {
    console.error(`[tree] error collecting paths for "${section}":`, error);
    return [];
  }
  return paths;
}

/** Previous / next leaf for a content page (reading order across the work). */
export function getTreePartNavigation(
  work: SeriesMetadata,
  currentPath: string
): { previous: ContentNode | null; next: ContentNode | null } {
  const parts = work.allParts.filter((p) => p.published);
  const index = parts.findIndex((p) => p.path === currentPath);
  return {
    previous: index > 0 ? parts[index - 1] : null,
    next: index >= 0 && index < parts.length - 1 ? parts[index + 1] : null
  };
}

/** Container ancestors of a node (work root excluded), nearest-last. */
export function getTreeAncestors(
  work: SeriesMetadata,
  node: ContentNode
): ContentNode[] {
  if (!node.path) return [];
  const segs = node.path.split('/');
  const all = flattenAll(work.hierarchy);
  const ancestors: ContentNode[] = [];
  for (let i = 1; i < segs.length; i++) {
    const ancestorPath = segs.slice(0, i).join('/');
    const match = all.find((n) => n.path === ancestorPath && n.isDirectory);
    if (match) ancestors.push(match);
  }
  return ancestors;
}
