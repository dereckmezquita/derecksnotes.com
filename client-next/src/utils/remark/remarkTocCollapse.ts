/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-toc').Options} Options
 */

import { toc } from 'mdast-util-toc'
import { Node } from 'mdast-util-toc/lib'

import { Options } from 'mdast-util-toc'

interface RemarkTocCollapseOptions extends Options {
    heading?: string
}

/**
 * Plugin to generate a Table of Contents (TOC).
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function remarkTocCollapse(options?: RemarkTocCollapseOptions) {
    return (node: Node) => {
        const result = toc(
            node,
            Object.assign({}, options, {
                // options.heading || 'toc|table[ -]of[ -]contents?'
                heading: options?.heading || 'toc|table[ -]of[ -]contents?'
            })
        )

        if (
            result.endIndex === null ||
            result.index === null ||
            result.index === -1 ||
            !result.map
        ) {
            return
        }

        if ("children" in node) {
            // Get the table of content's headings.
            // const summary = node.children[result.index - 1]

            /*
            * Remove the retrieved heading mdast elements from
            * their current location and place them inside the summary element.
            */
            node.children.splice(result.index - 1, 1)

            node.children = [
                ...node.children.slice(0, result.index - 1),
                {
                    type: 'html',
                    value: '<details>'
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
                // ...node.children.slice(result.endIndex)
                // keep all rest of content after toc; don't remove paragraphs without headers
                ...node.children.slice(result.index - 1)
            ]
        }
    }
}