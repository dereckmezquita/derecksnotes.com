"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = require("./modules/routes");
const mongodb_1 = require("mongodb");
const port = 3001;
const app = (0, express_1.default)();
// create a rate limiter for API endpoints
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many requests, please try again later.',
});
// apply the rate limiter to all API requests
app.use('/api/', apiLimiter);
app.use(express_1.default.json());
app.use(routes_1.router);
// serve static files from public directory; temp will remove for serving with nginx
// app.use(express.static(path.join(__dirname, '..', '..', 'client/public')));
new mongodb_1.MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1000 }).connect().then(client => {
    (0, routes_1.initDB)(client);
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is up on port: ${port}`);
        // console.log(`Visit: http://localhost:${port}/index.html`);
    });
});
// middleware to log rate limiter status
app.use(function (req, res, next) {
    if (req.route.path === '/api/' && res.statusCode === 429) {
        console.log(`Rate limit exceeded for IP ${req.ip}`);
    }
    next();
});
