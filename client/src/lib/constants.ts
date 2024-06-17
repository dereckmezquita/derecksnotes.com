import path from 'path';

export const APPLICATION_AUTHOR: { first: string; last: string } = {
    first: 'Dereck',
    last: 'Mezquita'
};
export const APPLICATION_DESCRIPTION: string = 'Making sciencing easier.';

export const MAX_COMMENT_DEPTH: number = 5;

export const ROOT_DIR: string = process.cwd();
export const ROOT_DIR_SRC: string = path.join(ROOT_DIR, 'src');
export const ROOT_DIR_APP: string = path.join(ROOT_DIR_SRC, 'app');
