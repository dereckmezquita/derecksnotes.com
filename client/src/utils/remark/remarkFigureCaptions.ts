// https://github.com/Microflash/remark-figure-caption
import { Node } from "unist";
import { visit } from "unist-util-visit";
import { whitespace } from "hast-util-whitespace";
import { fromMarkdown } from "mdast-util-from-markdown";

interface Options {
    figureClassName?: string;
    imageClassName?: string;
    captionClassName?: string;
}

// This is a remark plugin to convert markdown image tags to figure captions.
export default function remarkFigureCaption(options: Options = {}): (tree: Node) => void {
    return (tree) => {
        // Unwrap images inside paragraphs. If a paragraph only contains images (and optional whitespace), 
        // then those images are moved up one level, effectively "unwrapping" them from the paragraph.
        visit(tree, "paragraph", (node: any, index, parent) => {
            if (node.children.every((child: any) => child.type === "image" || whitespace(child))) {
                parent.children.splice(index, 1, ...node.children);
                return [(visit as any).SKIP, index];
            }
        });

        // Wrap standalone image nodes in figure elements.
        visit(tree, node => isImageWithAlt(node), (node, index, parent) => {
            if (!isImageWithCaption(parent) && !isImageLink(parent)) {
                const figure = createNodes(node, options);
                node.type = figure.type;
                (node as any).children = figure.children;
                node.data = figure.data;
            }
        });
    };
}

const createNodes = (imageNode: any, options: Options) => {
    let figChildren;
    try {
        figChildren = fromMarkdown(imageNode.alt).children.flatMap((node: any) => node.children);
    } catch {
        console.log(`Failed to parse image alt-text as markdown - using raw value as fallback: ${imageNode.alt}`);
        figChildren = [{ type: "text", value: imageNode.alt }];
    }

    return {
        type: "figure",
        children: [getImageNodeWithClasses(imageNode, options.imageClassName), {
            type: "figcaption",
            children: figChildren,
            data: {
                hName: "figcaption",
                ...getClassProp(options.captionClassName)
            }
        }],
        data: {
            hName: "figure",
            ...getClassProp(options.figureClassName)
        }
    };
};

const isImageWithAlt = (node: any) => node.type === "image" && Boolean(node.alt) && Boolean(node.url);

const isImageWithCaption = (parent: any) => parent.type === "figure" && parent.children.some((child: any) => child.type === "figcaption");

const isImageLink = (parent: any) => parent.type === "link";

const getClassProp = (className?: string) => className ? { hProperties: { class: [className] } } : {};

const getImageNodeWithClasses = (node: any, className?: string) => {
    if (node.type !== "html") {
        return { ...node, data: { ...getClassProp(className) } };
    }

    const classRegex = /\sclass="(.*?)"\s/gi;
    const hasClass = classRegex.exec(node.value);
    if (className) {
        return hasClass 
            ? { ...node, value: node.value.replace(classRegex, ` class="$1 ${className}" `) } 
            : { ...node, value: node.value.replace(/<img\s/, `<img class="${className}" `) };
    }

    return node;
};
