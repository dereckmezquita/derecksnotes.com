import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this file (client/src/lib/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// File system paths - go up from src/lib to client root
// These can only be used in server-side code (Server Components, API routes, etc.)
export const ROOT_DIR: string = path.resolve(__dirname, '..', '..');
export const ROOT_DIR_SRC: string = path.join(ROOT_DIR, 'src');
export const ROOT_DIR_APP: string = path.join(ROOT_DIR_SRC, 'app');
