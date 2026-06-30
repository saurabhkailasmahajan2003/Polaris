import { Router } from 'express';
import Event from '../models/Event.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, source, category, image } = req.body;
    if (!title || !description || !source || !category) {
      return res.status(400).json({ error: 'title, description, source, and category are required' });
    }
    const event = await Event.create({
      title,
      description,
      source,
      category,
      image: image || '',
      createdBy: req.userId,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ deployed: false }).sort({ voteCount: -1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
