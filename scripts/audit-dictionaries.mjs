#!/usr/bin/env node
/**
 * audit-dictionaries.mjs
 *
 * Reads all dictionary MDX files, extracts frontmatter + body structure,
 * cross-references all tags/links, and outputs a JSON audit report.
 *
 * Usage: node scripts/audit-dictionaries.mjs
 * Output: scripts/dictionary-audit.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DICTIONARIES_DIR = path.join(PROJECT_ROOT, 'client/src/app/dictionaries');
const OUTPUT_FILE = path.join(__dirname, 'dictionary-audit.json');

// Simple frontmatter parser
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const raw = match[1];
  const body = content.slice(match[0].length).trim();
  const frontmatter = {};

  // Parse YAML-like frontmatter (simple key: value and arrays)
  let currentKey = null;
  for (const line of raw.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, val] = kvMatch;
      const trimmed = val.trim();

      // Array on single line: ['a', 'b', 'c']
      if (trimmed.startsWith('[')) {
        try {
          frontmatter[key] = JSON.parse(trimmed.replace(/'/g, '"'));
        } catch {
          // Try extracting manually
          const items = trimmed
            .replace(/[\[\]']/g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          frontmatter[key] = items;
        }
      } else if (trimmed === '' || trimmed === '[]') {
        frontmatter[key] = [];
        currentKey = key;
      } else {
        // Remove quotes
        frontmatter[key] = trimmed.replace(/^['"]|['"]$/g, '');
      }
      currentKey = key;
    } else if (line.match(/^\s+-\s+/)) {
      // Array continuation
      if (currentKey && !Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      if (currentKey) {
        const item = line
          .replace(/^\s+-\s+/, '')
          .replace(/^['"]|['"]$/g, '')
          .trim();
        frontmatter[currentKey].push(item);
      }
    }
  }

  return { frontmatter, body };
}

// Extract <a id="...">Display Name</a> from body
function parseAnchorTag(body) {
  const match = body.match(/<a\s+id="([^"]+)"[^>]*>([^<]+)<\/a>/);
  if (!match) return { anchorId: null, displayName: null };
  return { anchorId: match[1], displayName: match[2].trim() };
}

// Extract all hash link targets from body: [text](#target)
function extractHashLinks(body) {
  const links = [];
  const regex = /\]\(#([^)]+)\)/g;
  let m;
  while ((m = regex.exec(body)) !== null) {
    links.push(m[1]);
  }
  return [...new Set(links)];
}

// Main audit
function audit() {
  const dictionaries = ['biology', 'chemistry', 'mathematics'];
  const allDefinitions = [];
  const stats = { totalFiles: 0, byDictionary: {} };

  for (const dict of dictionaries) {
    const defDir = path.join(DICTIONARIES_DIR, dict, 'definitions');
    if (!fs.existsSync(defDir)) continue;

    const files = fs.readdirSync(defDir).filter((f) => f.endsWith('.mdx'));
    stats.byDictionary[dict] = files.length;
    stats.totalFiles += files.length;

    for (const file of files) {
      const filepath = path.join(defDir, file);
      const content = fs.readFileSync(filepath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);
      const { anchorId, displayName } = parseAnchorTag(body);
      const bodyHashLinks = extractHashLinks(body);
      const slug = path.basename(file, '.mdx');

      allDefinitions.push({
        filename: file,
        slug,
        dictionary: dict,
        // Frontmatter
        word: frontmatter.word || null,
        letter: frontmatter.letter || null,
        category: frontmatter.category || null,
        published:
          frontmatter.published === 'true' || frontmatter.published === true,
        linksTo: Array.isArray(frontmatter.linksTo) ? frontmatter.linksTo : [],
        linkedFrom: Array.isArray(frontmatter.linkedFrom)
          ? frontmatter.linkedFrom
          : [],
        // Body parsed
        anchorId,
        displayName,
        bodyHashLinks
      });
    }
  }

  // Build lookup maps
  const byAnchorId = {}; // anchorId -> definition
  const byWord = {}; // word -> definition
  const allTagValues = new Set();
  const allAnchorIds = new Set();
  const allWords = new Set();

  for (const def of allDefinitions) {
    if (def.anchorId) {
      byAnchorId[def.anchorId] = def;
      allAnchorIds.add(def.anchorId);
    }
    if (def.word) {
      byWord[def.word] = def;
      allWords.add(def.word);
    }
    for (const tag of [...def.linksTo, ...def.linkedFrom]) {
      allTagValues.add(tag);
    }
  }

  // Cross-reference analysis
  const orphanTags = []; // tags that don't match any anchorId or word
  const formatMismatches = []; // word vs anchorId format differences
  const missingAnchorTags = []; // definitions without <a id>
  const duplicateAnchorIds = {};
  const bodyLinkOrphans = []; // hash links that don't match any anchorId

  // Check for missing anchor tags
  for (const def of allDefinitions) {
    if (!def.anchorId) {
      missingAnchorTags.push(def.filename);
    }
  }

  // Check for duplicate anchor IDs
  const anchorIdCount = {};
  for (const def of allDefinitions) {
    if (def.anchorId) {
      anchorIdCount[def.anchorId] = (anchorIdCount[def.anchorId] || 0) + 1;
    }
  }
  for (const [id, count] of Object.entries(anchorIdCount)) {
    if (count > 1) {
      duplicateAnchorIds[id] = allDefinitions
        .filter((d) => d.anchorId === id)
        .map((d) => d.filename);
    }
  }

  // Check format mismatches between word and anchorId
  for (const def of allDefinitions) {
    if (def.word && def.anchorId) {
      const wordNorm = def.word.replace(/-/g, '_');
      const anchorNorm = def.anchorId.replace(/-/g, '_');
      if (wordNorm !== anchorNorm && def.word !== def.anchorId) {
        formatMismatches.push({
          filename: def.filename,
          word: def.word,
          anchorId: def.anchorId
        });
      }
    }
  }

  // Check orphan tags (linksTo/linkedFrom values that don't match any definition)
  for (const tag of allTagValues) {
    const matchesAnchorId = allAnchorIds.has(tag);
    const matchesWord = allWords.has(tag);
    // Also check with underscore/hyphen normalization
    const tagHyphen = tag.replace(/_/g, '-').toLowerCase();
    const tagUnderscore = tag.replace(/-/g, '_').toLowerCase();
    const matchesNormalized =
      [...allAnchorIds].some(
        (id) =>
          id.toLowerCase() === tagHyphen || id.toLowerCase() === tagUnderscore
      ) ||
      [...allWords].some(
        (w) =>
          w.toLowerCase() === tagHyphen || w.toLowerCase() === tagUnderscore
      );

    if (!matchesAnchorId && !matchesWord && !matchesNormalized) {
      // Find which definitions reference this orphan tag
      const referencedBy = allDefinitions
        .filter((d) => d.linksTo.includes(tag) || d.linkedFrom.includes(tag))
        .map((d) => d.filename);
      orphanTags.push({ tag, referencedBy });
    }
  }

  // Check body hash links that don't match any anchor
  for (const def of allDefinitions) {
    for (const target of def.bodyHashLinks) {
      const matchesAnchorId = allAnchorIds.has(target);
      const targetHyphen = target.replace(/_/g, '-').toLowerCase();
      const matchesNormalized = [...allAnchorIds].some(
        (id) =>
          id.toLowerCase() === targetHyphen ||
          id.replace(/_/g, '-').toLowerCase() === targetHyphen
      );
      if (!matchesAnchorId && !matchesNormalized) {
        bodyLinkOrphans.push({
          source: def.filename,
          target,
          displayName: def.displayName
        });
      }
    }
  }

  // Collect all unique categories and anchor ID formats
  const categories = [
    ...new Set(allDefinitions.map((d) => d.category).filter(Boolean))
  ].sort();
  const anchorFormats = {
    hyphensOnly: allDefinitions.filter(
      (d) => d.anchorId && d.anchorId.includes('-') && !d.anchorId.includes('_')
    ).length,
    underscoresOnly: allDefinitions.filter(
      (d) => d.anchorId && d.anchorId.includes('_') && !d.anchorId.includes('-')
    ).length,
    plain: allDefinitions.filter(
      (d) =>
        d.anchorId && !d.anchorId.includes('_') && !d.anchorId.includes('-')
    ).length,
    mixed: allDefinitions.filter(
      (d) => d.anchorId && d.anchorId.includes('_') && d.anchorId.includes('-')
    ).length
  };

  // Build the report
  const report = {
    stats,
    anchorFormats,
    categories,
    issues: {
      orphanTags: orphanTags.sort((a, b) => a.tag.localeCompare(b.tag)),
      orphanTagCount: orphanTags.length,
      bodyLinkOrphans: bodyLinkOrphans.sort((a, b) =>
        a.target.localeCompare(b.target)
      ),
      bodyLinkOrphanCount: bodyLinkOrphans.length,
      formatMismatches: formatMismatches.sort((a, b) =>
        a.filename.localeCompare(b.filename)
      ),
      formatMismatchCount: formatMismatches.length,
      missingAnchorTags,
      missingAnchorTagCount: missingAnchorTags.length,
      duplicateAnchorIds,
      duplicateAnchorIdCount: Object.keys(duplicateAnchorIds).length
    },
    allDefinitions: allDefinitions.map((d) => ({
      filename: d.filename,
      dictionary: d.dictionary,
      word: d.word,
      anchorId: d.anchorId,
      displayName: d.displayName,
      letter: d.letter,
      category: d.category,
      linksToCount: d.linksTo.length,
      linkedFromCount: d.linkedFrom.length,
      bodyHashLinkCount: d.bodyHashLinks.length,
      bodyHashLinks: d.bodyHashLinks
    }))
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log('=== Dictionary Audit Report ===\n');
  console.log(`Total files: ${stats.totalFiles}`);
  for (const [dict, count] of Object.entries(stats.byDictionary)) {
    console.log(`  ${dict}: ${count}`);
  }
  console.log(`\nAnchor ID formats:`);
  console.log(`  Hyphens only: ${anchorFormats.hyphensOnly}`);
  console.log(`  Underscores only: ${anchorFormats.underscoresOnly}`);
  console.log(`  Plain (no separator): ${anchorFormats.plain}`);
  console.log(`  Mixed: ${anchorFormats.mixed}`);
  console.log(`\nIssues found:`);
  console.log(`  Orphan tags (no matching definition): ${orphanTags.length}`);
  console.log(
    `  Body link orphans (hash targets with no match): ${bodyLinkOrphans.length}`
  );
  console.log(
    `  Format mismatches (word vs anchorId): ${formatMismatches.length}`
  );
  console.log(`  Missing <a id> tags: ${missingAnchorTags.length}`);
  console.log(
    `  Duplicate anchor IDs: ${Object.keys(duplicateAnchorIds).length}`
  );
  console.log(`\nCategories: ${categories.length}`);
  console.log(`\nFull report written to: ${OUTPUT_FILE}`);
}

audit();
