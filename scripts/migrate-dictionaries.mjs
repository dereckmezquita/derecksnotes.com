#!/usr/bin/env node
/**
 * migrate-dictionaries.mjs
 *
 * Phase-1 migration of dictionary MDX files:
 *   - Remove frontmatter fields: word, linksTo, linkedFrom, output
 *   - Add: links: []
 *   - Standardise <a id="..."> attributes: underscores → hyphens
 *   - Standardise hash link targets: underscores → hyphens, camelCase → hyphens
 *
 * Usage: node scripts/migrate-dictionaries.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const DEFINITION_DIRS = [
  path.join(PROJECT_ROOT, 'client/src/app/dictionaries/biology/definitions'),
  path.join(PROJECT_ROOT, 'client/src/app/dictionaries/chemistry/definitions'),
  path.join(PROJECT_ROOT, 'client/src/app/dictionaries/mathematics/definitions')
];

// Fields to remove from frontmatter
const REMOVE_FIELDS = new Set(['word', 'linksTo', 'linkedFrom', 'output']);

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a camelCase or underscore string to kebab-case.
 *   "baseUnit"           → "base-unit"
 *   "amino_acid"         → "amino-acid"
 *   "CDic_colvalentBond" → "c-dic-colvalent-bond"
 */
function toKebab(str) {
  return (
    str
      // insert hyphen before each uppercase letter
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      // also handle sequences like "CDic" → "C-Dic"
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      // underscores → hyphens
      .replace(/_/g, '-')
      .toLowerCase()
  );
}

/**
 * Standardise id attributes in <a id="..."> tags:
 * convert underscores to hyphens (no camelCase conversion for ids — they
 * are already lowercase-underscore by convention).
 */
function fixAnchorIds(body) {
  return body.replace(/<a\s+id="([^"]+)">/g, (_match, id) => {
    const fixed = id.replace(/_/g, '-');
    return `<a id="${fixed}">`;
  });
}

/**
 * Standardise hash-link targets: ](#target)
 *   - underscores → hyphens
 *   - camelCase   → hyphens
 */
function fixHashLinks(body) {
  return body.replace(/\]\(#([^)]+)\)/g, (_match, target) => {
    const fixed = toKebab(target);
    return `](#${fixed})`;
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  // Collect all .mdx files
  const files = [];
  for (const dir of DEFINITION_DIRS) {
    if (!fs.existsSync(dir)) {
      console.warn(`WARNING: directory not found: ${dir}`);
      continue;
    }
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith('.mdx')) continue;
      files.push(path.join(dir, name));
    }
  }

  console.log(
    `Found ${files.length} MDX files across ${DEFINITION_DIRS.length} directories.\n`
  );

  let changed = 0;
  let unchanged = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const fileName = path.basename(filePath);
    const raw = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter + body
    const { data, content } = matter(raw);

    const changes = [];

    // ── Frontmatter mutations ────────────────────────────────────────
    for (const field of REMOVE_FIELDS) {
      if (field in data) {
        delete data[field];
        changes.push(`-${field}`);
      }
    }

    if (!('links' in data)) {
      data.links = [];
      changes.push('+links');
    }

    // ── Body mutations ───────────────────────────────────────────────
    let newContent = content;

    const contentAfterIds = fixAnchorIds(newContent);
    if (contentAfterIds !== newContent) {
      changes.push('fix-anchor-ids');
      newContent = contentAfterIds;
    }

    const contentAfterHashes = fixHashLinks(newContent);
    if (contentAfterHashes !== newContent) {
      changes.push('fix-hash-links');
      newContent = contentAfterHashes;
    }

    // ── Write back ──────────────────────────────────────────────────
    if (changes.length > 0) {
      // Rebuild the file. gray-matter.stringify adds the --- fences.
      const output = matter.stringify(newContent, data);
      fs.writeFileSync(filePath, output, 'utf8');
      changed++;
      console.log(
        `[${i + 1}/${files.length}] ${fileName} — ${changes.join(', ')}`
      );
    } else {
      unchanged++;
      console.log(`[${i + 1}/${files.length}] ${fileName} — no changes`);
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Files processed: ${files.length}`);
  console.log(`  Files changed:   ${changed}`);
  console.log(`  Files unchanged: ${unchanged}`);
}

main();
