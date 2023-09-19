import path from 'path';

// root starts at client/src
export const ROOT = path.join(process.cwd(), 'src');
export const APPLICATION_TITLE = 'derecksnotes.com';
export const APPLICATION_AUTHOR: { first_name: string, last_name: string } = { first_name: 'Dereck', last_name: 'Mezquita' };

export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api';
