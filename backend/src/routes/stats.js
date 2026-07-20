import { Router } from 'express';
import Event from '../models/Event.js';
import Case from '../models/Case.js';
import Verdict from '../models/Verdict.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [totalEvents, activeCases, completedVerdicts] = await Promise.all([
      Event.countDocuments(),
      Case.countDocuments({ status: { $in: ['pending', 'processing'] } }),
      Verdict.countDocuments(),
    ]);
    res.json({ totalEvents, activeCases, completedVerdicts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
