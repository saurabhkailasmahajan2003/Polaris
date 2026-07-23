import { Router } from 'express';
import Case from '../models/Case.js';
import Event from '../models/Event.js';
import Round from '../models/Round.js';
import Verdict from '../models/Verdict.js';
import Agent from '../models/Agent.js';
import { requireAuth } from '../middleware/auth.js';
import { runPipeline } from '../services/aiEngine.js';
import { setCaseState } from '../config/redis.js';
import { emitCasesDeployed, emitCityActivity } from '../socket/events.js';

const router = Router();

function selectAgents(category, title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const categoryMap = {
    politics: ['political_analyst', 'legal_expert', 'ethics_expert', 'economist'],
    economics: ['economist', 'political_analyst', 'legal_expert'],
    technology: ['technology_expert', 'legal_expert', 'ethics_expert', 'economist'],
    legal: ['legal_expert', 'human_rights_expert', 'ethics_expert'],
    ethics: ['ethics_expert', 'human_rights_expert', 'psychologist'],
    human_rights: ['human_rights_expert', 'legal_expert', 'ethics_expert'],
    social: ['psychologist', 'ethics_expert', 'human_rights_expert'],
    environment: ['economist', 'ethics_expert', 'political_analyst'],
    security: ['political_analyst', 'technology_expert', 'legal_expert'],
    general: ['economist', 'legal_expert', 'ethics_expert', 'political_analyst'],
  };

  const selected = new Set(['investigator', 'fact_checker']);
  const categoryAgents = categoryMap[category] || categoryMap.general;
  categoryAgents.forEach((a) => selected.add(a));

  const keywordAgents = {
    ai: 'technology_expert',
    cyber: 'technology_expert',
    economy: 'economist',
    market: 'economist',
    law: 'legal_expert',
    rights: 'human_rights_expert',
    psychology: 'psychologist',
    social: 'psychologist',
  };

  for (const [kw, agent] of Object.entries(keywordAgents)) {
    if (text.includes(kw)) selected.add(agent);
  }

  selected.add('judge');
  return [...selected];
}

router.post('/deploy', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.body.limit, 10) || 3, 5);
    const events = await Event.find({ deployed: false })
      .sort({ voteCount: -1 })
      .limit(limit);

    if (events.length === 0) {
      return res.status(400).json({ error: 'No events available to deploy' });
    }

    const deployedCases = [];

    for (const event of events) {
      const participatingAgents = selectAgents(event.category, event.title, event.description);

      const caseDoc = await Case.create({
        eventId: event._id,
        title: event.title,
        description: event.description,
        source: event.source,
        category: event.category,
        image: event.image,
        status: 'pending',
        participatingAgents,
      });

      event.deployed = true;
      await event.save();

      await Agent.updateMany(
        { agentId: { $in: participatingAgents.filter((a) => a !== 'judge') } },
        { activeCaseId: caseDoc._id }
      );

      deployedCases.push(caseDoc);

      // Fire and forget pipeline
      setCaseState(caseDoc._id.toString(), { status: 'pending', phase: 'pre_discussion' });
      runPipeline({
        caseId: caseDoc._id.toString(),
        title: caseDoc.title,
        description: caseDoc.description,
        source: caseDoc.source,
        category: caseDoc.category,
        participatingAgents,
      }).catch((err) => {
        console.error(`Pipeline failed for case ${caseDoc._id}:`, err.message);
        Case.findByIdAndUpdate(caseDoc._id, { status: 'failed' });
      });
    }

    const caseIds = deployedCases.map((c) => c._id.toString());
    emitCasesDeployed({
      count: deployedCases.length,
      caseIds,
      message: 'Top liked posts moved to the AI world. Go to the City to see live action.',
    });
    emitCityActivity(
      `${deployedCases.length} case(s) entered the City — watch live deliberation`
    );

    res.status(201).json({ message: `Deployed ${deployedCases.length} cases`, cases: deployedCases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: 'Case not found' });

    const rounds = await Round.find({ caseId: caseDoc._id }).sort({ roundNumber: 1 });
    const verdict = await Verdict.findOne({ caseId: caseDoc._id });

    res.json({ case: caseDoc, rounds, verdict });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
