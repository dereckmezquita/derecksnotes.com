// this function takes the first a tag link and adds the href to the page for that def
export default function rehypeLinkToDefinition(options: {
    slug: string;
    dictionary: string;
}) {
    return (tree: any) => {
        const { slug, dictionary } = options;

        // Find the first paragraph
        const firstParagraph = tree.children.find(
            (node: any) => node.type === 'element' && node.tagName === 'p'
        );

        if (!firstParagraph) return tree;

        // Find the index of the first a tag within the paragraph's children
        const firstATagIndex = firstParagraph.children.findIndex(
            (node: any) =>
                node.type === 'mdxJsxTextElement' && node.name === 'a'
        );

        if (firstATagIndex === -1) return tree;

        // Extract the first a tag
        const firstATag = firstParagraph.children[firstATagIndex];
        // {
        //     type: 'element',
        //         tagName: 'p',
        //             properties: { },
        //     children: [
        //         {
        //             type: 'mdxJsxTextElement',
        //             name: 'a',
        //             attributes: [Array],
        //             children: [Array],
        //             position: [Object],
        //             data: [Object]
        //         },
        //         {
        //             type: 'text',
        //             value: ' - Extensions of the water-vascular system of echinoderms, protruding from the body and often ending in suckers. May be used for locomotion and/or for maintaining a tight grip on prey or on the bottom.',
        //             position: [Object]
        //         }
        //     ],
        //         position: {
        //         start: { line: 2, column: 1, offset: 1 },
        //         end: { line: 2, column: 233, offset: 233 }
        //     }
        // }

        // Check if the 'attributes' array exists within the anchor tag
        if (!Array.isArray(firstATag.attributes)) {
            firstATag.attributes = [];
        }

        // Find the index of the href attribute, if it exists
        const hrefAttributeIndex = firstATag.attributes.findIndex(
            (attr: any) => attr.name === 'href'
        );

        const newHrefAttribute = {
            type: 'mdxJsxAttribute',
            name: 'href',
            value: `/dictionaries/${dictionary}/${slug}`
        };

        if (hrefAttributeIndex === -1) {
            // If href doesn't exist, push the new attribute to the array
            firstATag.attributes.push(newHrefAttribute);
        } else {
            // If href already exists, replace it with the new value
            firstATag.attributes[hrefAttributeIndex] = newHrefAttribute;
        }

        return tree;
    };
}
