/// <reference types="node" />

declare module 'remark-mdx-to-plain-text';

// Extend styled-components DefaultTheme with our theme type
import { theme } from '@/styles/theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}

// Add support for data-* attributes
declare namespace React {
    interface HTMLAttributes<T> {
        // Add custom data attributes
        'data-title'?: string;
    }
}
