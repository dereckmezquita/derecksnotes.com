import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import { visit } from 'unist-util-visit';

/**
 * Extract a plain text summary from MDX content.
 * Parses the MDX, extracts paragraph text, and returns a cleaned summary.
 *
 * @param content - The MDX content string (without frontmatter)
 * @param maxLength - Maximum length of the summary (default: 300)
 * @returns Plain text summary string
 */
export function extractSummaryFromMdx(
    content: string,
    maxLength: number = 300
): string {
    try {
        const parsedContent = remark()
            .use(remarkGfm)
            .use(remarkMath)
            .use(mdx)
            .use(strip)
            .parse(content);

        const paragraphs: string[] = [];
        visit(parsedContent, 'paragraph', (node: any) => {
            const textContent = node.children
                .map((child: any) => child.value?.trim() || '')
                .join('');

            if (textContent.trim() !== '') {
                paragraphs.push(textContent);
            }
        });

        const summary = remark()
            .processSync(paragraphs.join(' '))
            .toString()
            .trim();

        if (maxLength > 0 && summary.length > maxLength) {
            return summary.substring(0, maxLength) + '...';
        }

        return summary;
    } catch {
        return '';
    }
}
