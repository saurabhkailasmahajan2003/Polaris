/**
 * Core platform settings — configure via backend/.env
 * Public values are exposed at GET /api/config for usersite & admin.
 */

function parseList(value, fallback = []) {
  if (!value?.trim()) return fallback;
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

const core = {
  platformName: process.env.PLATFORM_NAME || 'Polaris',
  platformTagline: process.env.PLATFORM_TAGLINE || 'Living Digital Civilization',
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  usersiteUrl: process.env.USERSITE_URL || 'http://localhost:5174',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
  corsOrigins: parseList(
    process.env.CORS_ORIGINS,
    ['http://localhost:5173', 'http://localhost:5174'],
  ),
  aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:8000',
  port: Number(process.env.PORT) || 5000,
};

/** Safe to send to browsers — no secrets */
export function getPublicConfig() {
  return {
    platformName: core.platformName,
    platformTagline: core.platformTagline,
    clerkPublishableKey: core.clerkPublishableKey,
    usersiteUrl: core.usersiteUrl,
    adminUrl: core.adminUrl,
  };
}

export default core;
