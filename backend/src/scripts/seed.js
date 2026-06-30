import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Agent from '../models/Agent.js';
import { AGENT_SEED_DATA } from '../data/agents.js';

async function main() {
  await connectDB();
  for (const agent of AGENT_SEED_DATA) {
    await Agent.findOneAndUpdate({ agentId: agent.agentId }, agent, { upsert: true, new: true });
  }
  console.log(`Seeded ${AGENT_SEED_DATA.length} agents`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
