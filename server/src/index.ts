import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis';
import makeRedisStore from 'connect-redis';

import { connectToDB } from './utils/mongoConnect';
import authRoutes from './routes/authRoutes';

dotenv.config({ path: '../.env' });

const app = express();

if (process.env.NODE_ENV === 'development') {
    // assuming your frontend is on port 3000
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
}

app.use(express.json());

const PORT = 3001;

// Setup Redis client and session store
const redis_options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    url: 'redis://localhost:6379'
};
const redisClient = createClient(redis_options);


redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});


const redisStore = makeRedisStore(session);

// Use session middleware
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

connectToDB();

app.use('/api/auth', authRoutes);

app.get('/api/hello', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
