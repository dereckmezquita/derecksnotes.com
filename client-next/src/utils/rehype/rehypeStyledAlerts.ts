import { Node } from 'unist';

// markdown input:
// > [!IMPORTANT]
// > Crucial information necessary for users to succeed.

// html output on github.com:
// <div class="markdown-alert markdown-alert-important" dir="auto"><p dir="auto"><span class="color-fg-done text-semibold d-inline-flex flex-items-center mb-1"><svg class="octicon octicon-report mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>Important</span><br>
// Crucial information necessary for users to succeed.</p></div>

// html output on our website without this plugin:
// <blockquote>
//     <p>[!IMPORTANT]
//     Crucial information necessary for users to succeed.</p>
// </blockquote>

export default function rehypeStyledAlerts() {
    return (tree: any) => {
        // Step 1: Define transformation function
        const transformAlerts = (node: { type: string; tagName: string; children: any[]; properties: { style: string; className: string[]; }; }) => {
            if (node.type === 'element' && node.tagName === 'blockquote') {
                // children of blockquote has to be as such
                // [
                //     { type: 'text', value: '\n' },
                //     {
                //         type: 'element',
                //         tagName: 'p',
                //         properties: {},
                //         children: [[Object]],
                //         position: { start: [Object], end: [Object] }
                //     },
                //     { type: 'text', value: '\n' }
                // ]
                if (node.children.length !== 3) return;

                const text = node.children[1].children[0].value;
                let alertType, color, iconPath;

                if (text.startsWith('[!NOTE]')) {
                    alertType = 'Note';
                    color = 'rgb(47, 129, 247)';
                    iconPath = 'path/to/note-icon.svg';
                } else if (text.startsWith('[!IMPORTANT]')) {
                    alertType = 'Important';
                    color = 'rgb(163, 113, 247)';
                    iconPath = 'path/to/important-icon.svg';
                } else if (text.startsWith('[!WARNING]')) {
                    alertType = 'Warning';
                    color = 'rgb(210, 153, 34)';
                    iconPath = 'path/to/warning-icon.svg';
                } else {
                    return;
                }

                // Create the new node
                const newNode = {
                    type: 'element',
                    tagName: 'div',
                    properties: {
                        style: `
                            padding: 1em;
                            margin-bottom: 16px;
                            color: inherit;
                            border-left: .25em solid ${color};
                            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
                            font-size: 16px;
                            line-height: 1.5;
                            word-wrap: break-word;
                        `,
                        className: ['markdown-alert'],
                    },
                    children: [
                        {
                            type: 'element',
                            tagName: 'p',
                            properties: {
                                style: `
                                    display: flex;
                                    align-items: center;
                                    font-weight: bold;
                                    color: ${color};
                                `,
                            },
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'img',
                                    properties: {
                                        src: iconPath,
                                        alt: `${alertType} icon`,
                                        style: `
                                            margin-right: 8px;
                                        `,
                                    },
                                },
                                {
                                    type: 'text',
                                    value: alertType,
                                },
                            ],
                        },
                        {
                            type: 'element',
                            tagName: 'p',
                            children: [
                                {
                                    type: 'text',
                                    value: text.replace(`[!${alertType.toUpperCase()}]`, '').trim(),
                                },
                            ],
                        },
                    ],
                };

                // Replace the old node with the new node
                node.type = newNode.type;
                node.tagName = newNode.tagName;
                node.properties = newNode.properties;
                node.children = newNode.children;
            }

            if ('children' in node) {
                node.children.forEach(transformAlerts);
            }
        };

        // Step 2: Call transformAlerts function
        transformAlerts(tree);
    };
}