import rateLimit from 'express-rate-limit';

// General API rate limit
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window
    message: {
        error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Limit for comment creation
export const commentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 comments per minute
    message: { error: 'Too many comments, please slow down' },
    standardHeaders: true,
    legacyHeaders: false
});

// Limit for report creation
export const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 reports per hour
    message: { error: 'Too many reports, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
});
