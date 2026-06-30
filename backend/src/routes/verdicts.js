import { Router } from 'express';
import Verdict from '../models/Verdict.js';
import Case from '../models/Case.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const verdicts = await Verdict.find().sort({ createdAt: -1 });
    const enriched = await Promise.all(
      verdicts.map(async (v) => {
        const caseDoc = await Case.findById(v.caseId).select('title category image');
        return { ...v.toObject(), case: caseDoc };
      })
    );
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:caseId', async (req, res) => {
  try {
    const verdict = await Verdict.findOne({ caseId: req.params.caseId });
    if (!verdict) return res.status(404).json({ error: 'Verdict not found' });
    const caseDoc = await Case.findById(verdict.caseId);
    res.json({ verdict, case: caseDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
