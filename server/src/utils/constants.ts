import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

export function DATETIME_YYYY_MM_DD_HHMMSS(): string {
    return new Date()
        .toISOString()
        .replace('T', '-')
        .slice(0, 19)
        .replace(/:/g, '');
}

export const ROOT_DIR_CLIENT: string = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'client'
);

export const ROOT_DIR_CLIENT_UPLOADS: string = path.join(
    ROOT_DIR_CLIENT,
    process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? 'public' : 'out',
    'site-images',
    'uploads',
    'profile-photos'
);

// if ROOT_DIR_CLIENT_UPLOADS does not exist, create it; do it recursively
if (!fs.existsSync(ROOT_DIR_CLIENT_UPLOADS)) {
    fs.mkdirSync(ROOT_DIR_CLIENT_UPLOADS, { recursive: true });
}

// if in prod nginx picks up requests to /api/v3 and forwards to server
export const API_PREFIX: string = ''; // process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? '/api/v3' : '';

export const MAX_COMMENT_DEPTH: number = 5;
