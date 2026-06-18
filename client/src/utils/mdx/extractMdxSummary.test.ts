import { describe, expect, test } from 'bun:test';
import { extractSummaryFromMdx } from './extractMdxSummary';

describe('extractSummaryFromMdx', () => {
  test('plain paragraph round-trips', () => {
    expect(extractSummaryFromMdx('Hello world.')).toBe('Hello world.');
  });

  test('preserves link text inside a paragraph', () => {
    expect(extractSummaryFromMdx('Visit [the docs](/docs) please.')).toBe(
      'Visit the docs please.'
    );
  });

  test('preserves emphasis and strong inline text', () => {
    expect(
      extractSummaryFromMdx('A *gentle* note about **important** things.')
    ).toBe('A gentle note about important things.');
  });

  test('preserves nested inline formatting', () => {
    expect(extractSummaryFromMdx('See [**bold** in a link](/x) here.')).toBe(
      'See bold in a link here.'
    );
  });

  test('preserves inline code', () => {
    expect(extractSummaryFromMdx('Run `bun install` first.')).toBe(
      'Run bun install first.'
    );
  });

  test('joins multiple paragraphs with a single space', () => {
    expect(
      extractSummaryFromMdx(
        'First paragraph.\n\nSecond [linked](/x) paragraph.'
      )
    ).toBe('First paragraph. Second linked paragraph.');
  });

  test('truncates with ellipsis at maxLength', () => {
    const long = 'abcdefghij '.repeat(40); // 400+ chars
    const out = extractSummaryFromMdx(long, 50);
    expect(out.endsWith('...')).toBe(true);
    expect(out.length).toBe(53);
  });

  test('regression: dropping links no longer collapses surrounding text', () => {
    // Mirrors the actual blog-post intro: text + link + more text in one paragraph.
    const intro =
      'For years I have written into this site as if I were writing into a drawer. The [Knowledge Graph](/explore) page is what happened when I finally opened the drawer.';
    const summary = extractSummaryFromMdx(intro);
    expect(summary).toContain('The Knowledge Graph page');
    expect(summary).not.toContain('The page is what');
  });

  test('handles malformed input gracefully (returns empty string)', () => {
    expect(extractSummaryFromMdx('')).toBe('');
  });
});
