import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger, persistLog } from '../services/logger';

// Generate unique request ID
function generateRequestId(): string {
    return crypto.randomUUID().split('-')[0];
}

// Middleware to log all requests
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const requestId = generateRequestId();
    const startTime = Date.now();

    // Attach request ID to the request object
    (req as any).requestId = requestId;

    // Log request start (only for non-health-check endpoints)
    const isHealthCheck = req.path === '/api/health' || req.path === '/api';

    // Capture response
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
        const duration = Date.now() - startTime;
        const userId = (req as any).user?.id;

        // Don't log health checks or successful GET requests to avoid noise
        const shouldLog =
            !isHealthCheck &&
            (res.statusCode >= 400 || req.method !== 'GET' || duration > 1000);

        if (shouldLog) {
            const logContext = {
                requestId,
                userId,
                path: req.path,
                method: req.method,
                statusCode: res.statusCode,
                duration,
                ipAddress: req.ip || req.socket.remoteAddress,
                userAgent: req.get('user-agent')
            };

            const message = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;

            if (res.statusCode >= 500) {
                logger.error(logContext, message);
                // Persist server errors to database
                persistLog({
                    level: 'error',
                    message,
                    source: 'api',
                    context: logContext,
                    userId,
                    requestId,
                    ipAddress: req.ip || req.socket.remoteAddress,
                    userAgent: req.get('user-agent'),
                    path: req.path,
                    method: req.method,
                    statusCode: res.statusCode,
                    duration
                });
            } else if (res.statusCode >= 400) {
                logger.warn(logContext, message);
                // Persist client errors to database for monitoring
                persistLog({
                    level: 'warn',
                    message,
                    source: 'api',
                    context: logContext,
                    userId,
                    requestId,
                    ipAddress: req.ip || req.socket.remoteAddress,
                    userAgent: req.get('user-agent'),
                    path: req.path,
                    method: req.method,
                    statusCode: res.statusCode,
                    duration
                });
            } else {
                logger.info(logContext, message);
            }
        }

        return originalJson(body);
    };

    next();
}

// Error logging middleware - use after routes
export function errorLogger(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const requestId = (req as any).requestId || 'unknown';
    const userId = (req as any).user?.id;

    const logContext = {
        requestId,
        userId,
        path: req.path,
        method: req.method,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        err
    };

    logger.error(logContext, `Unhandled error: ${err.message}`);

    // Persist unhandled errors to database
    persistLog({
        level: 'error',
        message: `Unhandled error: ${err.message}`,
        source: 'error-handler',
        context: { requestId, userId, path: req.path, method: req.method },
        stack: err.stack,
        userId,
        requestId,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        path: req.path,
        method: req.method
    });

    next(err);
}
