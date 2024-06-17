import { Session } from 'express-session';

export {};

declare module 'express-session' {
    interface Session {
        userId?: string;
    }
}

// globally extending the request object
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
