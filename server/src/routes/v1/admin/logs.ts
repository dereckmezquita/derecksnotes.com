import { Router, type Request, type Response } from 'express';
import { authenticate, requirePermission } from '@middleware/auth';
import {
    getLogs,
    getErrorSummaries,
    resolveError,
    unresolveError,
    getLogStats,
    cleanupOldLogs,
    dbLogger
} from '@services/logger';
import type { LogLevel } from '@db/schema/logs';

const router = Router();

// GET /api/v1/admin/logs - Get server logs with filtering
router.get(
    '/',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: Request, res: Response) => {
        try {
            const {
                level,
                source,
                search,
                startDate,
                endDate,
                limit = '50',
                offset = '0'
            } = req.query;

            // Parse level - can be single value or comma-separated
            let parsedLevel: LogLevel | LogLevel[] | undefined;
            if (level) {
                const levels = (level as string).split(',') as LogLevel[];
                parsedLevel = levels.length === 1 ? levels[0] : levels;
            }

            const result = await getLogs({
                level: parsedLevel,
                source: source as string,
                search: search as string,
                startDate: startDate
                    ? new Date(startDate as string)
                    : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string)
            });

            res.json(result);
        } catch (error) {
            dbLogger.error('fetching logs failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Failed to fetch logs' });
        }
    }
);

// GET /api/v1/admin/logs/stats - Get log statistics
router.get(
    '/stats',
    authenticate,
    requirePermission('admin.dashboard'),
    async (_req: Request, res: Response) => {
        try {
            const stats = await getLogStats();
            res.json(stats);
        } catch (error) {
            dbLogger.error('fetching log stats failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Failed to fetch log statistics' });
        }
    }
);

// GET /api/v1/admin/logs/errors - Get error summaries
router.get(
    '/errors',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: Request, res: Response) => {
        try {
            const { resolved, limit = '50', offset = '0' } = req.query;

            const result = await getErrorSummaries({
                resolved:
                    resolved === undefined ? undefined : resolved === 'true',
                limit: parseInt(limit as string),
                offset: parseInt(offset as string)
            });

            res.json(result);
        } catch (error) {
            dbLogger.error('fetching error summaries failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Failed to fetch error summaries' });
        }
    }
);

// POST /api/v1/admin/logs/errors/:id/resolve - Mark error as resolved
router.post(
    '/errors/:id/resolve',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { notes } = req.body;
            const userId = (req as any).user.id;

            await resolveError(id, userId, notes);
            res.json({ success: true });
        } catch (error) {
            dbLogger.error('Error resolving failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Failed to resolve error' });
        }
    }
);

// POST /api/v1/admin/logs/errors/:id/unresolve - Mark error as unresolved
router.post(
    '/errors/:id/unresolve',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await unresolveError(id);
            res.json({ success: true });
        } catch (error) {
            dbLogger.error('Error unresolving failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Failed to unresolve error' });
        }
    }
);

// POST /api/v1/admin/logs/cleanup - Clean up old logs
router.post(
    '/cleanup',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: Request, res: Response) => {
        try {
            const { daysToKeep = 30 } = req.body;
            const deleted = await cleanupOldLogs(daysToKeep);
            res.json({ success: true, deleted });
        } catch (error) {
            dbLogger.error('cleaning up logs failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Failed to clean up logs' });
        }
    }
);

export default router;
