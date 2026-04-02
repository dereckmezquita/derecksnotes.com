import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from '@lib/env';
import { generalLimiter } from '@middleware/rateLimit';
import v1Routes from '@routes/index';
import { db, schema } from '@db/index';
import { buildSearchIndex } from '@services/search';
import * as fs from 'fs';
import * as path from 'path';

// Ensure data directory exists
const dataDir = path.dirname(config.databasePath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Express app
const app = express();

app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(
    cors({
        origin: config.buildEnv === 'local' ? true : config.baseUrl,
        credentials: true
    })
);

app.use('/api', generalLimiter);

// API info
app.get('/api', (_req, res) => {
    res.json({
        name: 'derecksnotes-api',
        version: '6.0.0',
        status: 'ok',
        environment: config.buildEnv
    });
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// v1 routes
app.use('/api/v1', v1Routes);

// Global error handler — never expose stack traces
app.use(
    (
        err: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
    ) => {
        console.error('Unhandled error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
);

// Build search index then start
try {
    buildSearchIndex();
} catch (err) {
    console.error('Failed to build search index:', err);
}

app.listen(config.port, () => {
    console.log(`API server running at http://localhost:${config.port}`);
    console.log(`Environment: ${config.buildEnv}`);
});
