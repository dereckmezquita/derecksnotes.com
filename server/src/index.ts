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
            secure: env.BUILD_ENV !== 'LOCAL', // secure cookies for DEV and PROD
            httpOnly: true,
            maxAge: constants.SESSION_MAX_AGE
        }
    })
);

// Use API_PREFIX from env configuration (already includes trailing slash)
app.use(env.API_PREFIX, routes.auth);
app.use(env.API_PREFIX, routes.comments);
app.use(env.API_PREFIX, routes.profile);
app.use(env.API_PREFIX, routes.test);
// -----

// -----
app.get('/', async (req: Request, res: Response) => {
    const status = await getServerStatus();
    res.json(status);
});

// Add debugging middleware for non-production environments
if (env.BUILD_ENV !== 'PROD') {
    // Log all incoming requests with basic info
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log('Incoming request: ', req.method, req.url);
        next();
    });

    // Add detailed API request logging
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(
            `API Request ${Date.now().toString()}: ${req.method} ${req.url}`
        );
        console.log(`Query params: ${JSON.stringify(req.query)}`);

        // Log request body for non-GET requests if it exists, but redact sensitive data
        if (
            req.method !== 'GET' &&
            req.body &&
            Object.keys(req.body).length > 0
        ) {
            const sensitiveKeys = ['password', 'token', 'secret'];
            const sanitizedBody = { ...req.body };

            sensitiveKeys.forEach((key) => {
                if (key in sanitizedBody) sanitizedBody[key] = '[REDACTED]';
            });

            console.log(`Body: ${JSON.stringify(sanitizedBody, null, 2)}`);
        }
        next();
    });
}

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await db.disconnect();
    process.exit(0);
});

app.listen(env.PORT_SERVER, async () => {
    console.log(`Server running: ${env.BASE_URL_SERVER} 🚀`);
    const status = await getServerStatus();
    console.log(JSON.stringify(status, null, 2));
});
