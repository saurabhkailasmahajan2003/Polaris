import { Router } from 'express';
import { getPublicConfig } from '../config/core.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(getPublicConfig());
});

export default router;
