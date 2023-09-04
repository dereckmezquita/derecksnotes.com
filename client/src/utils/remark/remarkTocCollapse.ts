// https://github.com/ShuntaH/remark-toc-collapse/blob/main/index.js
import { toc, Options as TocOptions } from 'mdast-util-toc';
import { Root } from 'mdast';
import { Node } from 'mdast-util-toc/lib'
import { Plugin } from 'unified';

interface RemarkTocCollapseOptions extends TocOptions {
    heading?: string;
}

/**
 * Plugin to generate a Table of Contents (TOC).
 */
const remarkTocCollapse: Plugin<[(RemarkTocCollapseOptions | undefined)?], Root> = (options = {}) => {
    return (node: Node) => {
        const result = toc(
            node as Root,
            Object.assign({}, options, {
                heading: options.heading || 'toc|table[ -]of[ -]contents?'
            })
        );

        if (
            result.endIndex === null ||
            result.index === null ||
            result.index === -1 ||
            !result.map
        ) {
            return;
        }

        if ('children' in node) {
            node.children.splice(result.index - 1, 1);

            node.children = [
                ...node.children.slice(0, result.index - 1),
                {
                    type: 'html',
                    value: `<details style="padding-bottom: 15px;">`
                },
                {
                    type: 'html',
                    value: '<summary>'
                },
                {
                    type: 'html',
                    value: `
                        <h3 id="table-of-contents" style="display: inline-block; margin: 0px; padding: 0px; padding-bottom: 15px;">
                            Table of Contents
                        </h3>
                    `
                },
                {
                    type: 'html',
                    value: '</summary>'
                },
                result.map,
                {
                    type: 'html',
                    value: '</details>'
                },
                ...node.children.slice(result.index - 1)
            ];
        }
    };
};

export default remarkTocCollapse;