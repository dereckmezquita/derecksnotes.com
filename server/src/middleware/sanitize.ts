/**
 * Basic markdown sanitization.
 * Strips HTML tags from markdown content to prevent XSS.
 * Markdown syntax (**, *, `, ```, etc.) is preserved.
 */
export function sanitizeMarkdown(content: string): string {
    // Strip HTML tags but preserve markdown
    return content.replace(/<[^>]*>/g, '');
}
