export default function rehypeInsertAnchorTag(options: any, dictionary: string) {
    return (tree: any) => {
        const { frontmatter, slug } = options;

        // Find the first paragraph
        const firstParagraph = tree.children.find(
            (node: any) => node.type === "element" && node.tagName === "p"
        );

        // If the first paragraph is found, prepend an anchor tag with the word
        if (firstParagraph) {
            const anchor = {
                type: "element",
                tagName: "a",
                properties: {
                    id: frontmatter.word,
                    href: `dictionaries/${dictionary}/${slug}`,
                },
                children: [{ type: "text", value: frontmatter.word }],
            };

            const spacer = {
                type: "element",
                tagName: "span",
                children: [{ type: "text", value: ": " }],
            }

            // Insert the anchor tag at the beginning of the first paragraph
            firstParagraph.children.unshift(spacer);
            firstParagraph.children.unshift(anchor);
        }

        return tree;
    };
}