import { Router } from 'express';
import Vote from '../models/Vote.js';
import Event from '../models/Event.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/:eventId', requireAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.deployed) return res.status(400).json({ error: 'Event already deployed' });

    const existing = await Vote.findOne({ eventId, userId: req.userId });
    if (existing) return res.status(400).json({ error: 'Already voted on this event' });

    await Vote.create({ eventId, userId: req.userId });
    event.voteCount += 1;
    await event.save();

    res.json({ message: 'Vote recorded', voteCount: event.voteCount });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Already voted on this event' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get('/top', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 10);
    const events = await Event.find({ deployed: false })
      .sort({ voteCount: -1 })
      .limit(limit);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
