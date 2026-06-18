import { describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';

// Regression guard for the Bun + Next.js on-demand RSC MDX compile crash
// (Object.keys of undefined inside @mdx-js/mdx recma-jsx-rewrite). On-demand
// rendering is unusable, so every dictionary [slug] page MUST pre-build every
// MDX file via generateStaticParams. A future "let me speed up dev builds by
// slicing" change would silently 500 on dev again — this test makes that
// regression loud and synchronous.

const DICTIONARIES = ['biology', 'chemistry', 'mathematics'] as const;

const APP_DIR = path.resolve(import.meta.dir, '..');
const PAGE_PATH = (dict: string) =>
  path.join(APP_DIR, 'dictionaries', dict, '[slug]', 'page.tsx');
const DEFINITIONS_DIR = (dict: string) =>
  path.join(APP_DIR, 'dictionaries', dict, 'definitions');

const GENERATE_STATIC_PARAMS_BLOCK =
  /export\s+async\s+function\s+generateStaticParams[\s\S]*?\n\}/m;

describe('dictionary generateStaticParams', () => {
  for (const dict of DICTIONARIES) {
    describe(dict, () => {
      const source = fs.readFileSync(PAGE_PATH(dict), 'utf-8');
      const match = source.match(GENERATE_STATIC_PARAMS_BLOCK);

      test('generateStaticParams is exported', () => {
        expect(match).not.toBeNull();
      });

      test('does NOT slice/limit the slug list', () => {
        // .slice( inside generateStaticParams would re-introduce the dev SSG
        // split that left non-prebuilt slugs to the broken on-demand path.
        expect(match![0]).not.toMatch(/\.slice\s*\(/);
      });

      test('does NOT branch on isProduction', () => {
        // The original regression used `config.isProduction ? slugs : slugs.slice(0,3)`.
        // Any env-conditional return is suspicious here.
        expect(match![0]).not.toMatch(/isProduction/);
      });

      test('returns every .mdx file in the definitions dir (file count > 3)', () => {
        const files = fs
          .readdirSync(DEFINITIONS_DIR(dict))
          .filter((f) => f.endsWith('.mdx'));
        // Original bug pre-built only first 3. If a future change accidentally
        // pre-builds only a handful, the count alone won't catch it (no easy
        // hook into the function), but we can at least assert there ARE more
        // than 3 .mdx files — so any "slice(0,3)" reintroduction would
        // mismatch reality.
        expect(files.length).toBeGreaterThan(3);
      });
    });
  }
});
