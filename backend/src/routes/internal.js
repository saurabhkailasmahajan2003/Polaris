import { Router } from 'express';
import Case from '../models/Case.js';
import Round from '../models/Round.js';
import Verdict from '../models/Verdict.js';
import Archive from '../models/Archive.js';
import Agent from '../models/Agent.js';
import { requireInternal } from '../middleware/auth.js';
import { setCaseState } from '../config/redis.js';
import {
  emitCaseStarted,
  emitRoundComplete,
  emitAgentSpeaking,
  emitVerdictReady,
  emitCityActivity,
  getIO,
} from '../socket/events.js';

const router = Router();
router.use(requireInternal);

router.post('/case/started', async (req, res) => {
  try {
    const { caseId, participatingAgents } = req.body;
    await Case.findByIdAndUpdate(caseId, {
      status: 'processing',
      currentPhase: 'pre_discussion',
      participatingAgents,
    });
    await setCaseState(caseId, { status: 'processing', phase: 'pre_discussion' });

    const caseDoc = await Case.findById(caseId);
    emitCaseStarted({ caseId, case: caseDoc });
    emitCityActivity(`Case "${caseDoc.title}" processing has begun`);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/case/agent-speaking', async (req, res) => {
  try {
    const { caseId, agentId, agentName, phase } = req.body;
    await Case.findByIdAndUpdate(caseId, { currentAgent: agentName, currentPhase: phase });
    emitAgentSpeaking({ caseId, agentId, agentName, phase });
    emitCityActivity(`${agentName} is analyzing Case #${caseId.slice(-6)}`);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/case/round-complete', async (req, res) => {
  try {
    const { caseId, roundNumber, phase, messages, verifiedEvidence } = req.body;

    const round = await Round.findOneAndUpdate(
      { caseId, roundNumber },
      { caseId, roundNumber, phase, messages, completedAt: new Date() },
      { upsert: true, new: true }
    );

    const update = { currentPhase: phase };
    if (verifiedEvidence) update.verifiedEvidence = verifiedEvidence;
    await Case.findByIdAndUpdate(caseId, update);
    await setCaseState(caseId, { phase, roundNumber });

    emitRoundComplete({ caseId, round: round.toObject() });
    emitCityActivity(`Round ${roundNumber} complete for Case #${caseId.slice(-6)}`);

    getIO()?.to(`case:${caseId}`).emit('case:round_complete', { caseId, round: round.toObject() });

    res.json({ ok: true, roundId: round._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/case/verdict-ready', async (req, res) => {
  try {
    const { caseId, verdict, summary, agentUpdates } = req.body;

    const verdictDoc = await Verdict.findOneAndUpdate(
      { caseId },
      { caseId, ...verdict },
      { upsert: true, new: true }
    );

    const caseDoc = await Case.findByIdAndUpdate(
      caseId,
      { status: 'completed', currentPhase: 'completed', summary: summary || '' },
      { new: true }
    );

    await Archive.findOneAndUpdate(
      { caseId },
      {
        caseId,
        eventId: caseDoc.eventId,
        title: caseDoc.title,
        category: caseDoc.category,
        verdict: verdict.decision,
        verdictStatement: verdict.statement,
        topConsequence: verdict.consequences?.[0]?.socialImpact || '',
        participatingAgents: caseDoc.participatingAgents,
        completedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    if (agentUpdates?.length) {
      for (const update of agentUpdates) {
        await Agent.findOneAndUpdate(
          { agentId: update.agentId },
          {
            $inc: { casesParticipated: 1 },
            $push: {
              caseHistory: {
                caseId,
                caseTitle: caseDoc.title,
                position: update.position,
                outcome: verdict.decision,
                confidence: update.confidence,
              },
            },
            activeCaseId: null,
          }
        );
      }
    }

    await Agent.updateMany({ activeCaseId: caseId }, { activeCaseId: null });
    await setCaseState(caseId, { status: 'completed', phase: 'completed' });

    emitVerdictReady({ caseId, verdict: verdictDoc.toObject(), case: caseDoc });
    emitCityActivity(`Verdict delivered: "${verdict.statement.slice(0, 80)}..."`);

    res.json({ ok: true, verdictId: verdictDoc._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const Event = (await import('../models/Event.js')).default;
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
