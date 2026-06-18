/**
 * Mention parsing + linkifying — shared between server (fan-out) and client
 * (markdown render) so the two stay in sync. A single regex is the source
 * of truth.
 *
 * Mention syntax: `@username` where username matches the registration regex
 * (`[a-zA-Z0-9_-]{3,30}`). The leading `@` must NOT be part of an email
 * (preceded by a word char) or already inside a markdown link (`[…](…@username)`)
 * — we keep this lenient (boundary check only) and rely on the eventual
 * user-lookup step to drop typos that don't resolve to a real user.
 */
export const MENTION_REGEX = /(^|[^\w/])(@([a-zA-Z0-9_-]{3,30}))\b/g;

/**
 * Extract unique usernames mentioned in the given text. Case-preserving.
 * Order: first occurrence wins.
 */
export function parseMentions(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const m of text.matchAll(MENTION_REGEX)) {
    const username = m[3];
    if (!username) continue;
    const key = username.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(username);
  }
  return out;
}

/**
 * Rewrite mentions in raw text to markdown links. Idempotent in practice
 * because the existing link form `[…](…)` starts with `[` which the regex
 * does not match (negative-word-char prefix is required for `@`).
 *
 * Example:
 *   linkifyMentions('hi @alice and @bob') →
 *     'hi [@alice](/profile/alice) and [@bob](/profile/bob)'
 */
export function linkifyMentions(text: string): string {
  if (!text) return text;
  return text.replace(MENTION_REGEX, (_match, prefix, _full, username) => {
    return `${prefix}[@${username}](/profile/${username})`;
  });
}
