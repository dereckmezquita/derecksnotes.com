// ============================================================================
// Recursive tree content engine (courses)
// ============================================================================
//
// Reads the built output tree at ROOT_DIR_CONTENT_DIST/<section> and exposes it
// as a forest of uniform nodes. There is ONE concept: a node. A folder is a
// container; a file is a leaf. A folder describes itself with an optional
// `index.mdx` whose frontmatter is the same shape as a leaf's. This single
// recursion replaces the old series / chapter / part special-casing.
//
// Design notes:
//   - Order prefixes ("01-") are a sort key only; they are stripped to form the
//     slug, so they never appear in a URL.
//   - `transparent: true` on a container's index removes it from the URL at ANY
//     depth (its children promote up) — replaces the old _passthrough marker.
//   - displayTitle = a positional dotted number + the node's OWN title. No node
//     stores an ancestor's title, so the "every part shows the series title" bug
//     cannot recur.
//   - The output tree never appears in a URL: it is the base path that is
//     stripped before slugs are computed.
//
// Produces the existing SeriesMetadata / ContentNode shapes so ContentPost,
// ContentSideBar, and the content components can be reused. A "work" (the top
// routable unit — a book/volume) maps onto SeriesMetadata.
// ============================================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { DATE_YYYY_MM_DD } from '@/lib/dates';
import { ROOT_DIR_CONTENT_DIST } from '@/lib/constants.server';
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
const IGNORED_DIR_NAMES = new Set(['data', 'assets', 'node_modules']);

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function isIgnored(name: string): boolean {
  return IGNORED_DIR_NAMES.has(name) || name.startsWith('.');
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
  return path.join(ROOT_DIR_CONTENT_DIST, section);
}

interface Inherited {
  published: boolean;
  author?: string;
  date?: string;
  tags?: string[];
  coverImage?: string | number;
  comments?: boolean;
}

// ----------------------------------------------------------------------------
// Tree construction
// ----------------------------------------------------------------------------

/**
 * Build the children of `dir` as ContentNodes. `parentPath` is the URL path
 * (slugs joined) of the containing node, relative to its work root.
 */
function buildChildren(
  dir: string,
  parentPath: string,
  inherited: Inherited,
  depth: number
): ContentNode[] {
  const entries = fs
    .readdirSync(dir)
    .filter((name) => !isIgnored(name) && name !== INDEX_FILENAME);
  const nodes: ContentNode[] = [];

  for (const name of sortByPrefix(entries)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);

    if (stat.isDirectory()) {
      const idx = readDoc(path.join(abs, INDEX_FILENAME));
      const fm = idx?.data ?? {};
      const slug = stripOrderPrefix(name);
      const published = fm.published ?? inherited.published;
      const childInherited: Inherited = {
        published,
        author: fm.author ?? inherited.author,
        date: fm.date ?? inherited.date,
        tags: fm.tags ?? inherited.tags,
        coverImage: fm.coverImage ?? inherited.coverImage,
        comments: fm.comments ?? inherited.comments
      };

      // Transparent container: contributes no URL segment; promote its children
      // to this level (their paths skip this folder entirely).
      if (fm.transparent) {
        nodes.push(...buildChildren(abs, parentPath, childInherited, depth));
        continue;
      }

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
        isDirectory: true,
        hasPage: true,
        children: buildChildren(abs, nodePath, childInherited, depth + 1),
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

// ----------------------------------------------------------------------------
// Works (top routable units): descend through transparent containers
// ----------------------------------------------------------------------------

interface WorkEntry {
  dir: string;
  slug: string;
  doc: { data: any; content: string } | null;
  isLeaf: boolean;
}

function collectWorks(dir: string, acc: WorkEntry[]): void {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (isIgnored(name) || name === INDEX_FILENAME) continue;
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      const idx = readDoc(path.join(abs, INDEX_FILENAME));
      if (idx?.data?.transparent) {
        collectWorks(abs, acc); // promote through organisational folders
        continue;
      }
      acc.push({
        dir: abs,
        slug: stripOrderPrefix(name),
        doc: idx,
        isLeaf: false
      });
    } else if (name.endsWith('.mdx')) {
      acc.push({
        dir: abs,
        slug: stripOrderPrefix(path.basename(name, '.mdx')),
        doc: readDoc(abs),
        isLeaf: true
      });
    }
  }
}

function getWorks(section: string): WorkEntry[] {
  const acc: WorkEntry[] = [];
  collectWorks(sectionRoot(section), acc);
  return acc;
}

function leafNodeForWork(entry: WorkEntry, work: SeriesMetadata): ContentNode {
  return {
    slug: entry.slug,
    path: '',
    absolutePath: entry.dir,
    title: work.title,
    displayTitle: work.title,
    depth: 0,
    isDirectory: false,
    hasPage: true,
    children: [],
    published: work.published,
    date: work.date,
    tags: work.tags,
    author: work.author,
    comments: work.comments
  };
}

function loadTreeWork(
  entry: WorkEntry,
  section: string
): SeriesMetadata | null {
  const fm = entry.doc?.data ?? {};
  const inherited: Inherited = {
    published: fm.published ?? true,
    author: fm.author,
    date: fm.date,
    tags: fm.tags,
    coverImage: fm.coverImage,
    comments: fm.comments
  };

  let hierarchy: ContentNode[] = [];
  if (!entry.isLeaf) {
    hierarchy = buildChildren(entry.dir, '', inherited, 1);
    assignNumbers(hierarchy, '');
  }
  const allParts = flattenLeaves(hierarchy);

  const summaryText = entry.doc
    ? extractSummaryFromMdx(entry.doc.content)
    : undefined;
  const date = fm.date ?? allParts.find((p) => p.date)?.date;

  return {
    slug: entry.slug,
    title: fm.title || humanize(entry.slug),
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
    path: `${section}/${entry.slug}`,
    absolutePath: entry.dir,
    labels: {},
    prefaceContent: entry.doc?.content,
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
    for (const entry of getWorks(section)) {
      const work = loadTreeWork(entry, section);
      if (!work || !work.published) continue;
      cards.push({
        slug: work.slug,
        title: work.title,
        blurb: work.blurb,
        summary: work.summary || work.blurb,
        coverImage: work.coverImage,
        author: work.author,
        date: work.date,
        tags: work.tags,
        published: work.published,
        section,
        path: work.path,
        isSeries: !entry.isLeaf
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
  const entry = getWorks(section).find((w) => w.slug === workSlug);
  if (!entry) return null;
  const work = loadTreeWork(entry, section);
  if (!work) return null;

  if (rest.length === 0) {
    return { work, node: entry.isLeaf ? leafNodeForWork(entry, work) : null };
  }

  const nodePath = rest.join('/');
  const node =
    flattenAll(work.hierarchy).find((n) => n.path === nodePath) ?? null;
  if (!node) return null;
  return { work, node };
}

/** All static-generation paths for a section: overviews, containers, and leaves. */
export function getAllTreePaths(section: string): string[][] {
  const paths: string[][] = [];
  try {
    for (const entry of getWorks(section)) {
      const work = loadTreeWork(entry, section);
      if (!work || !work.published) continue;
      paths.push([work.slug]);
      if (entry.isLeaf) continue;
      for (const node of flattenAll(work.hierarchy)) {
        if (node.published) paths.push([work.slug, ...node.path.split('/')]);
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
