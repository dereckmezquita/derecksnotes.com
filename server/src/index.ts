import 'module-alias/register'; // allow for @ imports

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis';
import makeRedisStore from 'connect-redis';

import { authRoutes, uploadRoutes, interactRoutes } from './routes/index';
import { API_PREFIX } from '@utils/constants';
import { DatabaseConnector, MongoDBConnector } from '@utils/DatabaseConnector';

dotenv.config({ path: '../.env' });
const PORT: number = 3003;

// ----------------------------------------
// Setup Redis client and session store
export const redis_options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    url: 'redis://localhost:6379',
    legacyMode: true
};

export const redisClient = createClient(redis_options);

const redisStore = makeRedisStore(session);
// ----------------------------------------
export const app = express();

if (process.env.DEV_MODE === 'true') {
    // assuming frontend on port 3000
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
    console.log('CORS enabled for localhost:3000');
}

app.use(express.json());


export async function SetUp(dbConnector: DatabaseConnector): Promise<void> {
    await dbConnector.connect();

    // ----------------------------------------
    await redisClient.connect();

    app.use(
        session({
            store: new redisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET || 'secret$%^134', // store secret in env var
            resave: false, // forces session be saved back to the session store, even if the session was never modified during the request
            saveUninitialized: false,
            cookie: {
                secure: !(process.env.DEV_MODE === 'true'), // HTTPS in production
                httpOnly: false, // true, // cookie inaccessible from JavaScript running in the browser
                // days * hours * minutes * seconds * milliseconds
                maxAge: 30 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
            }
        })
    );

    // ----------------------------------------
    app.use((req, res, next) => {
        console.log('Incoming request:', req.method, req.url);
        next();
    });

    // ----------------------------------------
    // Routes
    app.use(API_PREFIX + '/auth', authRoutes);

    app.use(API_PREFIX + '/upload', uploadRoutes);

    app.use(API_PREFIX + '/interact', interactRoutes);

    app.get(API_PREFIX + '/hello', (req, res) => {
        res.send('Hello World!');
    });
}

export async function main(): Promise<void> {
    // const uri: string = process.env.MONGO_URI + (process.env.DEV_MODE ? 'derecksnotes_test' : 'derecksnotes');
    const uri: string = process.env.MONGO_URI + 'derecksnotes_test'; // running next.derecksnotes.com test server so hard coded
    const dbConnector = new MongoDBConnector(uri);
    console.log(`Connecting to MongoDB at ${uri}`);

    await SetUp(dbConnector);

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
        let API_LISTENING_ON: string = process.env.DEV_MODE === 'true' ? 'http://localhost:3003' : 'https://derecksnotes.com';
        console.log(`API listening on ${API_LISTENING_ON + API_PREFIX}`);
    });
}

if (require.main === module) {
    main().catch(err => {
        console.error('Error starting server:', err);
    });
}

export default app;