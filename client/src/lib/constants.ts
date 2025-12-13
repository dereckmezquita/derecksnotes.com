import path from 'path';

// File system paths
export const ROOT_DIR: string = process.cwd();
export const ROOT_DIR_SRC: string = path.join(ROOT_DIR, 'src');
export const ROOT_DIR_APP: string = path.join(ROOT_DIR_SRC, 'app');

// Comment settings
export const MAX_COMMENT_DEPTH: number = 5; // Maximum nesting level for comments
export const MAX_COMMENT_LENGTH: number = 5000; // Maximum characters per comment

// Application information
export const APPLICATION_AUTHOR: { first: string; last: string } = {
    first: 'Dereck',
    last: 'Mezquita'
};

export const APPLICATION_DESCRIPTION: string = 'Making sciencing easier.';

// TODO: consider extending or mimicking next meta
// import { Metadata } from 'next';

export interface PageMetadata {
    title: string;
    description: string;
    image: string;
    url: string | undefined;
}

export const APPLICATION_DEFAULT_METADATA: PageMetadata = {
    title: "Dn | Dereck's Notes",
    description: APPLICATION_DESCRIPTION,
    image: '/site-images/card-covers/512-logo.png',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://derecksnotes.com'
};

// UI constants
export const ALPHABET: string[] = 'abcdefghijklmnopqrstuvwxyz#'.split('');

export const DEFAULT_PROFILE_IMAGE: string =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23ccc' /><text x='50%' y='50%' font-size='40' text-anchor='middle' dy='.3em' fill='%23777'>?</text></svg>";
