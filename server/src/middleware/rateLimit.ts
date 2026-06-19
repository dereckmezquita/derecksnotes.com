import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' }
});

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many comments, please slow down' }
});

export const reactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many reactions, please slow down' }
});

export const editLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many edits, please slow down' }
});

export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many search requests, please slow down' }
});

export const graphLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many graph requests, please slow down' }
});

export const profileLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many profile changes, please try again later' }
});

// Password-change is bcrypt cost 12 = ~100 ms CPU per attempt. Without a
// limiter, the route is a soft CPU-pin DoS vector for any authenticated user.
export const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password change attempts, try again later' }
});

// Account deletion is irreversible at the API level (soft-delete + revoke
// sessions). Low ceiling to bound abuse via stolen cookies.
export const accountDeleteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many account-deletion attempts' }
});

// Bulk operations are O(n) DB writes; cap concurrent bursts.
export const bulkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many bulk operations, please slow down' }
});

// Admin writes are by definition rare. Keep generous but bounded so a
// runaway script can't flatten the moderation queue.
export const adminWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many admin requests, please slow down' }
});

// Reports fan a notification to every admin + moderator on every call —
// a tight cap protects the moderator inbox from spam. Honest users report
// a comment maybe a few times an hour at most.
export const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many reports submitted recently, please slow down' }
});

// Read-history writes fire on every post-scroll throttle tick; this limit
// is a backstop, not the primary defence (the client throttles to 4s).
export const readProgressLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many reading-progress updates, please slow down' }
});
