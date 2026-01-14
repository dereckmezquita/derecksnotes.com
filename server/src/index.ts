import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from '@lib/env';
import { generalLimiter } from '@middleware/rateLimit';
import { requestLogger, errorLogger } from '@middleware/requestLogger';
import { ensureAdminUser } from '@services/auth';
import { initializeDatabase } from '@db/init';
import v1Router from '@routes/v1';

// Initialize database (runs migrations + seeds if needed)
await initializeDatabase();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin:
        config.buildEnv === 'local'
            ? (
                  origin: string | undefined,
                  callback: (err: Error | null, allow?: boolean) => void
              ) => {
                  // Allow any localhost origin in local development
                  if (!origin || origin.startsWith('http://localhost:')) {
                      callback(null, true);
                  } else {
                      callback(new Error('Not allowed by CORS'));
                  }
              }
            : config.baseUrl,
    credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
app.use('/api', generalLimiter);

// Request logging
app.use(requestLogger);

// Root endpoint - API info
app.get('/api', (_req: Request, res: Response) => {
    res.json({
        name: 'derecksnotes-api',
        version: '1.0.0',
        status: 'ok',
        env: config.buildEnv,
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        env: config.buildEnv,
        timestamp: new Date().toISOString()
    });
});

// API v1 routes
app.use('/api/v1', v1Router);

// 404 handler for API routes
app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});

// Error logging (after routes, before error handler)
app.use(errorLogger);

// Start server
const port = config.port;
app.listen(port, async () => {
    console.log(`API server running at http://localhost:${port}`);
    console.log(`Environment: ${config.buildEnv}`);

    // Ensure admin user is in admin group (if configured and exists)
    await ensureAdminUser();
});
