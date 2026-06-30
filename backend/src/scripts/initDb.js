import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Agent from '../models/Agent.js';
import Event from '../models/Event.js';
import Case from '../models/Case.js';
import Round from '../models/Round.js';
import Verdict from '../models/Verdict.js';
import Vote from '../models/Vote.js';
import Archive from '../models/Archive.js';
import { AGENT_SEED_DATA } from '../data/agents.js';

async function ensureIndexes() {
  await Promise.all([
    Agent.init(),
    Event.init(),
    Case.init(),
    Round.init(),
    Verdict.init(),
    Vote.init(),
    Archive.init(),
  ]);
  console.log('All collection indexes ensured');
}

async function seedAgents() {
  for (const agent of AGENT_SEED_DATA) {
    await Agent.findOneAndUpdate({ agentId: agent.agentId }, agent, { upsert: true, new: true });
  }
  console.log(`Seeded ${AGENT_SEED_DATA.length} agents`);
}

async function main() {
  await connectDB();
  await ensureIndexes();
  await seedAgents();
  console.log('Database initialization complete');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
