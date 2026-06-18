import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { sqlite } from '@db/index';
import { db, schema } from '@db/index';
import { config } from '@lib/env';
import { isNull, desc, sql } from 'drizzle-orm';
import type { SearchResult, SearchResponse } from '@derecksnotes/shared';

const IGNORED_DIRS = [
  'drafts',
  'deprecated',
  'ignore',
  'src',
  'data',
  'node_modules',
  '.git'
];
const SECTIONS = ['blog', 'courses', 'references'];

let indexed = false;

// ============================================================================
// MDX Text Extraction
// ============================================================================

export function mdxToPlainText(content: string): string {
  return content
    .replace(/^import\s+.*$/gm, '') // import statements
    .replace(/^export\s+.*$/gm, '') // export statements
    .replace(/<[^>]+\/>/g, '') // self-closing JSX tags
    .replace(/<[^>]+>([\s\S]*?)<\/[^>]+>/g, '$1') // JSX tags (keep inner text)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images → alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → link text
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code → text
    .replace(/#{1,6}\s+/g, '') // heading markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/>\s+/gm, '') // blockquote markers
    .replace(/[-*+]\s+/gm, '') // list markers
    .replace(/\d+\.\s+/gm, '') // numbered list markers
    .replace(/\[\^[^\]]+\]/g, '') // footnote refs
    .replace(/---+/g, '') // horizontal rules
    .replace(/<[^>]*>/g, '') // any remaining HTML
    .replace(/\n{3,}/g, '\n\n') // collapse newlines
    .trim();
}

function isIgnoredDir(name: string): boolean {
  return (
    IGNORED_DIRS.includes(name) ||
    name.endsWith('.ignore') ||
    name.startsWith('.')
  );
}

// ============================================================================
// Directory Scanning
// ============================================================================

interface IndexEntry {
  slug: string;
  title: string;
  section: string;
  tags: string;
  date: string;
  author: string;
  content: string;
  path: string;
  type: string;
}

function scanDirectory(
  dir: string,
  section: string,
  entries: IndexEntry[]
): void {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (isIgnoredDir(item)) continue;

      // Check for _series.mdx (series directory)
      const manifestPath = path.join(itemPath, '_series.mdx');
      if (fs.existsSync(manifestPath)) {
        scanSeriesDirectory(itemPath, section, item, entries);
      } else {
        // Check for _passthrough marker
        const passthroughPath = path.join(itemPath, '_passthrough');
        if (fs.existsSync(passthroughPath)) {
          scanDirectory(itemPath, section, entries);
        }
      }
    } else if (item.endsWith('.mdx') && !item.startsWith('_')) {
      indexMdxFile(itemPath, section, item.replace('.mdx', ''), entries);
    }
  }
}

function scanSeriesDirectory(
  seriesDir: string,
  section: string,
  seriesSlug: string,
  entries: IndexEntry[]
): void {
  // Index the series manifest itself
  const manifestPath = path.join(seriesDir, '_series.mdx');
  indexMdxFile(
    manifestPath,
    section,
    seriesSlug,
    entries,
    `/${section}/${seriesSlug}`
  );

  // Recursively index all MDX files in the series
  scanSeriesParts(seriesDir, section, seriesSlug, seriesDir, entries);
}

function scanSeriesParts(
  dir: string,
  section: string,
  seriesSlug: string,
  seriesRoot: string,
  entries: IndexEntry[]
): void {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (isIgnoredDir(item)) continue;
      scanSeriesParts(itemPath, section, seriesSlug, seriesRoot, entries);
    } else if (item.endsWith('.mdx') && item !== '_series.mdx') {
      const relativePath = path
        .relative(seriesRoot, itemPath)
        .replace('.mdx', '');
      const urlPath = `/${section}/${seriesSlug}/${relativePath}`;
      indexMdxFile(
        itemPath,
        section,
        `${seriesSlug}/${relativePath}`,
        entries,
        urlPath
      );
    }
  }
}

function indexMdxFile(
  filePath: string,
  section: string,
  slug: string,
  entries: IndexEntry[],
  urlPath?: string
): void {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);

    // Only index explicitly published content
    if (frontmatter.published !== true) return;

    const plainText = mdxToPlainText(content);
    const resolvedPath = urlPath || `/${section}/${slug}`;

    entries.push({
      slug,
      title: frontmatter.title || slug,
      section,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.join(',') : '',
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : '',
      author: frontmatter.author || '',
      content: plainText.substring(0, 50000), // cap at 50k chars per doc
      path: resolvedPath,
      type: 'post'
    });
  } catch (err) {
    console.warn(`Failed to index ${filePath}:`, err);
  }
}

// ============================================================================
// Dictionary Scanning
// ============================================================================

function scanDictionaryDefinitions(
  dir: string,
  subject: string,
  entries: IndexEntry[]
): void {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  for (const file of files) {
    try {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(raw);

      if (frontmatter.published !== true) continue;

      const plainText = mdxToPlainText(content);
      const slug = file.replace('.mdx', '');

      // Parse display name from <a id="...">Display Name</a> in body
      const anchorMatch = content.match(
        /<a\s+id=["']([^"']+)["'][^>]*>([^<]+)<\/a>/
      );
      const displayName = anchorMatch?.[2]?.trim() || frontmatter.word || slug;

      entries.push({
        slug,
        title: displayName,
        section: `dictionary-${subject}`,
        tags: [subject, frontmatter.category || ''].filter(Boolean).join(','),
        date: '',
        author: frontmatter.dataSource || '',
        content: plainText.substring(0, 10000),
        path: `/dictionaries/${subject}/${slug}`,
        type: 'post'
      });
    } catch {
      // skip
    }
  }
}

// ============================================================================
// Index Building
// ============================================================================

export function buildSearchIndex(): void {
  const start = Date.now();
  console.log('Building search index...');

  // Drop and recreate FTS5 table
  sqlite.exec('DROP TABLE IF EXISTS search_index');
  sqlite.exec(`
        CREATE VIRTUAL TABLE search_index USING fts5(
            slug, title, section, tags, date, author, content, path, type,
            tokenize='unicode61 remove_diacritics 2'
        )
    `);

  const entries: IndexEntry[] = [];

  // Scan MDX content (blog, courses, references)
  for (const section of SECTIONS) {
    const postsDir = path.join(config.contentDir, section, 'posts');
    scanDirectory(postsDir, section, entries);
  }

  // Scan dictionary definitions
  const DICT_SUBJECTS = ['biology', 'chemistry', 'mathematics'];
  for (const subject of DICT_SUBJECTS) {
    const defsDir = path.join(
      config.contentDir,
      'dictionaries',
      subject,
      'definitions'
    );
    scanDictionaryDefinitions(defsDir, subject, entries);
  }

  // Also index comments from the database
  indexComments(entries);

  // Batch insert
  const insert = sqlite.prepare(
    'INSERT INTO search_index (slug, title, section, tags, date, author, content, path, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const insertAll = sqlite.transaction((rows: IndexEntry[]) => {
    for (const row of rows) {
      // Ensure all values are strings — SQLite FTS5 only accepts text
      const values = [
        String(row.slug ?? ''),
        String(row.title ?? ''),
        String(row.section ?? ''),
        String(row.tags ?? ''),
        String(row.date ?? ''),
        String(row.author ?? ''),
        String(row.content ?? ''),
        String(row.path ?? ''),
        String(row.type ?? 'post')
      ];
      insert.run(...values);
    }
  });

  insertAll(entries);

  indexed = true;
  const duration = Date.now() - start;
  console.log(
    `Search index built: ${entries.length} documents indexed in ${duration}ms`
  );
}

function indexComments(entries: IndexEntry[]): void {
  try {
    const comments = sqlite
      .prepare(
        `
            SELECT c.id, c.content, c.created_at, u.username, u.display_name, p.slug, p.title
            FROM comments c
            JOIN users u ON c.user_id = u.id
            JOIN posts p ON c.post_id = p.id
            WHERE c.approved = 1 AND c.deleted_at IS NULL
        `
      )
      .all() as Array<{
      id: string;
      content: string;
      created_at: string;
      username: string;
      display_name: string | null;
      slug: string;
      title: string;
    }>;

    for (const c of comments) {
      entries.push({
        slug: c.id,
        title: `Comment on "${c.title}"`,
        section: 'comments',
        tags: '',
        date: c.created_at,
        author: c.display_name || c.username,
        content: c.content,
        path: `/${c.slug}`,
        type: 'comment'
      });
    }
  } catch {
    // Comments table may not exist yet on first boot
  }
}

// ============================================================================
// Search Query
// ============================================================================

export function isIndexReady(): boolean {
  return indexed;
}

export function searchContent(
  query: string,
  limit: number = 10
): SearchResponse {
  const start = Date.now();

  if (!indexed) {
    return { results: [], query, total: 0, durationMs: 0 };
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], query, total: 0, durationMs: 0 };
  }

  let results: SearchResult[] = [];

  // First try: FTS5 prefix match
  try {
    const ftsQuery = trimmed
      .split(/\s+/)
      .map((word) => `"${word.replace(/"/g, '')}"*`)
      .join(' ');

    const rows = sqlite
      .prepare(
        `
            SELECT slug, title, section, tags, date, author, path, type,
                   snippet(search_index, 6, '<mark>', '</mark>', '...', 40) as snippet,
                   bm25(search_index) as score
            FROM search_index
            WHERE search_index MATCH ?
            ORDER BY bm25(search_index)
            LIMIT ?
        `
      )
      .all(ftsQuery, limit) as Array<{
      slug: string;
      title: string;
      section: string;
      tags: string;
      date: string;
      author: string;
      path: string;
      type: string;
      snippet: string;
      score: number;
    }>;

    results = rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      section: r.section,
      tags: r.tags ? r.tags.split(',').filter(Boolean) : [],
      date: r.date,
      author: r.author,
      snippet: r.snippet,
      path: r.path,
      score: Math.abs(r.score),
      type: r.type as 'post' | 'comment'
    }));
  } catch {
    // FTS5 query syntax error — fall through to LIKE
  }

  // Fallback: LIKE search if FTS5 returned nothing
  if (results.length === 0) {
    try {
      const likePattern = `%${trimmed}%`;
      const rows = sqlite
        .prepare(
          `
                SELECT slug, title, section, tags, date, author, path, type, content
                FROM search_index
                WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
                LIMIT ?
            `
        )
        .all(likePattern, likePattern, likePattern, limit) as Array<{
        slug: string;
        title: string;
        section: string;
        tags: string;
        date: string;
        author: string;
        path: string;
        type: string;
        content: string;
      }>;

      results = rows.map((r) => {
        // Generate a simple snippet
        const idx = r.content.toLowerCase().indexOf(trimmed.toLowerCase());
        let snippet = '';
        if (idx >= 0) {
          const start = Math.max(0, idx - 60);
          const end = Math.min(r.content.length, idx + trimmed.length + 60);
          snippet =
            (start > 0 ? '...' : '') +
            r.content.substring(start, idx) +
            '<mark>' +
            r.content.substring(idx, idx + trimmed.length) +
            '</mark>' +
            r.content.substring(idx + trimmed.length, end) +
            (end < r.content.length ? '...' : '');
        } else {
          snippet = r.content.substring(0, 120) + '...';
        }

        return {
          slug: r.slug,
          title: r.title,
          section: r.section,
          tags: r.tags ? r.tags.split(',').filter(Boolean) : [],
          date: r.date,
          author: r.author,
          snippet,
          path: r.path,
          score: 0,
          type: r.type as 'post' | 'comment'
        };
      });
    } catch {
      // LIKE failed too
    }
  }

  return {
    results,
    query: trimmed,
    total: results.length,
    durationMs: Date.now() - start
  };
}
