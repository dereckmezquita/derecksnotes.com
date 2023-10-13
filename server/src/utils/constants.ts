
export function DATETIME_YYYY_MM_DD_HHMMSS(): string {
    return new Date().toISOString().replace('T', '-').slice(0, 19).replace(/:/g, '');
}

import path from 'path';

export const ROOT_DIR_CLIENT: string = path.join(__dirname, '..', '..', '..', 'client');

export const ROOT_DIR_CLIENT_UPLOADS: string = path.join(ROOT_DIR_CLIENT, 'public', 'site-images', 'uploads', 'profile-photos');

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

// if in prod nginx picks up requests to /api/v3 and forwards to server
export const API_PREFIX: string = process.env.NODE_ENV === 'prod' ? '' : '/api/v3';

export const MAX_COMMENT_DEPTH: number = 5;