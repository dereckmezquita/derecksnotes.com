/// <reference types="node" />

declare module 'remark-mdx-to-plain-text';

// Add support for data-* attributes
declare namespace React {
    interface HTMLAttributes<T> {
        // Add custom data attributes
        'data-title'?: string;
    }
}
