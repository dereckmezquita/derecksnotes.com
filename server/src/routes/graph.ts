import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, requirePermission } from '@middleware/auth';
import { graphLimiter } from '@middleware/rateLimit';
import {
  getGraphData,
  getGraphStats,
  buildGraphIndex,
  isGraphReady
} from '@services/graph';

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

export default router;
