import { Plugin } from 'unified';
import { Element } from 'hast';
import { visit } from 'unist-util-visit';

const rehypeTocCollapse: Plugin = () => {
    return (tree) => {
        // we want to visit nav element that has class toc
        visit(tree, 'element', (node: Element, index, parent: any) => {
            if (node.tagName === 'nav' && node.properties && node.properties.className && (node.properties.className as string[]).includes('toc')) {
                if (!parent || !Array.isArray(parent.children)) return;

                // Replace the TOC with a collapsible element
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
                                        style: 'display: inline-block; margin: 0px; padding: 0px; padding-bottom: 15px;'
                                    },
                                    children: [{ type: 'text', value: 'Table of Contents' }]
                                }
                            ]
                        },
                        node,
                    ]
                });
            }
        });
    };
};

export default rehypeTocCollapse;
