import express from 'express';
import { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';

import { db } from './db/DataBase';
import { getServerStatus } from './utils/getServerStatus';
import * as env from './utils/env';
import * as constants from './utils/constants';

import * as routes from './routes';

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin, such as those from server-side clients (adjust if needed)
            if (!origin) {
                return callback(null, true);
            }

            try {
                const url = new URL(origin);

                // Allow exact derecksnotes.com or any of its subdomains
                if (
                    url.hostname === 'derecksnotes.com' ||
                    url.hostname.endsWith('.derecksnotes.com') ||
                    url.hostname === 'localhost'
                ) {
                    return callback(null, true);
                }
            } catch (err) {
                return callback(new Error('Not allowed by CORS'));
            }

            // If the hostname doesn’t match your criteria, reject the request
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    })
);

app.use(
    session({
        store: new RedisStore({ client: db.redis }),
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: env.BUILD_ENV_BOOL, // only set cookies over https in prod
            httpOnly: true,
            maxAge: constants.SESSION_MAX_AGE
        }
    })
);

// -----
app.get('/', async (req: Request, res: Response) => {
    const status = await getServerStatus();
    res.json(status);
});

// Mount routes based on environment
if (env.BUILD_ENV === 'PROD') {
    // In production, mount routes under /api to match client requests
    app.use('/api', routes.auth);
    app.use('/api', routes.comments);
    app.use('/api', routes.profile);
    app.use('/api', routes.test);

    // Also add status endpoint at /api
    app.get('/api', async (req: Request, res: Response) => {
        const status = await getServerStatus();
        res.json(status);
    });
} else {
    // In development, mount at root for compatibility with Next.js rewrites
    app.use('/', routes.auth);
    app.use('/', routes.comments);
    app.use('/', routes.profile);
    app.use('/', routes.test);
}
// -----

// Add debugging middleware
if (!env.BUILD_ENV_BOOL) {
    // Log all incoming requests with basic info
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log('Incoming request: ', req.method, req.url);
        next();
    });

    // Add detailed API request logging
    app.use('/api', (req: Request, res: Response, next: NextFunction) => {
        console.log(`API Request: ${req.method} ${req.url}`);
        console.log(`Query params: ${JSON.stringify(req.query)}`);
        if (req.body && Object.keys(req.body).length > 0) {
            console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
        }
        next();
    });
}

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await db.disconnect();
    process.exit(0);
});

app.listen(env.EXPRESS_PORT, async () => {
    console.log(`Server running: ${env.API_URL} 🚀`);
    const status = await getServerStatus();
    console.log(status);
});
