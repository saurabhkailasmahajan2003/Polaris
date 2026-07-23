import { useEffect, useState, useMemo } from 'react';
import { casesApi } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import LiveDeliberationFeed from './LiveDeliberationFeed';
import RealVsAiTable from '../results/RealVsAiTable';

export default function CasePanelContent({ caseId, onBack }) {
  const [data, setData] = useState(null);
  const { speakingAgent, liveMessages } = useApp();

  useEffect(() => {
    casesApi.get(caseId).then(setData).catch(console.error);
    const t = setInterval(() => {
      casesApi.get(caseId).then(setData).catch(() => {});
    }, 12000);
    return () => clearInterval(t);
  }, [caseId]);

  const caseFeed = useMemo(
    () => liveMessages.filter((m) => m.caseId === caseId),
    [liveMessages, caseId],
  );

  const caseSpeaking = speakingAgent?.caseId === caseId ? speakingAgent : null;

  if (!data) {
    return <p className="text-text-secondary text-sm p-6">Loading case...</p>;
  }

  const { case: caseDoc, verdict, rounds } = data;
  const topAgents = verdict?.agentPositions?.slice(0, 3) ||
    rounds?.find((r) => r.phase === 'round4')?.messages?.slice(0, 3) || [];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <button type="button" onClick={onBack} className="text-primary text-sm hover:underline mb-4">← Back</button>
      <h2 className="font-heading text-xl font-bold mb-2">{caseDoc.title}</h2>
      <p className="text-text-secondary text-sm mb-6 line-clamp-3">{caseDoc.description}</p>

      {verdict ? (
        <div className="mb-6">
          <RealVsAiTable caseDoc={caseDoc} verdict={verdict} />
        </div>
      ) : (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
          <p className="text-primary text-sm capitalize">
            {caseDoc.currentPhase?.replace(/_/g, ' ') || 'deliberation'}
            {caseDoc.currentAgent ? ` — ${caseDoc.currentAgent}` : ''}
          </p>
          <p className="text-xs text-text-muted mt-1">Agents are thinking carefully. Read each voice as it appears.</p>
        </div>
      )}

      {!verdict && (
        <div className="mb-6">
          <LiveDeliberationFeed
            messages={caseFeed}
            speakingAgent={caseSpeaking}
            title="Live chamber discussion"
            emptyHint="Discussion will appear here slowly as each expert speaks."
          />
        </div>
      )}

      {topAgents.length > 0 && (
        <>
          <h3 className="font-heading text-sm font-semibold mb-3">Key Positions</h3>
          <div className="space-y-2">
            {topAgents.map((a) => (
              <div key={a.agentId || a.agentName} className="bg-city border border-white/5 rounded-lg p-3">
                <p className="text-sm text-primary font-medium">{a.agentName}</p>
                <p className="text-xs text-text-secondary mt-1">{(a.finalPosition || a.position || '').slice(0, 120)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
