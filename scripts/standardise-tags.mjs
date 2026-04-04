import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const ROOT = path.resolve(import.meta.dirname, '..');
const CLIENT = path.join(ROOT, 'client/src/app');

// ── Tag rename map ──────────────────────────────────────────────────────────
const TAG_RENAMES = {
  r: 'r',
  R: 'r',
  JS: 'javascript',
  js: 'javascript',
  LLN: 'law-of-large-numbers',
  lln: 'law-of-large-numbers',
  CLT: 'central-limit-theorem',
  clt: 'central-limit-theorem',
  AIC: 'akaike-information-criterion',
  aic: 'akaike-information-criterion',
  BIC: 'bayesian-information-criterion',
  bic: 'bayesian-information-criterion',
  'type-I-error': 'type-i-error',
  'type-II-error': 'type-ii-error',
  cheatsheet: 'cheat-sheet',
  next: 'next-js',
  nextjs: 'next-js',
  react: 'react-js',
  reactjs: 'react-js'
};

function standardiseTag(tag) {
  // Check rename map first (case-sensitive for specifics like R, JS)
  if (TAG_RENAMES.hasOwnProperty(tag)) {
    return TAG_RENAMES[tag];
  }
  // Then lowercase everything
  const lower = tag.toLowerCase();
  // Check again after lowercasing
  if (TAG_RENAMES.hasOwnProperty(lower)) {
    return TAG_RENAMES[lower];
  }
  return lower;
}

// ── Category mapping ────────────────────────────────────────────────────────
// Priority order: biology > chemistry > mathematics > physics > programming > data-science > history > personal > reference
const CATEGORY_RULES = [
  {
    category: 'biology',
    match: (t) =>
      /biology|microbiology|bacteria|genetic-engineering|synthetic-biology|molecular-biology|genome|sequencing|cell|protein|enzyme|ecology|botany|zoology|immunology|evolution|wet-lab|bioinformatics/.test(
        t
      )
  },
  {
    category: 'chemistry',
    match: (t) => /^(chemistry|biochemistry|organic-chemistry)$/.test(t)
  },
  {
    category: 'mathematics',
    match: (t) =>
      /^(mathematics|statistics|probability|calculus|algebra|geometry|linear-algebra)$/.test(
        t
      )
  },
  {
    category: 'physics',
    match: (t) => /physics|nuclear-physics|particle-physics|quantum/.test(t)
  },
  {
    category: 'programming',
    match: (t) =>
      /^(programming|javascript|typescript|python|r|next-js|react-js|web-design|front-end|css|html|software|web-development|code|computer-science)$/.test(
        t
      )
  },
  {
    category: 'data-science',
    match: (t) =>
      /data-science|machine-learning|deep-learning|neural-network|artificial-intelligence/.test(
        t
      )
  },
  {
    category: 'history',
    match: (t) =>
      /^(history|biography|science-history|ancient-greece|ancient)$/.test(t)
  },
  {
    category: 'personal',
    match: (t) => /^(personal|photography|art|music|travel)$/.test(t)
  },
  {
    category: 'reference',
    match: (t) => /^(cheat-sheet|lab-protocol|reference)$/.test(t)
  }
];

function deriveCategory(tags) {
  for (const rule of CATEGORY_RULES) {
    for (const tag of tags) {
      if (rule.match(tag)) {
        return rule.category;
      }
    }
  }
  return null;
}

function categoryFromFilename(filename) {
  const base = path.basename(filename);
  if (base.startsWith('biography_')) return 'history';
  if (base.startsWith('cheat-sheets_')) return 'reference';
  if (base.startsWith('biology-wetlab_')) return 'biology';
  return null;
}

// ── Collect files ───────────────────────────────────────────────────────────
function mdxFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(dir, f));
}

function mdxFilesRecursive(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...mdxFilesRecursive(full));
    } else if (
      entry.name.endsWith('.mdx') &&
      entry.name !== '_series.mdx.bak'
    ) {
      results.push(full);
    }
  }
  return results;
}

const blogFiles = mdxFiles(path.join(CLIENT, 'blog/posts'));
const refFiles = mdxFiles(path.join(CLIENT, 'references/posts'));
const courseFiles = mdxFilesRecursive(
  path.join(CLIENT, 'courses/posts')
).filter((f) => path.basename(f) !== '_meta.yaml');

const allFiles = [
  ...blogFiles.map((f) => ({ file: f, type: 'blog' })),
  ...refFiles.map((f) => ({ file: f, type: 'reference' })),
  ...courseFiles.map((f) => ({
    file: f,
    type: path.basename(f) === '_series.mdx' ? 'course-series' : 'course-part'
  }))
];

console.log(
  `Found ${blogFiles.length} blog, ${refFiles.length} reference, ${courseFiles.length} course files\n`
);

// ── Process ─────────────────────────────────────────────────────────────────
let totalChanged = 0;
const changes = [];

for (const { file, type } of allFiles) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);

  if (!data.tags || !Array.isArray(data.tags)) continue;

  let changed = false;
  const tagChanges = [];

  // Standardise tags
  const newTags = data.tags.map((tag) => {
    const fixed = standardiseTag(tag);
    if (fixed !== tag) {
      tagChanges.push(`  "${tag}" → "${fixed}"`);
      changed = true;
    }
    return fixed;
  });

  // Deduplicate tags (keep first occurrence)
  const seen = new Set();
  const dedupedTags = [];
  for (const t of newTags) {
    if (!seen.has(t)) {
      seen.add(t);
      dedupedTags.push(t);
    } else {
      tagChanges.push(`  removed duplicate "${t}"`);
      changed = true;
    }
  }

  data.tags = dedupedTags;

  // Category derivation
  let categoryChange = null;
  if (type === 'blog' || type === 'reference') {
    if (!data.category) {
      let cat = deriveCategory(dedupedTags);
      // For reference files, also check filename prefix as fallback or override
      if (type === 'reference') {
        const filenameCat = categoryFromFilename(file);
        if (filenameCat && !cat) {
          cat = filenameCat;
        } else if (filenameCat) {
          // Filename prefix is authoritative for references
          cat = filenameCat;
        }
      }
      if (cat) {
        data.category = cat;
        categoryChange = cat;
        changed = true;
      }
    }
  } else if (type === 'course-series') {
    if (!data.category) {
      data.category = 'mathematics';
      categoryChange = 'mathematics';
      changed = true;
    }
  }
  // course-part: don't add category (they have chapter and part)

  if (changed) {
    // gray-matter.stringify prepends --- and appends ---
    const output = matter.stringify(content, data);
    fs.writeFileSync(file, output, 'utf8');
    totalChanged++;

    const shortPath = path.relative(ROOT, file);
    const desc = [];
    if (tagChanges.length) desc.push(...tagChanges);
    if (categoryChange) desc.push(`  + category: "${categoryChange}"`);
    changes.push({ path: shortPath, desc });
  }
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n=== Summary ===`);
console.log(`Files processed: ${allFiles.length}`);
console.log(`Files changed: ${totalChanged}\n`);

for (const { path: p, desc } of changes) {
  console.log(p);
  for (const d of desc) {
    console.log(d);
  }
  console.log();
}
