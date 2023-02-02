import express from 'express';
import rateLimit from 'express-rate-limit';
import { router, initDB } from './modules/routes';
import { MongoClient, ObjectId } from 'mongodb';

const port: number = 3001;
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

// serve static files from public directory; temp will remove for serving with nginx
// app.use(express.static(path.join(__dirname, '..', '..', 'client/public')));

new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1000 }).connect().then(client => {
    initDB(client);

    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is up on port: ${port}`);
        // console.log(`Visit: http://localhost:${port}/index.html`);
    });
});

// middleware to log rate limiter status
app.use(function(req, res, next) {
    if (req.route.path === '/api/' && res.statusCode === 429) {
        console.log(`Rate limit exceeded for IP ${req.ip}`);
    }

    next();
});
