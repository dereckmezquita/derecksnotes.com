import { Router } from 'express';
import { z } from 'zod';
import { searchLimiter } from '@middleware/rateLimit';
import { searchContent, isIndexReady } from '@services/search';

const router = Router();

router.get('/', searchLimiter, async (req, res) => {
  try {
    const parsed = z
      .object({
        q: z.string().min(1).max(200),
        limit: z.coerce.number().min(1).max(50).default(10)
      })
      .safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid search query' });
      return;
    }

    if (!isIndexReady()) {
      res.status(503).json({ error: 'Search index is still building' });
      return;
    }

    const result = searchContent(parsed.data.q, parsed.data.limit);
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
