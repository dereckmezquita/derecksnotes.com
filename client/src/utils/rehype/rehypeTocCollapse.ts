import { Plugin } from 'unified';
import { Element } from 'hast';
import { visit } from 'unist-util-visit';

const rehypeTocCollapse: Plugin = () => {
    return (tree) => {
        visit(tree, 'element', (node: Element, index, parent: any) => {
            if (typeof index !== 'number') return;

            if (node.properties?.id === 'table-of-contents') {
                if (!parent || !Array.isArray(parent.children) || index === parent.children.length - 1) return;
                const subsequentNode = parent.children[index + 2];

                if (subsequentNode.tagName === 'ul') {
                    // Remove the original h1 (Table of Contents title)
                    parent.children.splice(index, 1);

                    // Replace the subsequentNode (which is the TOC) with a collapsible element
                    parent.children.splice(index, 1, {
                        type: 'element',
                        tagName: 'details',
                        properties: {},
                        children: [
                            {
                                type: 'element',
                                tagName: 'summary',
                                properties: {},
                                children: [
                                    {
                                        type: 'element',
                                        tagName: 'h2',
                                        properties: {
                                            id: 'table-of-contents',
                                            style: 'display: inline-block; margin: 0px; padding: 0px; padding-bottom: 10px;'
                                        },
                                        children: [{ type: 'text', value: 'Table of contents' }]
                                    }
                                ]
                            },
                            subsequentNode
                        ]
                    });

                    // Remove the original ul TOC
                    parent.children.splice(index + 1, 1);
                }
            }
        });
    };
};

export default rehypeTocCollapse;
