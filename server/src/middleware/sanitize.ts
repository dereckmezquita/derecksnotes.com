/**
 * Server-side markdown sanitization.
 * Strips all HTML tags to prevent stored XSS.
 * Markdown syntax (**, *, `, ```, etc.) is preserved.
 * Client-side rendering uses DOMPurify for output sanitization.
 */
export function sanitizeMarkdown(content: string): string {
  // Strip HTML tags
  let sanitized = content.replace(/<[^>]*>/g, '');

  // Strip javascript: protocol in markdown links
  sanitized = sanitized.replace(
    /\[([^\]]*)\]\(javascript:[^)]*\)/gi,
    '[$1](removed)'
  );

  // Strip data: protocol in markdown links (except data:image for small inline images)
  sanitized = sanitized.replace(
    /\[([^\]]*)\]\(data:(?!image)[^)]*\)/gi,
    '[$1](removed)'
  );

  // Strip on* event handlers that might survive in markdown
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');

  // Limit content length (belt and suspenders — zod already validates but this catches edge cases)
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized.trim();
}
