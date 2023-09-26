
export function DATETIME_YYYY_MM_DD_HHMMSS(): string {
    return new Date().toISOString().replace('T', '-').slice(0, 19).replace(/:/g, '');
}

import path from 'path';

export const ROOT_DIR_CLIENT: string = path.join(__dirname, '..', '..', '..', 'client');

export const ROOT_DIR_CLIENT_UPLOADS: string = path.join(ROOT_DIR_CLIENT, 'public', 'site-images', 'uploads', 'profile-photos');
