/**
 * Single source of truth for comment markdown rendering. Both <CommentForm>'s
 * preview tab and <CommentItem>'s rendered body call this so the preview
 * cannot drift from what actually gets shown after submit.
 *
 * Earlier the two consumers redeclared the ALLOWED_TAGS list with subtly
 * different contents (the preview omitted sup/sub/table/* that the item
 * allowed), which meant the preview silently lied to the user.
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { linkifyMentions } from '@derecksnotes/shared';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'del',
  'sup',
  'sub',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td'
] as const;

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'] as const;

/**
 * Render raw comment markdown to sanitised HTML. `@username` tokens are
 * rewritten to `[@username](/profile/username)` first so they survive
 * marked + DOMPurify as plain anchors (no raw HTML path).
 *
 * Safe to call from SSR: returns the input untouched when `window` is
 * unavailable (DOMPurify is browser-only). Callers that render in a
 * dangerouslySetInnerHTML should still gate on a mounted check to keep
 * hydration deterministic.
 */
export function renderCommentMarkdown(content: string): string {
  if (typeof window === 'undefined') return '';
  if (!content) return '';
  try {
    const withMentions = linkifyMentions(content);
    const raw = marked.parse(withMentions);
    const html = typeof raw === 'string' ? raw : content;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ALLOWED_TAGS as unknown as string[],
      ALLOWED_ATTR: ALLOWED_ATTR as unknown as string[],
      ALLOW_DATA_ATTR: false
    });
  } catch {
    return DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
  }
}
