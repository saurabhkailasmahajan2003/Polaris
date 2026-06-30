import { Router } from 'express';
import Archive from '../models/Archive.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, verdict, agent, search, limit = 50, skip = 0 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (verdict) filter.verdict = verdict;
    if (agent) filter.participatingAgents = agent;
    if (search) filter.$text = { $search: search };

    const archives = await Archive.find(filter)
      .sort({ completedAt: -1 })
      .skip(parseInt(skip, 10))
      .limit(parseInt(limit, 10));

    const total = await Archive.countDocuments(filter);
    res.json({ archives, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
