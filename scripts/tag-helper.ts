/**
 * tag-helper — Interactive tag/category/domain search tool
 *
 * Reads all MDX frontmatter across the site, collects tags/categories/domains,
 * and provides fuzzy search as you type.
 *
 * Usage: bun scripts/tag-helper.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CLIENT_SRC = path.resolve(import.meta.dir, '..', 'client/src/app');

interface Frontmatter {
  tags?: string[];
  category?: string;
  domain?: string;
}

function walkMdx(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      results.push(...walkMdx(full));
    } else if (item.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function collectMetadata() {
  const sections = [
    path.join(CLIENT_SRC, 'blog/posts'),
    path.join(CLIENT_SRC, 'references/posts'),
    path.join(CLIENT_SRC, 'courses/posts'),
    path.join(CLIENT_SRC, 'dictionaries/biology/definitions'),
    path.join(CLIENT_SRC, 'dictionaries/chemistry/definitions'),
    path.join(CLIENT_SRC, 'dictionaries/mathematics/definitions')
  ];

  const tags: Record<string, number> = {};
  const categories: Record<string, number> = {};
  const domains: Record<string, number> = {};

  for (const dir of sections) {
    for (const file of walkMdx(dir)) {
      try {
        const { data: fm } = matter(fs.readFileSync(file, 'utf-8')) as {
          data: Frontmatter;
        };

        if (Array.isArray(fm.tags)) {
          for (const tag of fm.tags) {
            const t = String(tag).trim().toLowerCase();
            if (t) tags[t] = (tags[t] || 0) + 1;
          }
        }

        if (fm.category) {
          const c = String(fm.category).trim().toLowerCase();
          if (c) categories[c] = (categories[c] || 0) + 1;
        }

        if (fm.domain) {
          const d = String(fm.domain).trim().toLowerCase();
          if (d) domains[d] = (domains[d] || 0) + 1;
        }
      } catch {
        // skip unparseable files
      }
    }
  }

  return {
    tags: Object.entries(tags).sort((a, b) => b[1] - a[1]),
    categories: Object.entries(categories).sort((a, b) => b[1] - a[1]),
    domains: Object.entries(domains).sort((a, b) => b[1] - a[1])
  };
}

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (q.length === 0) return true;
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function formatEntry(name: string, count: number, type: string): string {
  const countStr = String(count).padStart(4);
  const typeStr = type.padEnd(10);
  return `  \x1b[36m${countStr}\x1b[0m  \x1b[33m${typeStr}\x1b[0m  ${name}`;
}

type Metadata = ReturnType<typeof collectMetadata>;

function showResults(query: string, data: Metadata): void {
  const results: { name: string; count: number; type: string }[] = [];

  for (const [name, count] of data.tags) {
    if (fuzzyMatch(query, name)) results.push({ name, count, type: 'tag' });
  }
  for (const [name, count] of data.categories) {
    if (fuzzyMatch(query, name))
      results.push({ name, count, type: 'category' });
  }
  for (const [name, count] of data.domains) {
    if (fuzzyMatch(query, name)) results.push({ name, count, type: 'domain' });
  }

  results.sort((a, b) => b.count - a.count);

  process.stdout.write('\x1b[2J\x1b[H');
  console.log('\x1b[1mTag Helper\x1b[0m — type to search, Ctrl+C to exit\n');
  console.log('\x1b[2m  Count  Type        Name\x1b[0m');
  console.log('\x1b[2m  ─────  ──────────  ────────────────────────\x1b[0m');

  for (const r of results.slice(0, 30)) {
    console.log(formatEntry(r.name, r.count, r.type));
  }

  if (results.length > 30) {
    console.log(`\n  \x1b[2m... and ${results.length - 30} more\x1b[0m`);
  }

  if (results.length === 0 && query.length > 0) {
    console.log(`\n  \x1b[2mNo matches for "${query}"\x1b[0m`);
  }

  const total = data.tags.length + data.categories.length + data.domains.length;
  console.log(
    `\n\x1b[2m  ${data.tags.length} tags, ${data.categories.length} categories, ${data.domains.length} domains (${total} total)\x1b[0m`
  );
  console.log(`\n\x1b[1m> ${query}\x1b[0m`);
}

// Main
console.log('Loading content metadata...');
const data = collectMetadata();
console.log(
  `Loaded ${data.tags.length} tags, ${data.categories.length} categories, ${data.domains.length} domains.\n`
);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

let query = '';
showResults(query, data);

process.stdin.on('data', (key: string) => {
  if (key === '\u0003') {
    process.stdout.write('\x1b[2J\x1b[H');
    process.exit();
  } else if (key === '\u007F' || key === '\b') {
    query = query.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32 && key.charCodeAt(0) < 127) {
    query += key;
  }
  showResults(query, data);
});
