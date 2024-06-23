import path from 'path';

export const ROOT_DIR: string = process.cwd();
export const ROOT_DIR_SRC: string = path.join(ROOT_DIR, 'src');
export const ROOT_DIR_APP: string = path.join(ROOT_DIR_SRC, 'app');
export const MAX_COMMENT_DEPTH: number = 5;

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
    title: 'Dn | Blog',
    description: APPLICATION_DESCRIPTION,
    image: '/site-images/card-covers/512-logo.png',
    url: process.env.NEXT_PUBLIC_APP_URL
};

export const ALPHABET: string[] = 'abcdefghijklmnopqrstuvwxyz#'.split('');
