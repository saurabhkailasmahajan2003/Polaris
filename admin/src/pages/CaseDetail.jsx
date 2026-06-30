import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { casesApi } from '../lib/api';
import { getSocket } from '../lib/socket';

export default function CaseDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const load = () => casesApi.get(id).then(setData).catch(console.error);

  useEffect(() => {
    load();
    const socket = getSocket();
    socket.emit('join:case', id);
    const refresh = () => load();
    socket.on('case:round_complete', refresh);
    socket.on('case:agent_speaking', refresh);
    socket.on('case:verdict_ready', refresh);
    return () => {
      socket.emit('leave:case', id);
      socket.off('case:round_complete', refresh);
      socket.off('case:agent_speaking', refresh);
      socket.off('case:verdict_ready', refresh);
    };
  }, [id]);

  if (!data) return <p className="text-text-secondary">Loading...</p>;

  const { case: caseDoc, rounds, verdict } = data;

  return (
    <div>
      <Link to="/cases" className="text-primary text-sm hover:underline">← Back to Cases</Link>
      <h2 className="font-heading text-2xl font-bold mt-4 mb-2">{caseDoc.title}</h2>
      <p className="text-text-secondary text-sm mb-6">
        Status: {caseDoc.status} • Phase: {caseDoc.currentPhase}
        {caseDoc.currentAgent && ` • ${caseDoc.currentAgent} speaking`}
      </p>

      {rounds?.map((round) => (
        <div key={round._id} className="bg-surface border border-white/5 rounded-xl p-5 mb-4">
          <h3 className="font-heading font-semibold mb-3 capitalize">
            {round.phase?.replace(/_/g, ' ')} (Round {round.roundNumber})
          </h3>
          <div className="space-y-4">
            {round.messages?.map((msg, i) => (
              <div key={i} className="bg-background rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-primary">{msg.agentName}</p>
                  <span className="text-xs text-text-secondary">Confidence: {msg.confidence}%</span>
                </div>
                <p className="text-sm font-medium">{msg.position}</p>
                <p className="text-text-secondary text-sm mt-2">{msg.reasoning}</p>
                {msg.factCheckFlags?.length > 0 && (
                  <p className="text-amber-400 text-xs mt-2">Flags: {msg.factCheckFlags.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {verdict && (
        <div className="bg-surface border-l-4 border-emerald-500 rounded-xl p-6">
          <h3 className="font-heading font-semibold text-emerald-400 mb-2">Final Verdict</h3>
          <p className="font-medium text-lg">{verdict.statement}</p>
          <p className="text-text-secondary text-sm mt-3">{verdict.justification}</p>
          <p className="text-xs text-text-secondary mt-2">Confidence: {verdict.confidence}%</p>
        </div>
      )}
    </div>
  );
}
