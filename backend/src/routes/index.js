import { Router } from 'express';
import eventsRouter from './events.js';
import votesRouter from './votes.js';
import casesRouter from './cases.js';
import agentsRouter from './agents.js';
import verdictsRouter from './verdicts.js';
import archiveRouter from './archive.js';
import internalRouter from './internal.js';
import statsRouter from './stats.js';
import configRouter from './config.js';

const router = Router();

router.use('/config', configRouter);
router.use('/stats', statsRouter);
router.use('/events', eventsRouter);
router.use('/votes', votesRouter);
router.use('/cases', casesRouter);
router.use('/agents', agentsRouter);
router.use('/verdicts', verdictsRouter);
router.use('/archive', archiveRouter);
router.use('/internal', internalRouter);

export default router;
