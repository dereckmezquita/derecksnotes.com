import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './lib/env';
import { generalLimiter } from './middleware/rateLimit';
import v1Router from './routes/v1';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin:
        config.buildEnv === 'local' ? 'http://localhost:3000' : config.baseUrl,
    credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
app.use('/api', generalLimiter);

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

// Start server
const port = config.port;
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
    console.log(`Environment: ${config.buildEnv}`);
});
