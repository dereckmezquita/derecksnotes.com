// =============================================================================
// One-shot migration: old co-mingled course layout -> recursive source/dist trees
// =============================================================================
//
// Transforms:
//   client/src/app/courses/posts/mathematical-statistics-with-R/   (OLD)
// into two parallel trees:
//   client/content/courses/mathematical-statistics-with-R/         (SOURCE: .Rmd + index.mdx + data)
//   client/content-dist/courses/mathematical-statistics-with-R/    (OUTPUT: built .mdx + index.mdx)
//
// Key moves:
//   - _series.mdx            -> volume index.mdx   (drops the `labels` map)
//   - _meta.yaml             -> chapter index.mdx
//   - _passthrough           -> family index.mdx with `transparent: true`
//   - part frontmatter `part:`-> the part's own `title:` (fixes the "every part
//                                shows the series title" bug); drops chapter:/part:
//   - part filenames         -> short, context-free: 01-1_<series>_<chapter>_<name>
//                                becomes 0M-<name> (the tree supplies context)
//   - .Rmd data_dir          -> ../../data (one level shallower; src/ is gone)
//
// Figures are NOT touched: the built .mdx keep their existing
// /courses/mathematical-statistics-1-foundations/<label>.png references and the
// PNGs stay in client/public/courses/mathematical-statistics-1-foundations/.
//
// Run from the client/ directory:  node scripts/migrate-courses-tree.mjs
// Idempotent: wipes and regenerates the two target trees on each run.
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT = path.resolve(__dirname, '..');

const FAMILY = 'mathematical-statistics-with-R';
const VOLUME = 'mathematical-statistics-1-foundations';

const OLD = path.join(CLIENT, 'src/app/courses/posts', FAMILY);
const SRC = path.join(CLIENT, 'content/courses', FAMILY);
const DIST = path.join(CLIENT, 'content-dist/courses', FAMILY);

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function read(p) {
  return fs.readFileSync(p, 'utf-8');
}
function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

// Split a frontmatter document into [rawFrontmatter, body].
function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter block found');
  return [m[1], m[2]];
}

// "Part 1: Types of Data and Central Tendency" -> "Types of Data and Central Tendency"
function stripPartLabel(s) {
  if (!s) return null;
  return String(s)
    .replace(/^\s*Part\s+\d+\s*[:.\-]\s*/i, '')
    .trim();
}

function humanize(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// 01-1_<series>_<chapter>_<name>.<ext>  ->  { newBase: "0M-<name>", name }
function renamePart(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const segs = base.split('_');
  if (segs.length < 4) {
    throw new Error(
      `unexpected part filename (need >=4 _-segments): ${filename}`
    );
  }
  const partNum = segs[0].split('-')[1]; // "01-1" -> "1"
  if (!partNum) throw new Error(`cannot read part number from: ${filename}`);
  const name = segs.slice(3).join('_'); // tail after num_series_chapter
  const newBase = `${String(parseInt(partNum, 10)).padStart(2, '0')}-${name}`;
  return { newBase, name, ext };
}

// Surgical frontmatter edit on a part file: set its own title, drop the
// chapter:/part: lines. Body is left byte-for-byte intact (figure refs!),
// except .Rmd source gets its data_dir relative path shortened by one level.
function transformPart(text, { isRmd }) {
  const data = matter(text).data;
  const realTitle = stripPartLabel(data.part) || humanize(path.basename('x'));

  let [fm, body] = splitFrontmatter(text);

  const safeTitle = String(realTitle).replace(/'/g, "''");
  if (/^title:.*$/m.test(fm)) {
    fm = fm.replace(/^title:.*$/m, `title: '${safeTitle}'`);
  } else {
    fm = `title: '${safeTitle}'\n` + fm;
  }
  fm = fm.replace(/^chapter:.*\r?\n/m, '');
  fm = fm.replace(/^part:.*\r?\n/m, '');

  if (isRmd) {
    // src/ level removed: ../../../data -> ../../data
    body = body.replace(/(['"])\.\.\/\.\.\/\.\.\/data\1/g, '$1../../data$1');
  }

  return `---\n${fm}\n---\n${body}`;
}

function writeIndex(dir, data, body = '') {
  write(
    path.join(dir, 'index.mdx'),
    matter.stringify(`\n${body}`.trimStart(), data)
  );
}

// ---------------------------------------------------------------------------
// migrate
// ---------------------------------------------------------------------------

function main() {
  if (!fs.existsSync(OLD)) {
    throw new Error(`old course tree not found: ${OLD}`);
  }
  rmrf(SRC);
  rmrf(DIST);

  const stats = { chapters: 0, partsRmd: 0, partsMdx: 0, indexes: 0 };

  // 1. Family (organisational, hidden from the URL) ------------------------
  const familyData = {
    title: 'Mathematical Statistics with R',
    blurb:
      'A multi-volume, rigorous treatment of statistical theory with proofs, derivations, and computational demonstrations in R.',
    coverImage: 13,
    author: 'Dereck Mezquita',
    tags: ['statistics', 'mathematics', 'r'],
    transparent: true,
    published: true
  };
  writeIndex(SRC, familyData);
  writeIndex(DIST, familyData);
  stats.indexes += 2;

  // shared datasets live with the source (build-time ingredient, never served)
  fs.cpSync(path.join(OLD, 'data'), path.join(SRC, 'data'), {
    recursive: true
  });

  // 2. Volume (the routable "work") ---------------------------------------
  const series = matter(read(path.join(OLD, VOLUME, '_series.mdx')));
  const volumeData = { ...series.data };
  delete volumeData.labels; // numbering is derived positionally now
  writeIndex(path.join(SRC, VOLUME), volumeData, series.content);
  writeIndex(path.join(DIST, VOLUME), volumeData, series.content);
  stats.indexes += 2;

  // 3. Chapters + parts ----------------------------------------------------
  const oldVolume = path.join(OLD, VOLUME);
  const chapterDirs = fs
    .readdirSync(oldVolume)
    .filter((d) => /^\d+-/.test(d))
    .filter((d) => fs.statSync(path.join(oldVolume, d)).isDirectory())
    .sort();

  for (const chapter of chapterDirs) {
    stats.chapters += 1;
    const oldChapter = path.join(oldVolume, chapter);
    const srcChapter = path.join(SRC, VOLUME, chapter);
    const distChapter = path.join(DIST, VOLUME, chapter);

    // chapter index from _meta.yaml
    const meta = yaml.load(read(path.join(oldChapter, '_meta.yaml')));
    const chapterData = {
      title: meta.title,
      summary: meta.summary,
      published: meta.published ?? true
    };
    writeIndex(srcChapter, chapterData);
    writeIndex(distChapter, chapterData);
    stats.indexes += 2;

    // built parts (.mdx) -> dist
    for (const file of fs.readdirSync(oldChapter)) {
      if (!file.endsWith('.mdx')) continue;
      const { newBase } = renamePart(file);
      const out = transformPart(read(path.join(oldChapter, file)), {
        isRmd: false
      });
      write(path.join(distChapter, `${newBase}.mdx`), out);
      stats.partsMdx += 1;
    }

    // source parts (.Rmd) -> source
    const oldSrcChapter = path.join(oldVolume, 'src', chapter);
    if (fs.existsSync(oldSrcChapter)) {
      for (const file of fs.readdirSync(oldSrcChapter)) {
        if (!file.endsWith('.Rmd')) continue;
        const { newBase } = renamePart(file);
        const out = transformPart(read(path.join(oldSrcChapter, file)), {
          isRmd: true
        });
        write(path.join(srcChapter, `${newBase}.Rmd`), out);
        stats.partsRmd += 1;
      }
    }
  }

  console.log('Migration complete:');
  console.log(`  chapters:      ${stats.chapters}`);
  console.log(`  source .Rmd:   ${stats.partsRmd}`);
  console.log(`  dist .mdx:     ${stats.partsMdx}`);
  console.log(`  index.mdx:     ${stats.indexes}`);
  console.log(`  source tree:   ${path.relative(CLIENT, SRC)}`);
  console.log(`  dist tree:     ${path.relative(CLIENT, DIST)}`);

  if (stats.partsRmd !== stats.partsMdx) {
    console.warn(
      `  WARNING: .Rmd count (${stats.partsRmd}) != .mdx count (${stats.partsMdx})`
    );
  }
}

main();
