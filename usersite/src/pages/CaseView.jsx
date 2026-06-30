import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import PageShell, { ScrollTabs, TabButton } from '../components/layout/PageShell';
import LiveBadge from '../components/ui/LiveBadge';
import CategoryBadge from '../components/ui/CategoryBadge';
import VerdictBadge from '../components/ui/VerdictBadge';
import AgentMessage, { AgentPositionCard } from '../components/ui/AgentMessage';
import MiniChart from '../components/ui/MiniChart';
import AgentAvatar from '../components/ui/AgentAvatar';
import { casesApi } from '../lib/api';
import { getSocket } from '../lib/socket';
import { DEMO_MESSAGES } from '../lib/constants';
import { useApp } from '../context/AppContext';

const MODES = ['quick', 'summary', 'full'];
const ROUNDS = ['pre_discussion', 'round1', 'round2', 'round3', 'round4', 'verdict'];

const DEMO_POSITIONS = [
  { agentId: 'economist', name: 'Economist', stance: 'Supports', reasoning: 'High economic efficiency and financial inclusion potential.', confidence: 85 },
  { agentId: 'legal_expert', name: 'Legal Expert', stance: 'Conditional', reasoning: 'Strong legal framework and privacy protections required.', confidence: 76 },
  { agentId: 'ethics_expert', name: 'Ethics Expert', stance: 'Concerns', reasoning: 'Risk of surveillance and power centralization must be mitigated.', confidence: 72 },
];

function QuickView({ caseDoc, verdict }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-warning/30 to-warning/10 px-5 py-3 border-b border-warning/20 flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <VerdictBadge verdict={verdict?.decision || 'approved_with_conditions'} />
          </div>
          <div className="p-5">
            <p className="text-sm leading-relaxed">
              {verdict?.statement || 'CBDCs can be implemented with strong privacy protections, decentralized oversight, and clear limits on government control.'}
            </p>
            <p className="text-xs font-mono text-text-muted mt-3">Confidence: {verdict?.confidence || 87}%</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Key Positions</h3>
          <div className="space-y-3">
            {(verdict?.agentPositions?.slice(0, 3) || DEMO_POSITIONS).map((a) => (
              <AgentPositionCard
                key={a.agentId}
                agentId={a.agentId}
                name={a.agentName || a.name}
                stance={a.stance}
                reasoning={a.finalPosition || a.reasoning}
                confidence={a.confidence}
              />
            ))}
          </div>
          <button type="button" className="mt-4 text-sm text-primary hover:underline">View All Agent Positions →</button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Consequence Projections</h3>
        <div className="space-y-3">
          {[
            { label: '6 Months', sub: 'Short-term impact', trend: 'up', tag: null },
            { label: '1 Year', sub: 'Medium-term impact', trend: 'up', tag: 'Mostly Positive' },
            { label: '2 Years', sub: 'Long-term impact', trend: 'mixed', tag: 'Positive with Risks' },
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-heading font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.sub}</p>
                </div>
                <MiniChart trend={item.trend} />
              </div>
              {item.tag && <p className={`text-xs font-mono mt-2 ${item.trend === 'up' ? 'text-success' : 'text-warning'}`}>{item.tag}</p>}
            </div>
          ))}
        </div>
        <button type="button" className="mt-4 w-full py-2 text-sm border border-white/20 rounded-lg hover:border-primary/50 transition-all">
          View Full Projections
        </button>
      </div>
    </div>
  );
}

function FullView({ rounds, activeRound, setActiveRound, typingAgent }) {
  const roundMessages = rounds?.find((r) => r.phase === activeRound)?.messages || [];
  const messages = roundMessages.length ? roundMessages.map((m) => ({
    agentId: m.agentId,
    agentName: m.agentName,
    round: parseInt(activeRound.replace('round', ''), 10) || 2,
    time: '2m ago',
    content: m.reasoning || m.position,
    confidence: m.confidence,
    flagged: m.factCheckFlags?.length > 0,
  })) : DEMO_MESSAGES;

  const activeAgents = [
    { id: 'investigator', name: 'Investigator', active: true },
    { id: 'fact_checker', name: 'Fact Checker', active: true },
    { id: 'economist', name: 'Economist', active: true },
    { id: 'legal_expert', name: 'Legal Expert', active: true },
    { id: 'ethics_expert', name: 'Ethics Expert', active: true, typing: typingAgent === 'Ethics Expert' },
    { id: 'political_analyst', name: 'Political Analyst', active: true },
    { id: 'judge', name: 'Judge', active: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2 min-w-0">
        <div className="flex gap-1 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-1 px-1 overscroll-x-contain">
          {ROUNDS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setActiveRound(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                activeRound === r ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:text-text-primary'
              }`}
            >
              {r === 'pre_discussion' ? 'Pre-Discussion' : r === 'verdict' ? 'Verdict' : r.replace('round', 'Round ')}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <AgentMessage key={i} message={msg} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Active Agents (7)</h3>
          <div className="space-y-2">
            {activeAgents.map((a) => (
              <div key={a.id} className="flex items-center gap-2">
                <AgentAvatar name={a.name} agentId={a.id} size="sm" />
                <span className="text-sm flex-1">{a.name}</span>
                <span className={`w-2 h-2 rounded-full ${a.active ? 'bg-success' : 'bg-text-muted'}`} />
              </div>
            ))}
          </div>
        </div>
        {typingAgent && (
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-primary animate-pulse font-mono">● {typingAgent} is typing...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseView() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'quick';
  const [data, setData] = useState(null);
  const [activeRound, setActiveRound] = useState('round2');
  const { typingAgent } = useApp();

  const setMode = (m) => setSearchParams({ mode: m });

  useEffect(() => {
    const load = () => casesApi.get(id).then(setData).catch(() => setData(null));
    load();
    const socket = getSocket();
    socket.emit('join:case', id);
    socket.on('case:round_complete', load);
    socket.on('case:verdict_ready', load);
    return () => {
      socket.emit('leave:case', id);
      socket.off('case:round_complete', load);
      socket.off('case:verdict_ready', load);
    };
  }, [id]);

  const caseDoc = data?.case || {
    title: 'Global Central Bank Digital Currencies',
    category: 'economics',
    status: 'processing',
    description: '',
  };
  const verdict = data?.verdict;
  const rounds = data?.rounds || [];
  const isLive = caseDoc.status === 'processing';

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell maxWidth="max-w-6xl" className="!pt-0 sm:!pt-0">
        <header className="mb-4 md:mb-6 px-0 pt-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <span className="text-[10px] sm:text-xs font-mono text-text-muted">CASE #{id?.slice(-2) || '37'}</span>
            {isLive && <LiveBadge />}
          </div>
          <h1 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold leading-tight">{caseDoc.title}</h1>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            <CategoryBadge category={caseDoc.category || 'economy'} />
            <span className="text-[10px] sm:text-xs font-mono text-text-muted px-2 py-1 rounded bg-white/5">12,842 citizens</span>
            <span className="text-[10px] sm:text-xs font-mono text-text-muted px-2 py-1 rounded bg-white/5 hidden sm:inline">May 12, 2024</span>
          </div>
        </header>

        <ScrollTabs>
          {MODES.map((m) => (
            <TabButton key={m} active={mode === m} onClick={() => setMode(m)}>
              {m === 'quick' ? 'Quick' : m === 'summary' ? 'Summary' : 'Full Case'}
              <span className="hidden sm:inline">{m === 'quick' ? ' Mode' : m === 'summary' ? ' Mode' : ' Mode'}</span>
            </TabButton>
          ))}
        </ScrollTabs>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {mode === 'quick' && <QuickView caseDoc={caseDoc} verdict={verdict} />}
            {mode === 'summary' && <QuickView caseDoc={caseDoc} verdict={verdict} />}
            {mode === 'full' && <FullView rounds={rounds} activeRound={activeRound} setActiveRound={setActiveRound} typingAgent={typingAgent} />}
          </motion.div>
        </AnimatePresence>
      </PageShell>
    </AppLayout>
  );
}
