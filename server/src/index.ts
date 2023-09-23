import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis';
import makeRedisStore from 'connect-redis';

import { connectToDB } from './utils/mongoConnect';
import authRoutes from './routes/authRoutes';

dotenv.config({ path: '../.env' });
const PORT: number = 3001;

// ----------------------------------------
// Setup Redis client and session store
const redis_options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    url: 'redis://localhost:6379',
    legacyMode: true
};

const redisClient = createClient(redis_options);

const redisStore = makeRedisStore(session);
// ----------------------------------------
const app = express();

if (process.env.NODE_ENV === 'development') {
    // assuming frontend on port 3000
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
}

app.use(express.json());


async function main(): Promise<void> {
    await connectToDB();

    // ----------------------------------------
    await redisClient.connect();

    app.use(
        session({
            store: new redisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET || 'secret$%^134', // store secret in env var
            resave: false, // forces session be saved back to the session store, even if the session was never modified during the request
            saveUninitialized: false,
            cookie: {
                secure: false, // process.env.NODE_ENV === 'production', // HTTPS in production
                httpOnly: false, // true, // cookie inaccessible from JavaScript running in the browser
                // days * hours * minutes * seconds * milliseconds
                maxAge: 30 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
            }
        })
    );

    console.log('Ready to accept requests...');

    // ----------------------------------------
    app.use((req, res, next) => {
        console.log('Incoming request:', req.method, req.url);
        next();
    });    

    // ----------------------------------------
    // Routes
    app.use('/api/auth', authRoutes);

    app.get('/api/hello', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main().catch(err => {
    console.error('Error starting server:', err);
});