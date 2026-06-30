import { createContext, useContext, useEffect, useState } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DEFAULTS = {
  platformName: 'Polaris',
  platformTagline: 'Living Digital Civilization',
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  usersiteUrl: 'http://localhost:5174',
  adminUrl: 'http://localhost:5173',
};

const ConfigContext = createContext(DEFAULTS);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND}/api/config`)
      .then((res) => (res.ok ? res.json() : DEFAULTS))
      .then((data) => {
        const merged = {
          ...DEFAULTS,
          ...data,
          clerkPublishableKey: data.clerkPublishableKey || DEFAULTS.clerkPublishableKey,
        };
        setConfig(merged);
        document.title = `${merged.platformName} — Admin`;
      })
      .catch(() => setConfig(DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
