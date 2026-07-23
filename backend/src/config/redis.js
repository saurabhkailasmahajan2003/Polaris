import Redis from 'ioredis';

let redis = null;
let redisDisabled = false;

export function getRedis() {
  if (redisDisabled) return null;
  if (!redis) {
    const url = process.env.REDIS_URL || '';
    // Skip Redis when unset, empty, or pointing at unreachable localhost on cloud hosts
    if (!url || url.includes('localhost') || url.includes('127.0.0.1')) {
      if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
        console.warn('Redis disabled (no cloud REDIS_URL). Case state will use MongoDB only.');
        redisDisabled = true;
        return null;
      }
    }
    try {
      redis = new Redis(url || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        connectTimeout: 3000,
        retryStrategy: () => null,
      });
      redis.on('error', (err) => {
        console.error('Redis error:', err.message);
      });
    } catch (err) {
      console.warn('Redis unavailable:', err.message);
      redisDisabled = true;
      return null;
    }
  }
  return redis;
}

export async function setCaseState(caseId, data) {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(`case:${caseId}`, JSON.stringify(data), 'EX', 86400);
  } catch (err) {
    console.warn('setCaseState skipped:', err.message);
  }
}

export async function getCaseState(caseId) {
  const r = getRedis();
  if (!r) return null;
  try {
    const raw = await r.get(`case:${caseId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('getCaseState skipped:', err.message);
    return null;
  }
}
