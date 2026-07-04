import { clerkMiddleware, getAuth } from '@clerk/express';

const secretKey = process.env.CLERK_SECRET_KEY?.trim();
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY?.trim();
const placeholder = /your_key|placeholder|changeme/i;

// Clerk needs both real keys; placeholders or a single key → dev mode (no Clerk middleware).
const hasClerk = Boolean(
  secretKey
  && publishableKey
  && !placeholder.test(secretKey)
  && !placeholder.test(publishableKey),
);

export const clerk = hasClerk ? clerkMiddleware() : (req, res, next) => next();

export function requireAuth(req, res, next) {
  if (!hasClerk) {
    req.userId = req.headers['x-dev-user-id'] || 'dev-user';
    return next();
  }
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = userId;
  next();
}

export function requireInternal(req, res, next) {
  const key = req.headers['x-internal-key'];
  if (key !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
