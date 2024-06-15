import fs from 'fs';
import path from 'path';

import express from 'express';
import { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

// import { db } from './db/DataBase';
import * as env from './utils/env';
import * as constants from './utils/constants';

const VERSION: string = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
).version;

const app = express();

app.use(express.json());
app.use(cors());

// const redisClient = new Redis(env.REDIS_URI);

// Express server setup
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// app.use(
//     session({
//         store: new RedisStore({ client: redisClient }),
//         secret: env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             secure: env.BUILD_ENV_BOOL, // only set cookies over https in prod
//             httpOnly: true,
//             maxAge: constants.SESSION_MAX_AGE
//         }
//     })
// );

// mount routes

// ---

app.get('/', (req: Request, res: Response) => {
    res.json({
        ok: true,
        msg: `Build - ${env.BUILD_ENV}: ${VERSION}`,
        datetime: new Date().toISOString()
    });
});

const port: string = env.EXPRESS_PORT;

if (!env.BUILD_ENV_BOOL) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log('Incoming request: ', req.method, req.url);
        next();
    });
}

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    // await db.disconnect();
    process.exit(0);
});

app.listen(port, async () => {
    console.log(`Server running: ${env.API_URL} 🚀`);
});
