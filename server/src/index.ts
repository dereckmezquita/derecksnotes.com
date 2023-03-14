import express from 'express';
import session from 'express-session';

import { router, initDB } from './routes';
import { MongoClient } from 'mongodb';
import { logger } from './modules/logger';

import { createClient } from 'redis';
import makeRedisStore from 'connect-redis';

// redis client for managing sessions
const redisClient = createClient({legacyMode: true});

const redisStore = makeRedisStore(session);

const port = Number(process.env.PORT) || 3001;
const mongodbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017';

const app = express();

// TODO: add rate limiter with express for longer term protection (100 requests per day or something)
// use ratelimiter on express side to limit request per day
// nginx is being used for burst and spam protection

// --------------------------------
// middleware
// --------------------------------
app.use(express.json());

// --------------------------------
async function start() {
    await redisClient.connect();
    // Add the express-session middleware
    app.use(
        session({
            store: new redisStore({ client: redisClient }),
            secret: 'temporary-secret', // TODO: load this from ignored module to be secret
            resave: false,
            saveUninitialized: false,
            // days * hours * minutes * seconds * milliseconds
            cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // let's make the session last for 30 days
        })
    );

    app.use(router);

    // middleware to log rate limiter status
    app.use((req, res, next) => {
        if (req.route && req.route.path === '/api/' && res.statusCode === 429) {
            logger.warn(`Rate limit exceeded for IP ${req.ip}`);
        }

        next();
    });

    const client = await MongoClient.connect(mongodbUrl, {
        serverSelectionTimeoutMS: 1000,
    });

    initDB(client);

    app.listen(port, '0.0.0.0', () => {
        logger.info(`Server is up on port: ${port}`);
    });
}

start().catch(console.error);
