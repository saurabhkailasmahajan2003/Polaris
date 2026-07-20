import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { getSocket } from '../lib/socket';
import { casesApi } from '../lib/api';
import { buildingForAgent } from '../lib/agentBuildings';

const AppContext = createContext(null);

function mapRoundMessages(caseId, round) {
  const msgs = round?.messages || [];
  return msgs
    .filter((m) => m.reasoning || m.position)
    .map((m, i) => ({
      id: `${caseId}-${round.roundNumber || round.phase}-${m.agentId}-${i}`,
      caseId,
      agentId: m.agentId,
      agentName: m.agentName || m.agentId,
      content: (m.reasoning || m.position || '').trim(),
      confidence: m.confidence,
      round: round.roundNumber,
      phase: round.phase,
      buildingId: buildingForAgent(m.agentId),
    }));
}

export function AppProvider({ children }) {
  const [currentCase, setCurrentCase] = useState(null);
  const [viewMode, setViewMode] = useState('quick');
  const [worldState, setWorldState] = useState({
    trust: 84, economy: 72, freedom: 78, crime: 12, health: 81, happiness: 76,
  });
  const [activeCases, setActiveCases] = useState([]);
  const [ticker, setTicker] = useState(['Polaris civilization initialized']);
  const [typingAgent, setTypingAgent] = useState(null);
  const [speakingAgent, setSpeakingAgent] = useState(null);
  const [liveMessages, setLiveMessages] = useState([]);
  const speakingClearRef = useRef(null);
  const seenRoundKeys = useRef(new Set());

  const addTicker = useCallback((msg) => {
    setTicker((t) => [msg, ...t].slice(0, 30));
  }, []);

  const enqueueRoundMessages = useCallback((caseId, round) => {
    const key = `${caseId}-${round?.roundNumber}-${round?.phase}`;
    if (!round || seenRoundKeys.current.has(key)) return;
    seenRoundKeys.current.add(key);
    const mapped = mapRoundMessages(caseId, round);
    if (!mapped.length) return;
    setLiveMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const fresh = mapped.filter((m) => !ids.has(m.id));
      return [...prev, ...fresh].slice(-80);
    });
  }, []);

  const refreshActiveCases = useCallback(() => {
    casesApi.list().then((cases) => {
      setActiveCases(cases.filter((c) => ['pending', 'processing'].includes(c.status)));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    refreshActiveCases();

    const socket = getSocket();

    socket.on('case:started', (data) => {
      addTicker(`Case opened: ${data.case?.title || 'New case'}`);
      refreshActiveCases();
    });

    socket.on('case:round_complete', (data) => {
      addTicker(`Round ${data.round?.roundNumber} complete — agents finished a chapter of debate`);
      if (data.caseId && data.round) {
        enqueueRoundMessages(data.caseId, data.round);
      }
      refreshActiveCases();
    });

    socket.on('case:agent_speaking', (data) => {
      const buildingId = buildingForAgent(data.agentId);
      const speaking = {
        caseId: data.caseId,
        agentId: data.agentId,
        agentName: data.agentName,
        phase: data.phase,
        buildingId,
      };
      setTypingAgent(data.agentName);
      setSpeakingAgent(speaking);
      addTicker(`${data.agentName} is thinking at ${buildingId.replace(/_/g, ' ')}…`);

      if (speakingClearRef.current) clearTimeout(speakingClearRef.current);
      // Stay “thinking” long enough to feel human (cleared earlier if next agent speaks)
      speakingClearRef.current = setTimeout(() => {
        setTypingAgent(null);
        setSpeakingAgent((s) => (s?.agentId === data.agentId ? null : s));
      }, 14000);
    });

    socket.on('case:verdict_ready', (data) => {
      addTicker(`Verdict delivered: ${data.verdict?.statement?.slice(0, 80) || 'complete'}…`);
      setTypingAgent(null);
      setSpeakingAgent({
        agentId: 'judge',
        agentName: 'Judge',
        phase: 'verdict',
        buildingId: 'supreme_court',
        caseId: data.caseId,
      });
      refreshActiveCases();
    });

    socket.on('city:activity', (data) => addTicker(data.message));

    return () => {
      if (speakingClearRef.current) clearTimeout(speakingClearRef.current);
      socket.off('case:started');
      socket.off('case:round_complete');
      socket.off('case:agent_speaking');
      socket.off('case:verdict_ready');
      socket.off('city:activity');
    };
  }, [addTicker, enqueueRoundMessages, refreshActiveCases]);

  // Seed feed from any already-processing cases (so city isn't empty on refresh)
  const seededCasesRef = useRef(new Set());
  useEffect(() => {
    const processing = activeCases.filter((c) => c.status === 'processing');
    processing.slice(0, 3).forEach((c) => {
      if (seededCasesRef.current.has(c._id)) return;
      seededCasesRef.current.add(c._id);
      casesApi.get(c._id).then((data) => {
        (data.rounds || []).forEach((round) => enqueueRoundMessages(c._id, round));
      }).catch(() => {});
    });
  }, [activeCases, enqueueRoundMessages]);

  return (
    <AppContext.Provider value={{
      currentCase, setCurrentCase,
      viewMode, setViewMode,
      worldState, setWorldState,
      activeCases, ticker, typingAgent,
      speakingAgent, liveMessages,
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
