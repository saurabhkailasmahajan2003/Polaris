import Redis from 'ioredis';

let redis = null;

export function getRedis() {
  if (!redis) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    redis = new Redis(url);
    redis.on('error', (err) => console.error('Redis error:', err.message));
  }
  return redis;
}

export async function setCaseState(caseId, data) {
  const r = getRedis();
  await r.set(`case:${caseId}`, JSON.stringify(data), 'EX', 86400);
}

export async function getCaseState(caseId) {
  const r = getRedis();
  const raw = await r.get(`case:${caseId}`);
  return raw ? JSON.parse(raw) : null;
}
