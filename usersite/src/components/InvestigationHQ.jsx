import { useEffect, useState, useMemo } from 'react';
import { casesApi } from '../lib/api';
import { useApp } from '../context/AppContext';
import LiveDeliberationFeed from './city/LiveDeliberationFeed';
import { buildingLabel } from '../lib/agentBuildings';

export default function InvestigationHQ({ onClose, activeCaseIds, onOpenCase }) {
  const [cases, setCases] = useState([]);
  const { speakingAgent, liveMessages, typingAgent } = useApp();

  useEffect(() => {
    casesApi.list().then((all) => {
      setCases(all.filter((c) => ['pending', 'processing'].includes(c.status)));
    }).catch(console.error);
  }, [activeCaseIds]);

  const feedMessages = useMemo(() => {
    if (!activeCaseIds?.length) return liveMessages;
    return liveMessages.filter((m) => activeCaseIds.includes(m.caseId));
  }, [liveMessages, activeCaseIds]);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 flex flex-col">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Investigation HQ</h2>
        </div>
        <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>
      <p className="text-text-secondary text-sm mb-4 shrink-0">
        Watch experts think out loud — one voice at a time, slowly enough to follow.
      </p>

      {(speakingAgent || typingAgent) && (
        <div className="mb-4 shrink-0 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5">
          <p className="text-xs font-mono text-primary animate-pulse">
            ● {speakingAgent?.agentName || typingAgent} is deliberating
            {speakingAgent?.buildingId ? ` · ${buildingLabel(speakingAgent.buildingId)}` : ''}
          </p>
        </div>
      )}

      <div className="mb-6 shrink-0 min-h-0">
        <LiveDeliberationFeed
          messages={feedMessages}
          speakingAgent={speakingAgent}
          title="Floor debate"
          emptyHint="No live debate yet. Deploy a case from admin, then return here."
        />
      </div>

      <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-3 shrink-0">Active cases</h3>
      <div className="space-y-3 shrink-0 pb-4">
        {cases.map((c) => (
          <button
            key={c._id}
            type="button"
            onClick={() => onOpenCase?.(c._id)}
            className={`w-full text-left bg-city border rounded-xl p-4 transition-colors ${
              activeCaseIds.includes(c._id) ? 'border-primary/50 building-active' : 'border-white/5 hover:border-primary/30'
            }`}
          >
            <p className="font-medium text-sm">{c.title}</p>
            <p className="text-xs text-primary mt-1 capitalize">{c.currentPhase?.replace(/_/g, ' ') || 'pending'}</p>
            {c.currentAgent && (
              <p className="text-xs text-text-secondary mt-1 animate-pulse">{c.currentAgent} is weighing evidence…</p>
            )}
          </button>
        ))}
        {cases.length === 0 && <p className="text-text-secondary text-sm">No active investigations</p>}
      </div>
    </div>
  );
}
