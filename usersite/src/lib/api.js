const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let offlineWarned = false;

function warnOfflineOnce() {
  if (!offlineWarned && import.meta.env.DEV) {
    offlineWarned = true;
    console.warn('[api] Backend unavailable — start it with: cd backend && npm run dev');
  }
}

async function safe(call, fallback) {
  try {
    return await call();
  } catch (err) {
    if (err?.offline) warnOfflineOnce();
    return fallback;
  }
}

export async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    const err = new Error('Backend unavailable');
    err.offline = true;
    throw err;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const eventsApi = {
  list: () => safe(() => api('/events'), []),
};

export const votesApi = {
  vote: (eventId) => api(`/votes/${eventId}`, { method: 'POST' }),
  top: (limit = 5) => safe(() => api(`/votes/top?limit=${limit}`), []),
};

export const casesApi = {
  list: () => safe(() => api('/cases'), []),
  get: (id) => safe(() => api(`/cases/${id}`), null),
};

export const agentsApi = {
  list: () => safe(() => api('/agents'), []),
  get: (id) => safe(() => api(`/agents/${id}`), null),
};

export const verdictsApi = {
  list: () => safe(() => api('/verdicts'), []),
};

export const archiveApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return safe(() => api(`/archive${q ? `?${q}` : ''}`), { archives: [] });
  },
};

export const statsApi = {
  get: () => safe(() => api('/stats'), { activeCases: 0, completedVerdicts: 0 }),
};
