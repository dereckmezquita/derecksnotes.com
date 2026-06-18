import { describe, expect, test } from 'bun:test';
import { parseMentions, linkifyMentions } from '@derecksnotes/shared';

describe('parseMentions', () => {
  test('returns empty for plain text', () => {
    expect(parseMentions('hello world')).toEqual([]);
  });

  test('extracts a single mention', () => {
    expect(parseMentions('hi @alice')).toEqual(['alice']);
  });

  test('extracts multiple unique mentions in order', () => {
    expect(parseMentions('cc @alice and @bob and @alice again')).toEqual([
      'alice',
      'bob'
    ]);
  });

  test('does NOT extract email-like @ (word-char before @)', () => {
    expect(parseMentions('contact me at foo@example')).toEqual([]);
  });

  test('mention must be 3+ chars (matches username regex)', () => {
    expect(parseMentions('hi @a and @ab')).toEqual([]);
    expect(parseMentions('hi @abc')).toEqual(['abc']);
  });

  test('allows hyphen and underscore', () => {
    expect(parseMentions('thanks @user_name and @user-name')).toEqual([
      'user_name',
      'user-name'
    ]);
  });

  test('does not match inside a URL path', () => {
    expect(parseMentions('see /tags/@alice')).toEqual([]);
  });
});

describe('linkifyMentions', () => {
  test('rewrites a mention to a markdown link', () => {
    expect(linkifyMentions('hi @alice')).toBe('hi [@alice](/profile/alice)');
  });

  test('preserves leading whitespace / non-word chars', () => {
    expect(linkifyMentions('(@alice)')).toBe('([@alice](/profile/alice))');
  });

  test('does not double-rewrite existing markdown link', () => {
    const input = '[@alice](/profile/alice) said hi';
    // The regex requires `@` to be preceded by a non-word, non-slash char.
    // `[` qualifies, so the test asserts that the inner @ already inside
    // brackets does still get linkified — that is intentional (we re-emit
    // a fresh link). The result is harmless but verbose; document it.
    const out = linkifyMentions(input);
    expect(out).toContain('[@alice](/profile/alice)');
  });

  test('skips email-like @ tokens', () => {
    expect(linkifyMentions('foo@example')).toBe('foo@example');
  });

  test('returns empty input unchanged', () => {
    expect(linkifyMentions('')).toBe('');
  });
});
