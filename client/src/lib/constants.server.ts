import path from 'path';

// File system paths for server-side code (Server Components, API routes, etc.)
// Use process.cwd() as the base - works in both dev and standalone production mode
// In dev: cwd is /client
// In Docker standalone: cwd is /app/client (we run `node server.js` from there)
export const ROOT_DIR: string = process.cwd();
export const ROOT_DIR_SRC: string = path.join(ROOT_DIR, 'src');
export const ROOT_DIR_APP: string = path.join(ROOT_DIR_SRC, 'app');
