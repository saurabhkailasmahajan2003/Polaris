import { Router } from 'express';
import Agent from '../models/Agent.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ agentId: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findOne({
      $or: [{ agentId: req.params.id }, { _id: req.params.id }],
    });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
