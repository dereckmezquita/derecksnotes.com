import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { sqlite } from '@db/index';
import { db, schema } from '@db/index';
import { config } from '@lib/env';
import { eq, and, isNull, inArray, sql } from 'drizzle-orm';
import { mdxToPlainText } from '@services/search';
import natural from 'natural';

// ============================================================================
// Types
// ============================================================================

interface GraphNode {
  id: string;
  path: string;
  title: string;
  section: string;
  category: string | null;
  tags: string | null;
  date: string | null;
  author: string | null;
  snippet: string | null;
  nodeType: string;
  parentId: string | null;
  depth: number;
  metadata: string | null;
}

interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: string;
  weight: number;
  metadata: string | null;
}

export interface GraphQueryOptions {
  sections?: string[];
  depth?: number;
  minEdges?: number;
  edgeTypes?: string[];
  showDictInternal?: boolean;
  showComments?: boolean;
  showExternal?: boolean;
  search?: string;
  limit?: number;
}

// ============================================================================
// Constants
// ============================================================================

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
const DICT_SUBJECTS = ['biology', 'chemistry', 'mathematics'];

// NLP tools from natural library
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const stopwords = new Set(natural.stopwords);
// Additional code/web stop words not in natural's list
const CODE_STOP_WORDS = new Set([
  'http',
  'https',
  'www',
  'com',
  'org',
  'html',
  'css',
  'const',
  'let',
  'var',
  'function',
  'return',
  'import',
  'export',
  'default',
  'true',
  'false',
  'null',
  'undefined',
  'class',
  'type',
  'interface',
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'void',
  'async',
  'await',
  'console',
  'log',
  'error',
  'fig',
  'figure',
  'image',
  'img',
  'src',
  'alt',
  'href',
  'ref',
  'div',
  'span',
  'pre',
  'code',
  'example'
]);

// ============================================================================
// Helpers
// ============================================================================

let graphBuilt = false;

function isIgnoredDir(name: string): boolean {
  return (
    IGNORED_DIRS.includes(name) ||
    name.endsWith('.ignore') ||
    name.startsWith('.')
  );
}

function contentHash(content: string): string {
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(content);
  return hasher.digest('hex');
}

function now(): string {
  return new Date().toISOString();
}

// ============================================================================
// Key Term Extraction (Simple NLP)
// ============================================================================

function extractKeyTerms(text: string): Map<string, number> {
  const terms = new Map<string, number>();

  // Use natural's tokenizer
  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];

  // Filter stop words (natural's + our code stop words) and short tokens
  const filtered = tokens.filter(
    (t) => t.length > 2 && !stopwords.has(t) && !CODE_STOP_WORDS.has(t)
  );

  // Count single-word frequencies
  const wordFreq = new Map<string, number>();
  for (const token of filtered) {
    wordFreq.set(token, (wordFreq.get(token) || 0) + 1);
  }

  // Add single words with frequency >= 2
  for (const [word, freq] of wordFreq) {
    if (freq >= 2 && word.length > 3) {
      terms.set(word, freq);
    }
  }

  // Use natural's NGrams for bigrams and trigrams
  const bigrams = natural.NGrams.bigrams(filtered);
  for (const bg of bigrams) {
    const key = bg.join(' ');
    if (key.length > 6) {
      terms.set(key, (terms.get(key) || 0) + 1);
    }
  }

  const trigrams = natural.NGrams.trigrams(filtered);
  for (const tg of trigrams) {
    const key = tg.join(' ');
    if (key.length > 10) {
      terms.set(key, (terms.get(key) || 0) + 1);
    }
  }

  // Filter: only terms appearing 2+ times
  for (const [term, freq] of terms) {
    if (freq < 2) terms.delete(term);
  }

  return terms;
}

// ============================================================================
// Link Extraction
// ============================================================================

interface ExtractedLink {
  text: string;
  href: string;
  isInternal: boolean;
}

function extractLinks(content: string): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1] ?? '';
    const href = match[2] ?? '';

    // Skip image links
    if (match[0]?.startsWith('![')) continue;
    // Skip anchor-only links or empty
    if (!href || href.startsWith('#')) continue;

    const isInternal =
      href.startsWith('/') || href.startsWith('./') || href.startsWith('../');

    links.push({ text, href, isInternal });
  }

  return links;
}

// ============================================================================
// Heading Extraction
// ============================================================================

interface ExtractedHeading {
  level: number;
  text: string;
  anchor: string;
}

function extractHeadings(content: string): ExtractedHeading[] {
  const headings: ExtractedHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length ?? 2;
    const text = (match[2] ?? '').replace(/[*_`]/g, '').trim();
    const anchor = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level, text, anchor });
  }

  return headings;
}

// ============================================================================
// File Scanning
// ============================================================================

interface FileEntry {
  filePath: string;
  section: string;
  slug: string;
  urlPath: string;
}

function collectMdxFiles(): FileEntry[] {
  const entries: FileEntry[] = [];

  // Blog, references, courses
  for (const section of SECTIONS) {
    const postsDir = path.join(config.contentDir, section, 'posts');
    scanDirForFiles(postsDir, section, section, entries);
  }

  // Dictionaries
  for (const subject of DICT_SUBJECTS) {
    const defsDir = path.join(
      config.contentDir,
      'dictionaries',
      subject,
      'definitions'
    );
    if (!fs.existsSync(defsDir)) continue;

    const files = fs.readdirSync(defsDir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace('.mdx', '');
      entries.push({
        filePath: path.join(defsDir, file),
        section: `dictionary-${subject}`,
        slug,
        urlPath: `/dictionaries/${subject}/${slug}`
      });
    }
  }

  return entries;
}

function scanDirForFiles(
  dir: string,
  section: string,
  basePath: string,
  entries: FileEntry[]
): void {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (isIgnoredDir(item)) continue;
      scanDirForFiles(itemPath, section, basePath, entries);
    } else if (item.endsWith('.mdx') && !item.startsWith('_')) {
      const slug = item.replace('.mdx', '');
      // Build URL path relative to section
      const relDir = path.relative(
        path.join(config.contentDir, section, 'posts'),
        dir
      );
      const urlPath =
        relDir && relDir !== '.'
          ? `/${section}/${relDir}/${slug}`
          : `/${section}/${slug}`;

      entries.push({ filePath: itemPath, section, slug, urlPath });
    }
  }
}

// ============================================================================
// TF-IDF Computation
// ============================================================================

function computeTfIdf(documents: Map<string, Map<string, number>>): {
  tfidfInstance: natural.TfIdf;
  nodeIds: string[];
} {
  const tfidf = new natural.TfIdf();
  const nodeIds: string[] = [];

  for (const [nodeId, termFreqs] of documents) {
    // Reconstruct the document text from term frequencies
    const docTokens: string[] = [];
    for (const [term, freq] of termFreqs) {
      for (let i = 0; i < freq; i++) {
        docTokens.push(term);
      }
    }
    tfidf.addDocument(docTokens.join(' '));
    nodeIds.push(nodeId);
  }

  return { tfidfInstance: tfidf, nodeIds };
}

// ============================================================================
// Build Graph Index
// ============================================================================

export function buildGraphIndex(): void {
  const start = Date.now();
  console.log('Building graph index...');

  const timestamp = now();

  // Clear existing graph tables (full rebuild)
  sqlite.exec('DELETE FROM graph_key_terms');
  sqlite.exec('DELETE FROM graph_edges');
  sqlite.exec('DELETE FROM graph_nodes');

  const files = collectMdxFiles();

  // Track all nodes and their term frequencies for TF-IDF
  const pageTermDocs = new Map<string, Map<string, number>>();
  // Map path -> nodeId for linking
  const pathToNodeId = new Map<string, string>();
  // Deferred internal links: resolved after all files processed
  const pendingInternalLinks: Array<{
    sourceId: string;
    targetPath: string;
    linkText: string;
  }> = [];

  let nodeCount = 0;
  let edgeCount = 0;

  // Prepared statements for batch inserts (OR IGNORE to handle duplicates gracefully)
  const insertNode = sqlite.prepare(`
    INSERT OR IGNORE INTO graph_nodes (id, path, title, section, category, tags, date, author, snippet, node_type, parent_id, depth, metadata, content_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEdge = sqlite.prepare(`
    INSERT OR IGNORE INTO graph_edges (id, source_id, target_id, edge_type, weight, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertKeyTerm = sqlite.prepare(`
    INSERT OR IGNORE INTO graph_key_terms (id, node_id, term, frequency, tfidf)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Process each file in its own transaction so one failure doesn't roll back all files
  const processOneFile = sqlite.transaction((file: FileEntry) => {
    const raw = fs.readFileSync(file.filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);

    // Only index published content
    if (frontmatter.published !== true) return;

    const plainText = mdxToPlainText(content);
    const hash = contentHash(raw);
    const pageId = crypto.randomUUID();

    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags.join(',')
      : '';
    const snippet = plainText.substring(0, 200);
    const dateStr = frontmatter.date
      ? new Date(frontmatter.date).toISOString()
      : null;

    // Check for duplicate path — skip if already indexed
    const existingNode = sqlite
      .prepare('SELECT id FROM graph_nodes WHERE path = ?')
      .get(file.urlPath) as { id: string } | null;

    if (existingNode) {
      // Already indexed, skip this file
      pathToNodeId.set(file.urlPath, existingNode.id);
      return;
    }

    // Create page node (depth 0)
    insertNode.run(
      pageId,
      file.urlPath,
      frontmatter.title || file.slug,
      file.section,
      frontmatter.category || null,
      tags || null,
      dateStr,
      frontmatter.author || null,
      snippet,
      'page',
      null,
      0,
      null,
      hash,
      timestamp,
      timestamp
    );
    nodeCount++;
    pathToNodeId.set(file.urlPath, pageId);

    // Extract headings -> heading nodes (depth 1)
    const headings = extractHeadings(content);
    for (const heading of headings) {
      const headingId = crypto.randomUUID();
      const headingPath = `${file.urlPath}#${heading.anchor}`;

      insertNode.run(
        headingId,
        headingPath,
        heading.text,
        file.section,
        null,
        null,
        null,
        null,
        null,
        'heading',
        pageId,
        1,
        JSON.stringify({ level: heading.level }),
        null,
        timestamp,
        timestamp
      );
      nodeCount++;

      // Edge: page -> heading
      insertEdge.run(
        crypto.randomUUID(),
        pageId,
        headingId,
        'explicit-link',
        50,
        null,
        timestamp
      );
      edgeCount++;
    }

    // Extract key terms
    const terms = extractKeyTerms(plainText);
    pageTermDocs.set(pageId, terms);

    // Create key-term nodes (depth 2) for top terms
    const sortedTerms = [...terms.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30); // limit to top 30 terms per page

    for (const [term, freq] of sortedTerms) {
      const termId = crypto.randomUUID();
      const termPath = `${file.urlPath}#term:${term.replace(/\s+/g, '-')}`;

      insertNode.run(
        termId,
        termPath,
        term,
        file.section,
        null,
        null,
        null,
        null,
        null,
        'key-term',
        pageId,
        2,
        JSON.stringify({ frequency: freq }),
        null,
        timestamp,
        timestamp
      );
      nodeCount++;

      insertKeyTerm.run(
        crypto.randomUUID(),
        termId,
        term,
        freq,
        null // TF-IDF computed later
      );

      // Edge: page -> key-term
      insertEdge.run(
        crypto.randomUUID(),
        pageId,
        termId,
        'explicit-link',
        Math.min(freq * 10, 100),
        null,
        timestamp
      );
      edgeCount++;
    }

    // Extract internal links -> edges
    const links = extractLinks(content);
    for (const link of links) {
      if (link.isInternal) {
        // Defer internal links — target node may not exist yet
        const normPath = link.href.split('#')[0]?.split('?')[0] ?? '';
        pendingInternalLinks.push({
          sourceId: pageId,
          targetPath: normPath,
          linkText: link.text
        });
      } else {
        // External link -> create external-link node + edge
        const extId = crypto.randomUUID();
        const extPath = `__external:${link.href}`;

        // Check if we already have this external link node
        // Use a simple path-based dedup via pathToNodeId
        let existingExtId = pathToNodeId.get(extPath);
        if (!existingExtId) {
          insertNode.run(
            extId,
            extPath,
            link.text || link.href,
            'external',
            null,
            null,
            null,
            null,
            null,
            'external-link',
            null,
            0,
            JSON.stringify({ url: link.href }),
            null,
            timestamp,
            timestamp
          );
          nodeCount++;
          pathToNodeId.set(extPath, extId);
          existingExtId = extId;
        }

        insertEdge.run(
          crypto.randomUUID(),
          pageId,
          existingExtId,
          'external-link',
          10,
          null,
          timestamp
        );
        edgeCount++;
      }
    }
  });

  for (const file of files) {
    try {
      processOneFile(file);
    } catch (e: any) {
      console.warn(
        `Skipped ${path.basename(file.filePath)}: ${e.message?.split('\n')[0]}`
      );
    }
  }

  // Resolve unresolved internal link edges
  // Resolve deferred internal links now that all nodes exist
  // First, get the set of existing node IDs to filter out rolled-back sources
  const existingIds = new Set(
    (
      sqlite.prepare('SELECT id FROM graph_nodes').all() as Array<{
        id: string;
      }>
    ).map((r) => r.id)
  );

  console.log(`Resolving ${pendingInternalLinks.length} internal links...`);
  let resolvedCount = 0;
  const resolveLinks = sqlite.transaction(() => {
    for (const link of pendingInternalLinks) {
      if (!existingIds.has(link.sourceId)) continue; // source was rolled back
      const targetNodeId = pathToNodeId.get(link.targetPath);
      if (
        targetNodeId &&
        existingIds.has(targetNodeId) &&
        link.sourceId !== targetNodeId
      ) {
        insertEdge.run(
          crypto.randomUUID(),
          link.sourceId,
          targetNodeId,
          'explicit-link',
          30,
          JSON.stringify({ linkText: link.linkText }),
          timestamp
        );
        edgeCount++;
        resolvedCount++;
      }
    }
  });
  resolveLinks();
  console.log(`  Resolved ${resolvedCount} internal link edges`);

  // Compute TF-IDF vectors
  console.log('Computing TF-IDF vectors...');
  // Filter out nodeIds that were rolled back (skipped files)
  for (const nodeId of pageTermDocs.keys()) {
    if (!existingIds.has(nodeId)) {
      pageTermDocs.delete(nodeId);
    }
  }

  const tfidfResult = computeTfIdf(pageTermDocs);

  // Compute similarity edges
  console.log('Computing similarity edges...');
  computeSimilarityEdges(tfidfResult, 0.15, timestamp);

  // Compute tag-similarity edges
  console.log('Computing tag similarity edges...');
  computeTagSimilarityEdges(timestamp);

  // Merge social data
  console.log('Merging social data...');
  mergeSocialData(timestamp);

  const duration = Date.now() - start;
  graphBuilt = true;

  // Count final totals
  const finalNodes = sqlite
    .prepare('SELECT count(*) as c FROM graph_nodes')
    .get() as { c: number };
  const finalEdges = sqlite
    .prepare('SELECT count(*) as c FROM graph_edges')
    .get() as { c: number };

  console.log(
    `Graph index built: ${finalNodes.c} nodes, ${finalEdges.c} edges in ${duration}ms`
  );
}

// ============================================================================
// Similarity Edges
// ============================================================================

function computeSimilarityEdges(
  tfidfResult: { tfidfInstance: natural.TfIdf; nodeIds: string[] },
  threshold: number,
  timestamp: string
): void {
  const { tfidfInstance, nodeIds } = tfidfResult;
  const N = nodeIds.length;
  if (N < 2) return;

  // Build term vectors from natural's TfIdf
  // Collect all unique terms
  const allTerms = new Set<string>();
  for (let i = 0; i < N; i++) {
    tfidfInstance.listTerms(i).forEach((item: { term: string }) => {
      allTerms.add(item.term);
    });
  }
  const termList = Array.from(allTerms);

  // Build normalised vectors
  const vectors: number[][] = [];
  for (let i = 0; i < N; i++) {
    const vec = termList.map((term) => tfidfInstance.tfidf(term, i));
    const mag = Math.sqrt(vec.reduce((sum, x) => sum + x * x, 0));
    vectors.push(mag > 0 ? vec.map((x) => x / mag) : vec);
  }

  // Compute cosine similarity for all pairs
  const insertEdge = sqlite.prepare(
    `INSERT OR IGNORE INTO graph_edges (id, source_id, target_id, edge_type, weight, metadata, created_at)
     VALUES (?, ?, ?, 'nlp-similarity', ?, NULL, ?)`
  );

  const insertAll = sqlite.transaction(() => {
    let edgeCount = 0;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        let dot = 0;
        for (let k = 0; k < termList.length; k++) {
          dot += (vectors[i]![k] ?? 0) * (vectors[j]![k] ?? 0);
        }
        if (dot > threshold) {
          insertEdge.run(
            crypto.randomUUID(),
            nodeIds[i]!,
            nodeIds[j]!,
            Math.round(dot * 100),
            timestamp
          );
          edgeCount++;
        }
      }
    }
    console.log(
      `  NLP similarity: ${edgeCount} edges (threshold ${threshold})`
    );
  });

  insertAll();
}

// ============================================================================
// Tag Similarity Edges
// ============================================================================

function computeTagSimilarityEdges(timestamp: string): void {
  // Get all page nodes with tags
  const pages = sqlite
    .prepare(
      `SELECT id, tags FROM graph_nodes WHERE node_type = 'page' AND tags IS NOT NULL AND tags != ''`
    )
    .all() as Array<{ id: string; tags: string }>;

  const insertEdge = sqlite.prepare(`
    INSERT OR IGNORE INTO graph_edges (id, source_id, target_id, edge_type, weight, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  let tagEdges = 0;

  const insertTagEdges = sqlite.transaction(() => {
    for (let i = 0; i < pages.length; i++) {
      const pageA = pages[i];
      if (!pageA) continue;

      const tagsA = new Set(
        pageA.tags.split(',').map((t) => t.trim().toLowerCase())
      );

      for (let j = i + 1; j < pages.length; j++) {
        const pageB = pages[j];
        if (!pageB) continue;

        const tagsB = new Set(
          pageB.tags.split(',').map((t) => t.trim().toLowerCase())
        );

        const shared = [...tagsA].filter((t) => tagsB.has(t));
        if (shared.length >= 2) {
          insertEdge.run(
            crypto.randomUUID(),
            pageA.id,
            pageB.id,
            'tag-similarity',
            shared.length * 20,
            JSON.stringify({ sharedTags: shared }),
            timestamp
          );
          tagEdges++;
        }
      }
    }
  });

  insertTagEdges();
  console.log(`  Created ${tagEdges} tag similarity edges`);
}

// ============================================================================
// Social Data Merge
// ============================================================================

function mergeSocialData(timestamp: string): void {
  try {
    // Get all post slugs from the posts table
    const postRows = sqlite
      .prepare('SELECT id, slug, title FROM posts')
      .all() as Array<{ id: string; slug: string; title: string }>;

    const updateMeta = sqlite.prepare(
      `UPDATE graph_nodes SET metadata = ? WHERE id = ?`
    );

    const insertNode = sqlite.prepare(`
      INSERT OR IGNORE INTO graph_nodes (id, path, title, section, category, tags, date, author, snippet, node_type, parent_id, depth, metadata, content_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertEdge = sqlite.prepare(`
      INSERT OR IGNORE INTO graph_edges (id, source_id, target_id, edge_type, weight, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let commentNodes = 0;

    const mergeSocial = sqlite.transaction(() => {
      for (const post of postRows) {
        // Find the matching graph node by path containing the slug
        const graphNode = sqlite
          .prepare(
            `SELECT id, path FROM graph_nodes WHERE node_type = 'page' AND path LIKE ?`
          )
          .get(`%/${post.slug}`) as { id: string; path: string } | undefined;

        if (!graphNode) continue;

        // Count reactions
        const likes = sqlite
          .prepare(
            `SELECT count(*) as c FROM post_reactions WHERE post_id = ? AND type = 'like'`
          )
          .get(post.id) as { c: number };
        const dislikes = sqlite
          .prepare(
            `SELECT count(*) as c FROM post_reactions WHERE post_id = ? AND type = 'dislike'`
          )
          .get(post.id) as { c: number };

        // Count comments
        const commentCount = sqlite
          .prepare(
            `SELECT count(*) as c FROM comments WHERE post_id = ? AND approved = 1 AND deleted_at IS NULL`
          )
          .get(post.id) as { c: number };

        // Update metadata on graph node
        const meta = JSON.stringify({
          likes: likes.c,
          dislikes: dislikes.c,
          commentCount: commentCount.c
        });
        updateMeta.run(meta, graphNode.id);

        // Create comment nodes for approved comments
        const comments = sqlite
          .prepare(
            `SELECT c.id, c.content, c.created_at, u.username, u.display_name
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ? AND c.approved = 1 AND c.deleted_at IS NULL`
          )
          .all(post.id) as Array<{
          id: string;
          content: string;
          created_at: string;
          username: string;
          display_name: string | null;
        }>;

        for (const comment of comments) {
          const commentNodeId = crypto.randomUUID();
          const commentPath = `${graphNode.path}#comment:${comment.id}`;
          const author = comment.display_name || comment.username;

          insertNode.run(
            commentNodeId,
            commentPath,
            `Comment by ${author}`,
            'comments',
            null,
            null,
            comment.created_at,
            author,
            comment.content.substring(0, 200),
            'comment',
            graphNode.id,
            1,
            null,
            null,
            timestamp,
            timestamp
          );

          insertEdge.run(
            crypto.randomUUID(),
            graphNode.id,
            commentNodeId,
            'comment-thread',
            20,
            null,
            timestamp
          );
          commentNodes++;
        }
      }
    });

    mergeSocial();
    console.log(`  Merged social data, created ${commentNodes} comment nodes`);
  } catch (err) {
    // Social tables may not exist yet
    console.warn('Social data merge skipped:', err);
  }
}

// ============================================================================
// Query Functions
// ============================================================================

export function isGraphReady(): boolean {
  return graphBuilt;
}

export function getGraphData(options: GraphQueryOptions = {}): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const {
    sections,
    depth = 2,
    minEdges = 0,
    edgeTypes,
    showDictInternal = true,
    showComments = false,
    showExternal = false,
    search,
    limit = 5000
  } = options;

  // Build WHERE clauses for nodes
  const nodeConditions: string[] = [];
  const nodeParams: any[] = [];

  // Filter by depth
  nodeConditions.push('depth <= ?');
  nodeParams.push(depth);

  // Filter sections
  if (sections && sections.length > 0) {
    const placeholders = sections.map(() => '?').join(',');
    nodeConditions.push(`section IN (${placeholders})`);
    nodeParams.push(...sections);
  }

  // Toggle comment nodes
  if (!showComments) {
    nodeConditions.push(`node_type != 'comment'`);
  }

  // Toggle external link nodes
  if (!showExternal) {
    nodeConditions.push(`node_type != 'external-link'`);
  }

  // Toggle dictionary internal refs
  if (!showDictInternal) {
    nodeConditions.push(`section NOT LIKE 'dictionary-%'`);
  }

  // Search filter
  if (search) {
    nodeConditions.push(`(title LIKE ? OR path LIKE ?)`);
    const searchPattern = `%${search}%`;
    nodeParams.push(searchPattern, searchPattern);
  }

  const whereClause =
    nodeConditions.length > 0 ? `WHERE ${nodeConditions.join(' AND ')}` : '';

  // Fetch nodes
  const nodes = sqlite
    .prepare(
      `SELECT id, path, title, section, category, tags, date, author, snippet,
              node_type as nodeType, parent_id as parentId, depth, metadata
       FROM graph_nodes
       ${whereClause}
       LIMIT ?`
    )
    .all(...nodeParams, limit) as GraphNode[];

  const nodeIds = new Set(nodes.map((n) => n.id));

  // Build edge filter
  const edgeConditions: string[] = [];
  const edgeParams: any[] = [];

  if (edgeTypes && edgeTypes.length > 0) {
    const placeholders = edgeTypes.map(() => '?').join(',');
    edgeConditions.push(`edge_type IN (${placeholders})`);
    edgeParams.push(...edgeTypes);
  }

  const edgeWhere =
    edgeConditions.length > 0 ? `WHERE ${edgeConditions.join(' AND ')}` : '';

  const allEdges = sqlite
    .prepare(
      `SELECT id, source_id as sourceId, target_id as targetId,
              edge_type as edgeType, weight, metadata
       FROM graph_edges
       ${edgeWhere}`
    )
    .all(...edgeParams) as GraphEdge[];

  // Filter edges to only include those connecting visible nodes
  const edges = allEdges.filter(
    (e) => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId)
  );

  // Filter by minEdges
  let filteredNodes = nodes;
  if (minEdges > 0) {
    const edgeCounts = new Map<string, number>();
    for (const edge of edges) {
      edgeCounts.set(edge.sourceId, (edgeCounts.get(edge.sourceId) || 0) + 1);
      edgeCounts.set(edge.targetId, (edgeCounts.get(edge.targetId) || 0) + 1);
    }
    filteredNodes = nodes.filter(
      (n) => (edgeCounts.get(n.id) || 0) >= minEdges
    );
    const filteredIds = new Set(filteredNodes.map((n) => n.id));
    return {
      nodes: filteredNodes,
      edges: edges.filter(
        (e) => filteredIds.has(e.sourceId) && filteredIds.has(e.targetId)
      )
    };
  }

  return { nodes, edges };
}

export function getGraphStats(): Record<string, any> {
  const totalNodes = sqlite
    .prepare('SELECT count(*) as c FROM graph_nodes')
    .get() as { c: number };
  const totalEdges = sqlite
    .prepare('SELECT count(*) as c FROM graph_edges')
    .get() as { c: number };

  const nodesByType = sqlite
    .prepare(
      'SELECT node_type as type, count(*) as count FROM graph_nodes GROUP BY node_type'
    )
    .all() as Array<{ type: string; count: number }>;

  const edgesByType = sqlite
    .prepare(
      'SELECT edge_type as type, count(*) as count FROM graph_edges GROUP BY edge_type'
    )
    .all() as Array<{ type: string; count: number }>;

  const nodesBySection = sqlite
    .prepare(
      'SELECT section, count(*) as count FROM graph_nodes GROUP BY section'
    )
    .all() as Array<{ section: string; count: number }>;

  const totalKeyTerms = sqlite
    .prepare('SELECT count(*) as c FROM graph_key_terms')
    .get() as { c: number };

  return {
    totalNodes: totalNodes.c,
    totalEdges: totalEdges.c,
    totalKeyTerms: totalKeyTerms.c,
    nodesByType,
    edgesByType,
    nodesBySection
  };
}
