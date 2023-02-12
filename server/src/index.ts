import express from 'express';
import rateLimit from 'express-rate-limit';
import { router, initDB } from './modules/routes';
import { MongoClient, ObjectId } from 'mongodb';
import { logger } from './logger';

const port = Number(process.env.PORT) || 3001;
const mongodbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017';

const app = express();

// create a rate limiter for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // time frame 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: 'Too many requests, please try again later.',
});

// apply the rate limiter to all API requests
app.use('/api/', apiLimiter);

app.use(express.json());
app.use(router);

async function start() {
    const client = await MongoClient.connect(mongodbUrl, {
        serverSelectionTimeoutMS: 1000,
    });

    initDB(client);

    app.listen(port, '0.0.0.0', () => {
        logger.info(`Server is up on port: ${port}`);
    });
}

// middleware to log rate limiter status
app.use(function (req, res, next) {
    if (req.route.path === '/api/' && res.statusCode === 429) {
        logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    }

    next();
});

start();
