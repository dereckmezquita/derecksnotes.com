import express from 'express';
import { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';

import { db } from './db/DataBase';
import { getServerStatus } from './utils/getServerStatus';
import * as env from './utils/env';
import * as constants from './utils/constants';

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                'http://localhost:3000',
                'https://derecksnotes.com',
                'https://dev.derecksnotes.com'
            ];
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
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

app.get('/', async (req: Request, res: Response) => {
    console.log('Consoling - GET /');
    const status = await getServerStatus();
    res.json(status);
});

if (!env.BUILD_ENV_BOOL) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log('Incoming request: ', req.method, req.url);
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
