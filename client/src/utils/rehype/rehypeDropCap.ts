import { Node } from 'unist';

interface DropCapConfig {
    float?: string;
    fontSize?: string;
    fontFamily?: string;
    lineHeight?: string;
    marginRight?: string;
    color?: string;
}

export default function rehypeDropCap(config?: DropCapConfig) {
    return (tree: Node) => {
        // Step 1: Initialize firstParagraphNode
        let firstParagraphNode: Node | null = null;

        // Step 2: Define findFirstParagraphNode function
        const findFirstParagraphNode = (node: Node) => {
            if (firstParagraphNode) return;

            // Check if the current node is a paragraph element and contains text
            if (node.type === 'element' && (node as any).tagName === 'p' && (node as any).children.some((child: any) => child.type === 'text' && child.value.trim() !== '')) {
                firstParagraphNode = node;
                return;
            }
            if ('children' in node) {
                (node.children as Node[]).forEach(findFirstParagraphNode);
            }
        };

        // Step 3: Call findFirstParagraphNode function
        findFirstParagraphNode(tree);

        // Step 4: Check if firstParagraphNode is found
        if (firstParagraphNode) {
            const firstChild = (firstParagraphNode as any).children[0];
            if (firstChild && firstChild.type === 'text') {
                const value = firstChild.value.trim();

                // Step 5: Create dropCapSpan
                const dropCapSpan = {
                    type: 'element',
                    tagName: 'span',
                    properties: {
                        style: `
                            float: ${config?.float ?? 'left'};
                            font-size: ${config?.fontSize ?? '4.75em'};
                            font-family: ${config?.fontFamily ?? 'Georgia, serif'};
                            line-height: ${config?.lineHeight ?? '40px'};
                            margin-right: ${config?.marginRight ?? '0.1em'};
                            color: ${config?.color ?? 'inherit'};
                        `,
                        className: ['dropcap'],
                    },
                    children: [{
                        type: 'text',
                        value: value[0]
                    }]
                };

                // Step 6: Modify firstParagraphNode
                firstChild.value = value.slice(1);
                (firstParagraphNode as any).children.unshift(dropCapSpan);
            }
        }
    };
}