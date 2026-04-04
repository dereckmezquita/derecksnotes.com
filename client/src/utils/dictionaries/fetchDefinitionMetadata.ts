import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { accessReadFile } from '../accessReadFile';
import { processMdx } from '../mdx/processMdx';

import { config } from '@/lib/env';
import { stripMdx } from '../mdx/extractMdxSummary';
import rehypeLinkToDefinition from '../remark-rehype/rehypeLinkToDefinition';

export interface Definition {
  source: React.ReactNode;
  frontmatter: DefinitionMetadata;
}

export interface DefinitionMetadata {
  slug: string;
  anchorId: string;
  displayName: string;
  letter: string;
  dictionary: string;
  category: string;
  domain?: string;
  etymology?: { lang: string; root: string; meaning: string }[];
  synonyms?: string[];
  links?: string[];
  dataSource?: string;
  published: boolean;
  comments: boolean;
  relatedSlugs?: string[];
  url?: string;
  summary?: string;

  // backwards compat (deprecated)
  word?: string;
  dataSources?: string;
  linksTo?: string[];
  linkedFrom?: string[];
}

/**
 * Parse <a id="anchorId">Display Name</a> from raw MDX body content.
 */
function parseAnchorTag(content: string): {
  anchorId: string;
  displayName: string;
} | null {
  const match = content.match(/<a\s+id=["']([^"']+)["'][^>]*>([^<]+)<\/a>/);
  if (match) {
    return { anchorId: match[1], displayName: match[2].trim() };
  }
  return null;
}

/**
 * Slugify a display name for lookup purposes.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractSingleDefinitionMetadata(
  filepath: string
): DefinitionMetadata | null {
  if (!fs.existsSync(filepath)) {
    console.warn(`Definition file not found: ${filepath}`);
    return null;
  }

  try {
    const { summary, frontmatter } = stripMdx<DefinitionMetadata>(filepath);

    // Read raw file to parse <a id="...">Display Name</a>
    const rawContent = fs.readFileSync(filepath, 'utf-8');
    const { content: body } = matter(rawContent);
    const anchorParsed = parseAnchorTag(body);

    const slug = path.basename(filepath, '.mdx');

    // Determine anchorId and displayName
    let anchorId: string;
    let displayName: string;

    if (anchorParsed) {
      anchorId = anchorParsed.anchorId;
      displayName = anchorParsed.displayName;
    } else {
      // Backwards compat: fall back to frontmatter word
      displayName = frontmatter.word || slug;
      anchorId = slugify(displayName);
    }

    // letter: frontmatter override, else first char of displayName
    const letter = frontmatter.letter || displayName.charAt(0).toLowerCase();

    return {
      slug,
      anchorId,
      displayName,
      letter,
      dictionary: frontmatter.dictionary,
      category: frontmatter.category,
      domain: frontmatter.domain,
      etymology: frontmatter.etymology,
      synonyms: frontmatter.synonyms,
      links: frontmatter.links ?? [],
      dataSource: frontmatter.dataSource ?? frontmatter.dataSources,
      published: frontmatter.published,
      comments: frontmatter.comments,
      summary,

      // backwards compat
      word: frontmatter.word,
      dataSources: frontmatter.dataSources,
      linksTo: frontmatter.linksTo,
      linkedFrom: frontmatter.linkedFrom
    };
  } catch (error: any) {
    console.error(`Error reading file: ${filepath}`, error);
    throw error;
  }
}

/**
 * Build a bidirectional relationship graph for all definitions in a folder.
 * Returns Map<slug, relatedSlugs[]>.
 */
export function buildRelationshipGraph(folder: string): Map<string, string[]> {
  const files = fs.readdirSync(folder).filter((f) => f.endsWith('.mdx'));

  // 1. Extract metadata and body for each file
  const entries: {
    slug: string;
    anchorId: string;
    displayName: string;
    bodyHashLinks: string[];
    frontmatterLinks: string[];
    linksTo: string[];
    linkedFrom: string[];
  }[] = [];

  const displayNameToSlug = new Map<string, string>();
  const anchorIdToSlug = new Map<string, string>();

  for (const file of files) {
    const filepath = path.join(folder, file);
    const slug = path.basename(file, '.mdx');

    try {
      const rawContent = fs.readFileSync(filepath, 'utf-8');
      const { data: fm, content: body } = matter(rawContent);

      const anchorParsed = parseAnchorTag(body);
      const anchorId = anchorParsed?.anchorId ?? slugify(fm.word || slug);
      const displayName = anchorParsed?.displayName ?? fm.word ?? slug;

      // Parse body hash links: [text](#target)
      const hashLinkRegex = /\]\(#([^)]+)\)/g;
      const bodyHashLinks: string[] = [];
      let hashMatch;
      while ((hashMatch = hashLinkRegex.exec(body)) !== null) {
        bodyHashLinks.push(hashMatch[1]);
      }

      // Frontmatter links (display names for hidden relationships)
      const frontmatterLinks: string[] = fm.links ?? [];

      // Old linksTo/linkedFrom for backwards compat
      const linksTo: string[] = fm.linksTo ?? [];
      const linkedFrom: string[] = fm.linkedFrom ?? [];

      displayNameToSlug.set(displayName.toLowerCase(), slug);
      anchorIdToSlug.set(anchorId, slug);

      entries.push({
        slug,
        anchorId,
        displayName,
        bodyHashLinks,
        frontmatterLinks,
        linksTo,
        linkedFrom
      });
    } catch (error) {
      console.error(
        `Error processing ${filepath} for relationship graph`,
        error
      );
    }
  }

  // 2. Build the graph
  const graph = new Map<string, Set<string>>();

  // Initialise empty sets
  for (const entry of entries) {
    if (!graph.has(entry.slug)) {
      graph.set(entry.slug, new Set());
    }
  }

  for (const entry of entries) {
    const outgoing = graph.get(entry.slug)!;

    // Body hash link targets -> match against anchorId->slug map
    for (const target of entry.bodyHashLinks) {
      const targetSlug = anchorIdToSlug.get(target);
      if (targetSlug && targetSlug !== entry.slug) {
        outgoing.add(targetSlug);
      }
    }

    // Frontmatter links (display names) -> slugify and match
    for (const linkName of entry.frontmatterLinks) {
      const targetSlug = displayNameToSlug.get(linkName.toLowerCase());
      if (targetSlug && targetSlug !== entry.slug) {
        outgoing.add(targetSlug);
      }
    }

    // Backwards compat: linksTo (these are word names)
    for (const word of entry.linksTo) {
      const targetSlug = displayNameToSlug.get(word.toLowerCase());
      if (targetSlug && targetSlug !== entry.slug) {
        outgoing.add(targetSlug);
      }
    }

    // Backwards compat: linkedFrom (these are word names)
    for (const word of entry.linkedFrom) {
      const targetSlug = displayNameToSlug.get(word.toLowerCase());
      if (targetSlug && targetSlug !== entry.slug) {
        outgoing.add(targetSlug);
      }
    }
  }

  // 3. Compute reverse links: if A->B then B->A
  const reverseGraph = new Map<string, Set<string>>();
  for (const entry of entries) {
    reverseGraph.set(entry.slug, new Set());
  }

  for (const [slug, targets] of graph.entries()) {
    for (const target of targets) {
      reverseGraph.get(target)?.add(slug);
    }
  }

  // 4. Merge forward + reverse into final result
  const result = new Map<string, string[]>();
  for (const entry of entries) {
    const forward = graph.get(entry.slug) ?? new Set<string>();
    const reverse = reverseGraph.get(entry.slug) ?? new Set<string>();
    const merged = new Set([...forward, ...reverse]);
    result.set(entry.slug, Array.from(merged));
  }

  return result;
}

/**
 * Fetch only the DefinitionMetadata entries in `folder` that are *related* to `currentSlug`.
 * Uses the relationship graph for bidirectional link resolution.
 */
export function fetchDefintionsMetadata(
  folder: string,
  currentSlug: string
): DefinitionMetadata[] {
  const graph = buildRelationshipGraph(folder);
  const relatedSlugs = new Set(graph.get(currentSlug) ?? []);

  // Read all .mdx files in the given folder
  const files: string[] = fs.readdirSync(folder);
  const mdxFiles: string[] = files.filter((file) => file.endsWith('.mdx'));

  // Extract metadata from each .mdx (filter out nulls from missing files)
  let definitions: DefinitionMetadata[] = mdxFiles
    .map((file) => extractSingleDefinitionMetadata(path.join(folder, file)))
    .filter((def): def is DefinitionMetadata => def !== null);

  // Filter published definitions that are related to the current slug
  definitions = definitions.filter((def) => {
    if (!def.published) return false;
    return relatedSlugs.has(def.slug);
  });

  // Sort results by letter
  return definitions.sort((a, b) => {
    const letterA = a.letter.toLowerCase();
    const letterB = b.letter.toLowerCase();

    const isLetterA = /^[a-z]$/.test(letterA);
    const isLetterB = /^[a-z]$/.test(letterB);

    if (isLetterA && isLetterB) {
      return letterA.localeCompare(letterB);
    } else if (isLetterA) {
      return -1;
    } else if (isLetterB) {
      return 1;
    } else {
      return letterA.localeCompare(letterB);
    }
  });
}

function extractDictionaryFromPath(dir: string): string {
  const parts = dir.split(path.sep);
  const dictionariesIndex = parts.indexOf('dictionaries');

  if (dictionariesIndex !== -1 && dictionariesIndex + 1 < parts.length) {
    return parts[dictionariesIndex + 1];
  } else {
    throw new Error("Invalid path or 'dictionaries' not found in the path");
  }
}

export async function fetchAllDefintions(dir: string): Promise<Definition[]> {
  const graph = buildRelationshipGraph(dir);
  const filePaths: string[] = fs.readdirSync(dir);

  const definitions: Definition[] = await Promise.all(
    filePaths
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const currPath = path.join(dir, filename);
        const markdown = await accessReadFile(currPath);
        if (!markdown) {
          throw new Error(`Could not read file ${currPath}`);
        }
        const { source, frontmatter } = await processMdx<DefinitionMetadata>(
          markdown,
          {
            rehypePlugins: [
              [
                rehypeLinkToDefinition,
                {
                  slug: path.basename(filename, '.mdx'),
                  dictionary: extractDictionaryFromPath(dir)
                }
              ]
            ]
          }
        );

        if (!frontmatter.dictionary) {
          throw new Error(`Dictionary not specified for file: ${filename}`);
        }

        const slug = path.basename(filename, '.mdx');

        // Parse <a id> from raw file for anchorId/displayName
        const rawContent = fs.readFileSync(currPath, 'utf-8');
        const { content: body } = matter(rawContent);
        const anchorParsed = parseAnchorTag(body);

        frontmatter.slug = slug;
        frontmatter.anchorId =
          anchorParsed?.anchorId ?? slugify(frontmatter.word || slug);
        frontmatter.displayName =
          anchorParsed?.displayName ?? frontmatter.word ?? slug;
        frontmatter.letter =
          frontmatter.letter || frontmatter.displayName.charAt(0).toLowerCase();
        frontmatter.links = frontmatter.links ?? [];
        frontmatter.dataSource =
          frontmatter.dataSource ?? frontmatter.dataSources;
        frontmatter.relatedSlugs = graph.get(slug) ?? [];

        frontmatter.url = new URL(
          path.join('dictionaries', frontmatter.dictionary),
          config.baseUrl
        ).toString();

        return {
          source,
          frontmatter
        };
      })
  );

  // filter and sort logic
  const definitions2: Definition[] = definitions
    .filter((definition) => definition.frontmatter.published)
    .sort((a, b) => {
      const letterA = a.frontmatter.letter.toLowerCase();
      const letterB = b.frontmatter.letter.toLowerCase();

      const isLetterA = /^[a-z]$/.test(letterA);
      const isLetterB = /^[a-z]$/.test(letterB);

      if (isLetterA && isLetterB) {
        return letterA.localeCompare(letterB);
      } else if (isLetterA) {
        return -1;
      } else if (isLetterB) {
        return 1;
      } else {
        return letterA.localeCompare(letterB);
      }
    });

  return definitions2;
}
