#!/usr/bin/env node
/**
 * audit-tags.mjs
 *
 * Reads all blog posts, references, and course files.
 * Outputs a JSON report of all tags, categories, and metadata.
 *
 * Usage: node scripts/audit-tags.mjs
 * Output: scripts/tag-audit.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CLIENT_SRC = path.join(PROJECT_ROOT, 'client/src/app');
const OUTPUT_FILE = path.join(__dirname, 'tag-audit.json');

function walkMdx(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkMdx(full));
    } else if (item.endsWith('.mdx') && !item.startsWith('_')) {
      results.push(full);
    }
  }
  return results;
}

function audit() {
  const sections = {
    blog: path.join(CLIENT_SRC, 'blog/posts'),
    references: path.join(CLIENT_SRC, 'references/posts'),
    courses: path.join(CLIENT_SRC, 'courses/posts')
  };

  const allEntries = [];
  const tagCounts = {};
  const tagsBySection = {};
  const categoriesFound = {};

  for (const [section, dir] of Object.entries(sections)) {
    const files = walkMdx(dir);
    tagsBySection[section] = {};

    for (const file of files) {
      try {
        const raw = fs.readFileSync(file, 'utf-8');
        const { data: fm } = matter(raw);

        const relPath = path.relative(PROJECT_ROOT, file);
        const tags = Array.isArray(fm.tags)
          ? fm.tags.map((t) => String(t).trim())
          : [];
        const category = fm.category || null;

        allEntries.push({
          section,
          file: relPath,
          title: fm.title || null,
          tags,
          category,
          published: fm.published ?? null,
          date: fm.date || null
        });

        for (const tag of tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          tagsBySection[section][tag] = (tagsBySection[section][tag] || 0) + 1;
        }

        if (category) {
          categoriesFound[category] = (categoriesFound[category] || 0) + 1;
        }
      } catch (e) {
        // skip files that can't be parsed
      }
    }
  }

  // Sort tags by frequency
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  // Find potential duplicates (tags that are very similar)
  const duplicateCandidates = [];
  const tagList = Object.keys(tagCounts);
  for (let i = 0; i < tagList.length; i++) {
    for (let j = i + 1; j < tagList.length; j++) {
      const a = tagList[i];
      const b = tagList[j];
      // Check if one is a substring of the other, or they differ by only plural/hyphen
      const aNorm = a.replace(/-/g, '').replace(/s$/, '');
      const bNorm = b.replace(/-/g, '').replace(/s$/, '');
      if (aNorm === bNorm || a.includes(b) || b.includes(a)) {
        duplicateCandidates.push({
          a,
          b,
          countA: tagCounts[a],
          countB: tagCounts[b]
        });
      }
    }
  }

  // Tags used only once (potential typos)
  const singleUseTags = sortedTags.filter((t) => t.count === 1);

  // Tags with uppercase (should be lowercase)
  const uppercaseTags = sortedTags.filter((t) => t.tag !== t.tag.toLowerCase());

  // Tags with spaces (should use hyphens)
  const spaceTags = sortedTags.filter((t) => t.tag.includes(' '));

  // Posts without category field
  const noCategoryPosts = allEntries
    .filter(
      (e) => !e.category && (e.section === 'blog' || e.section === 'references')
    )
    .map((e) => ({ file: e.file, title: e.title, section: e.section }));

  const report = {
    summary: {
      totalFiles: allEntries.length,
      totalUniqueTags: sortedTags.length,
      bySection: Object.fromEntries(
        Object.entries(sections).map(([s]) => [
          s,
          allEntries.filter((e) => e.section === s).length
        ])
      )
    },
    allTags: sortedTags,
    tagsBySection,
    categoriesFound: Object.entries(categoriesFound)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ category: cat, count })),
    issues: {
      duplicateCandidates,
      singleUseTags,
      uppercaseTags,
      spaceTags,
      postsWithoutCategory: noCategoryPosts,
      postsWithoutCategoryCount: noCategoryPosts.length
    },
    allEntries
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log('=== Tag Audit Report ===\n');
  console.log(`Total files: ${allEntries.length}`);
  for (const [s, count] of Object.entries(report.summary.bySection)) {
    console.log(`  ${s}: ${count}`);
  }
  console.log(`\nUnique tags: ${sortedTags.length}`);
  console.log(`\nTop 20 tags:`);
  for (const t of sortedTags.slice(0, 20)) {
    console.log(`  ${t.tag} (${t.count})`);
  }
  console.log(`\nIssues:`);
  console.log(`  Duplicate candidates: ${duplicateCandidates.length}`);
  console.log(`  Single-use tags: ${singleUseTags.length}`);
  console.log(`  Uppercase tags: ${uppercaseTags.length}`);
  console.log(`  Tags with spaces: ${spaceTags.length}`);
  console.log(`  Posts without category: ${noCategoryPosts.length}`);
  console.log(`\nCategories found: ${Object.keys(categoriesFound).length}`);
  for (const { category, count } of report.categoriesFound) {
    console.log(`  ${category} (${count})`);
  }
  console.log(`\nFull report: ${OUTPUT_FILE}`);
}

audit();
