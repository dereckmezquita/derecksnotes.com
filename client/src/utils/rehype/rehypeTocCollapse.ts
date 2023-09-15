import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';
import { Element, Parent, Text } from 'hast';

const isTableOfContentsHeading = (node: Element): boolean => {
    return (
        /^h[1-6]$/i.test(node.tagName) &&
        node.children.some(
            (child) => child.type === 'text' && /Table of Contents/i.test((child as Text).value)
        )
    );
};

const rehypeTocCollapse: Plugin = () => {
    return (tree) => {
        visit(tree, 'element', (node: Element, index, parent: any) => {
            if (isTableOfContentsHeading(node)) {
                const detailsNode: Element = {
                    type: 'element',
                    tagName: 'details',
                    properties: {
                        style: 'padding-bottom: 15px;'
                    },
                    children: []
                };

                const summaryNode: Element = {
                    type: 'element',
                    tagName: 'summary',
                    children: [
                        {
                            type: 'element',
                            tagName: 'h3',
                            properties: {
                                style: 'display: inline-block; margin: 0px; padding: 0px; padding-bottom: 15px;'
                            },
                            children: [
                                {
                                    type: 'text',
                                    value: 'Table of Contents'
                                }
                            ]
                        }
                    ]
                };

                detailsNode.children.push(summaryNode);

                const tocIndex = parent.children.indexOf(node);
                if (tocIndex !== -1) {
                    parent.children.splice(tocIndex, 1, detailsNode);
                    detailsNode.children.push(...parent.children.splice(tocIndex + 1));
                }
            }
        });
    };
};

export default rehypeTocCollapse;
