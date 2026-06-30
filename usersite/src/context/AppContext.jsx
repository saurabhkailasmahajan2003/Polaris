import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSocket } from '../lib/socket';
import { casesApi } from '../lib/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentCase, setCurrentCase] = useState(null);
  const [viewMode, setViewMode] = useState('quick');
  const [worldState, setWorldState] = useState({
    trust: 84, economy: 72, freedom: 78, crime: 12, health: 81, happiness: 76,
  });
  const [activeCases, setActiveCases] = useState([]);
  const [ticker, setTicker] = useState(['Polaris civilization initialized']);
  const [typingAgent, setTypingAgent] = useState(null);

  const addTicker = useCallback((msg) => {
    setTicker((t) => [msg, ...t].slice(0, 30));
  }, []);

  useEffect(() => {
    casesApi.list().then((cases) => {
      setActiveCases(cases.filter((c) => ['pending', 'processing'].includes(c.status)));
    }).catch(() => {});

    const socket = getSocket();
    socket.on('case:started', (data) => {
      addTicker(`Case opened: ${data.case?.title || 'New case'}`);
      casesApi.list().then((cases) => setActiveCases(cases.filter((c) => ['pending', 'processing'].includes(c.status))));
    });
    socket.on('case:round_complete', (data) => addTicker(`Round ${data.round?.roundNumber} complete`));
    socket.on('case:agent_speaking', (data) => {
      setTypingAgent(data.agentName);
      addTicker(`${data.agentName} is deliberating...`);
      setTimeout(() => setTypingAgent(null), 3000);
    });
    socket.on('case:verdict_ready', (data) => {
      addTicker(`Verdict: ${data.verdict?.statement?.slice(0, 60) || 'delivered'}...`);
      casesApi.list().then((cases) => setActiveCases(cases.filter((c) => ['pending', 'processing'].includes(c.status))));
    });
    socket.on('city:activity', (data) => addTicker(data.message));

    return () => {
      socket.off('case:started');
      socket.off('case:round_complete');
      socket.off('case:agent_speaking');
      socket.off('case:verdict_ready');
      socket.off('city:activity');
    };
  }, [addTicker]);

  return (
    <AppContext.Provider value={{
      currentCase, setCurrentCase,
      viewMode, setViewMode,
      worldState, setWorldState,
      activeCases, ticker, typingAgent,
      addTicker,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
