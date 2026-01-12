import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './lib/env';

const app = express();

// Middleware
app.use(express.json());

// CORS for local development (Next.js on :3000 calling API on :3001)
if (config.buildEnv === 'local') {
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true
        })
    );
}

// Root endpoint - API info
app.get('/api', (_req: Request, res: Response) => {
    res.json({
        name: 'derecksnotes-api',
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

// Start server
const port = config.port;
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
    console.log(`Environment: ${config.buildEnv}`);
});
