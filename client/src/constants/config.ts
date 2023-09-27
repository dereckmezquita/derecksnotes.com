import path from 'path';

// root starts at client/src
export const ROOT = path.join(process.cwd(), 'src');
export const ROOT_PUBLIC: string = path.join(process.cwd());
export const APPLICATION_TITLE = 'derecksnotes.com';
export const APPLICATION_AUTHOR: { first_name: string, last_name: string } = { first_name: 'Dereck', last_name: 'Mezquita' };

// 1 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
export const REFRESH_STORE_DATA_INTERVAL = 1 * 2 * 60 * 60 * 1000;

export const DEFAULT_PROFILE_IMAGE: string = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23ccc' /><text x='50%' y='50%' font-size='40' text-anchor='middle' dy='.3em' fill='%23777'>?</text></svg>";

export const API_PREFIX: string = '/api/v3';