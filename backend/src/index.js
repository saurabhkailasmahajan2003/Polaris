import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectDB } from './config/db.js';
import { initSocket } from './socket/index.js';
import apiRouter from './routes/index.js';
import core from './config/core.js';
import { handleClerkWebhook } from './routes/auth.js';
import { clerk } from './middleware/auth.js';
import Agent from './models/Agent.js';
import { AGENT_SEED_DATA } from './data/agents.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: core.corsOrigins,
  credentials: true,
}));

app.post(
  '/api/auth/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
  },
  handleClerkWebhook
);

app.use(express.json());
app.use(clerk);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'polaris-backend', platform: core.platformName });
});

app.use('/api', apiRouter);

async function bootstrap() {
  await connectDB();

  // Ensure agents are seeded
  for (const agent of AGENT_SEED_DATA) {
    await Agent.findOneAndUpdate({ agentId: agent.agentId }, agent, { upsert: true });
  }

  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Polaris backend running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
