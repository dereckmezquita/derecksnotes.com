// https://github.com/ShuntaH/remark-toc-collapse/blob/main/index.js
import { toc, Options as TocOptions } from 'mdast-util-toc';
import { Root } from 'mdast';
import { Node } from 'mdast-util-toc/lib'
import { Plugin } from 'unified';

interface RemarkTocOptions extends TocOptions {
    heading?: string;
}

/**
  * Plugin to generate a Table of Contents (TOC); does not remove leading paragraphs without headers.
 */
const remarkToc: Plugin<[(RemarkTocOptions | undefined)?], Root> = (options = {}) => {
    return (node: Node) => {
        const result = toc(
            node as Root,
            Object.assign({}, options, {
                heading: options.heading || 'toc|table[ -]of[ -]contents?',
                tight: true,
                maxDepth: 10
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

        // converted from remarkTocCollapse
        // I don't want remarkToc to remove leading paragraphs with no headers
        if ('children' in node) {
            node.children = [
                ...node.children.slice(0, result.index),
 
                result.map,
               
                ...node.children.slice(result.index)
            ];
        }
    };
};

export default remarkToc;