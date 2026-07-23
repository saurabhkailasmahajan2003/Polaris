import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import PageShell, { ScrollTabs, TabButton } from '../components/layout/PageShell';
import LiveBadge from '../components/ui/LiveBadge';
import CategoryBadge from '../components/ui/CategoryBadge';
import VerdictBadge from '../components/ui/VerdictBadge';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import RealVsAiTable from '../components/results/RealVsAiTable';
import { AgentPositionCard } from '../components/ui/AgentMessage';
import AgentAvatar from '../components/ui/AgentAvatar';
import LiveDeliberationFeed from '../components/city/LiveDeliberationFeed';
import { casesApi } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const MODES = ['quick', 'summary', 'full'];
const ROUNDS = ['pre_discussion', 'round1', 'round2', 'round3', 'round4', 'verdict'];

function QuickView({ caseDoc, verdict }) {
  const { t } = useLanguage();
  const positions = verdict?.agentPositions?.slice(0, 3) || [];
  const hasResult = Boolean(verdict?.decision);

  return (
    <div className="space-y-6">
      {hasResult ? (
        <RealVsAiTable caseDoc={caseDoc} verdict={verdict} />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-warning/30 to-warning/10 px-5 py-3 border-b border-warning/20 flex items-center gap-2">
            <span className="text-sm font-mono text-warning">{t.awaitingVerdict}</span>
          </div>
          <div className="p-5">
            <p className="text-sm leading-relaxed text-text-secondary">
              {caseDoc?.description || t.noVerdictYet}
            </p>
          </div>
        </div>
      )}

      {positions.length > 0 && (
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">{t.keyPoints}</h3>
          <div className="space-y-3">
            {positions.map((a) => (
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
        </div>
      )}
    </div>
  );
}

function FullView({ rounds, activeRound, setActiveRound, typingAgent, speakingAgent, liveMessages, caseId }) {
  const roundMessages = rounds?.find((r) => r.phase === activeRound)?.messages || [];
  const fromRound = roundMessages.map((m, i) => ({
    id: `${caseId}-${activeRound}-${m.agentId}-${i}`,
    caseId,
    agentId: m.agentId,
    agentName: m.agentName,
    content: m.reasoning || m.position || '',
    confidence: m.confidence,
    round: parseInt(String(activeRound).replace('round', ''), 10) || undefined,
    buildingId: undefined,
  })).filter((m) => m.content);

  const feed = liveMessages?.length
    ? liveMessages.filter((m) => m.caseId === caseId)
    : fromRound;

  const activeAgents = [
    { id: 'investigator', name: 'Investigator' },
    { id: 'fact_checker', name: 'Fact Checker' },
    { id: 'economist', name: 'Economist' },
    { id: 'legal_expert', name: 'Legal Expert' },
    { id: 'ethics_expert', name: 'Ethics Expert' },
    { id: 'political_analyst', name: 'Political Analyst' },
    { id: 'judge', name: 'Judge' },
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
        <LiveDeliberationFeed
          messages={feed}
          speakingAgent={speakingAgent?.caseId === caseId ? speakingAgent : null}
          title="Chamber floor — read each voice slowly"
          emptyHint="Agents will speak one at a time. Stay with them."
        />
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Active Agents</h3>
          <div className="space-y-2">
            {activeAgents.map((a) => {
              const speaking = speakingAgent?.agentId === a.id || typingAgent === a.name;
              return (
                <div key={a.id} className="flex items-center gap-2">
                  <AgentAvatar name={a.name} agentId={a.id} size="sm" glow={speaking} />
                  <span className="text-sm flex-1">{a.name}</span>
                  {speaking ? (
                    <span className="text-[9px] font-mono text-primary animate-pulse">thinking</span>
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${speakingAgent ? 'bg-text-muted' : 'bg-success'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {(typingAgent || speakingAgent) && (
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-primary animate-pulse font-mono">
              ● {speakingAgent?.agentName || typingAgent} is carefully forming their view…
            </p>
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
  const { typingAgent, speakingAgent, liveMessages } = useApp();

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

  const caseDoc = data?.case;
  const verdict = data?.verdict;
  const rounds = data?.rounds || [];
  const isLive = caseDoc?.status === 'processing';

  if (!caseDoc) {
    return (
      <AppLayout showWorldState={false} showTicker={false}>
        <PageShell maxWidth="max-w-6xl">
          <p className="text-sm text-text-muted">Loading case…</p>
        </PageShell>
      </AppLayout>
    );
  }

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell maxWidth="max-w-6xl" className="!pt-0 sm:!pt-0">
        <header className="mb-4 md:mb-6 px-0 pt-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <span className="text-[10px] sm:text-xs font-mono text-text-muted">CASE #{id?.slice(-4)}</span>
            {isLive && <LiveBadge />}
            <div className="ml-auto">
              <LanguageSwitcher compact />
            </div>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold leading-tight">{caseDoc.title}</h1>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            <CategoryBadge category={caseDoc.category || 'general'} />
            {caseDoc.status && (
              <span className="text-[10px] sm:text-xs font-mono text-text-muted px-2 py-1 rounded bg-white/5">{caseDoc.status}</span>
            )}
            {verdict?.decision && <VerdictBadge verdict={verdict.decision} />}
          </div>
        </header>

        <ScrollTabs>
          {MODES.map((m) => (
            <TabButton key={m} active={mode === m} onClick={() => setMode(m)}>
              {m === 'quick' ? 'Quick' : m === 'summary' ? 'Summary' : 'Full Case'}
              <span className="hidden sm:inline"> Mode</span>
            </TabButton>
          ))}
        </ScrollTabs>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {mode === 'quick' && <QuickView caseDoc={caseDoc} verdict={verdict} />}
            {mode === 'summary' && <QuickView caseDoc={caseDoc} verdict={verdict} />}
            {mode === 'full' && (
              <>
                {verdict?.decision && (
                  <div className="mb-6">
                    <RealVsAiTable caseDoc={caseDoc} verdict={verdict} />
                  </div>
                )}
                <FullView
                  rounds={rounds}
                  activeRound={activeRound}
                  setActiveRound={setActiveRound}
                  typingAgent={typingAgent}
                  speakingAgent={speakingAgent}
                  liveMessages={liveMessages}
                  caseId={id}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </PageShell>
    </AppLayout>
  );
}
