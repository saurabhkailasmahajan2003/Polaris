const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const eventsApi = {
  list: () => api('/events'),
  create: (data) => api('/events', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => api(`/events/${id}`, { method: 'DELETE' }),
};

export const casesApi = {
  list: (status) => api(`/cases${status ? `?status=${status}` : ''}`),
  get: (id) => api(`/cases/${id}`),
  deploy: (limit = 3) => api('/cases/deploy', { method: 'POST', body: JSON.stringify({ limit }) }),
};

export const verdictsApi = {
  list: () => api('/verdicts'),
  get: (caseId) => api(`/verdicts/${caseId}`),
};

export const agentsApi = {
  list: () => api('/agents'),
  get: (id) => api(`/agents/${id}`),
};

export const statsApi = {
  get: () => api('/stats'),
};
