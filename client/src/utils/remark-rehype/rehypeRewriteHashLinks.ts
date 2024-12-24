// rehypeRewriteHashLinks.ts
import { visit } from 'unist-util-visit';

interface RewriteHashLinksOptions {
    dictionary: string;
    wordToSlugMap: Record<string, string>; // e.g. { "Hydrogen": "hydrogen_mdx_filename", ... }
}

export default function rehypeRewriteHashLinks(
    options: RewriteHashLinksOptions
) {
    const { dictionary, wordToSlugMap } = options;

    return function transformer(tree: any) {
        visit(tree, 'element', (node) => {
            if (
                node.tagName === 'a' &&
                node.properties?.href?.startsWith('#')
            ) {
                const word = node.properties.href.slice(1); // e.g. "#Hydrogen" -> "Hydrogen"
                const targetSlug = wordToSlugMap[word];
                if (targetSlug) {
                    // Found a matching slug for that word
                    node.properties.href = `/dictionaries/${dictionary}/${targetSlug}`;
                } else {
                    // If we want to do something else if not found, e.g. remove link
                    // node.tagName = 'span'; // or leave it alone
                }
            }
        });
        return tree;
    };
}
