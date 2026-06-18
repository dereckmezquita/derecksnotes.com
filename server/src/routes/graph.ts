import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, requirePermission } from '@middleware/auth';
import { graphLimiter } from '@middleware/rateLimit';
import {
  getGraphData,
  getGraphStats,
  buildGraphIndex,
  isGraphReady
} from '@services/graph';

// SSE connection caps. Long-lived connections aren't a fit for express-rate-limit
// (which counts requests); track open EventSource connections per user + per IP
// in-process. Values match the security-fix-research-spike doc.
const SSE_MAX_PER_USER = 3;
const SSE_MAX_PER_IP = 10;

const router = Router();

// GET /api/v1/graph — returns graph data with filters
router.get('/', graphLimiter, async (req, res) => {
  try {
    if (!isGraphReady()) {
      res.status(503).json({ error: 'Graph index is still building' });
      return;
    }

    const parsed = z
      .object({
        sections: z.string().optional(),
        depth: z.coerce.number().min(0).max(2).default(2),
        minEdges: z.coerce.number().min(0).default(0),
        edgeTypes: z.string().optional(),
        showDictInternal: z
          .enum(['true', 'false'])
          .default('true')
          .transform((v) => v === 'true'),
        showComments: z
          .enum(['true', 'false'])
          .default('false')
          .transform((v) => v === 'true'),
        showExternal: z
          .enum(['true', 'false'])
          .default('false')
          .transform((v) => v === 'true'),
        search: z.string().max(200).optional(),
        limit: z.coerce.number().min(1).max(10000).default(5000)
      })
      .safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: parsed.error.issues
      });
      return;
    }

    const options = {
      sections: parsed.data.sections
        ? parsed.data.sections.split(',').filter(Boolean)
        : undefined,
      depth: parsed.data.depth,
      minEdges: parsed.data.minEdges,
      edgeTypes: parsed.data.edgeTypes
        ? parsed.data.edgeTypes.split(',').filter(Boolean)
        : undefined,
      showDictInternal: parsed.data.showDictInternal,
      showComments: parsed.data.showComments,
      showExternal: parsed.data.showExternal,
      search: parsed.data.search,
      limit: parsed.data.limit
    };

    const result = getGraphData(options);
    res.json(result);
  } catch (error) {
    console.error('Graph query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/graph/stats — returns summary statistics
router.get('/stats', graphLimiter, async (_req, res) => {
  try {
    if (!isGraphReady()) {
      res.status(503).json({ error: 'Graph index is still building' });
      return;
    }

    const stats = getGraphStats();
    res.json(stats);
  } catch (error) {
    console.error('Graph stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/graph/rebuild — admin only, triggers full rebuild
router.post(
  '/rebuild',
  authenticate(),
  requirePermission('admin.dashboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const start = Date.now();
      buildGraphIndex();
      const duration = Date.now() - start;

      const stats = getGraphStats();
      res.json({
        success: true,
        durationMs: duration,
        stats
      });
    } catch (error) {
      console.error('Graph rebuild error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ============================================================================
// SSE: Live updates for the graph
// ============================================================================

// Store active SSE connections. Track user and IP for cap enforcement.
const sseClients = new Set<{
  res: import('express').Response;
  id: string;
  userId: string;
  ip: string;
}>();

function countByUser(userId: string): number {
  let n = 0;
  for (const c of sseClients) if (c.userId === userId) n++;
  return n;
}

function countByIp(ip: string): number {
  let n = 0;
  for (const c of sseClients) if (c.ip === ip) n++;
  return n;
}

export function notifyGraphClients(event: {
  type: 'comment' | 'reaction' | 'new-post';
  nodeId?: string;
  data: Record<string, unknown>;
}): void {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// GET /api/v1/graph/live — SSE endpoint for real-time updates
// Authenticated, with per-user and per-IP connection caps to prevent fd exhaustion.
router.get('/live', authenticate(), (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const ip = req.ip || 'unknown';

  if (countByUser(userId) >= SSE_MAX_PER_USER) {
    res.status(429).json({
      error: `Too many open live connections (max ${SSE_MAX_PER_USER} per user)`
    });
    return;
  }
  if (countByIp(ip) >= SSE_MAX_PER_IP) {
    res.status(429).json({
      error: `Too many open live connections (max ${SSE_MAX_PER_IP} per IP)`
    });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no' // disable nginx buffering for SSE
  });

  // Send initial keepalive
  res.write(': connected\n\n');

  const client = { res, id: randomUUID(), userId, ip };
  sseClients.add(client);

  // Keepalive every 25 seconds (under common 30s proxy idle timeouts)
  const keepalive = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(keepalive);
      sseClients.delete(client);
    }
  }, 25000);

  const cleanup = () => {
    clearInterval(keepalive);
    sseClients.delete(client);
  };
  req.on('close', cleanup);
  req.on('error', cleanup);
  res.on('error', cleanup);
});

export default router;
