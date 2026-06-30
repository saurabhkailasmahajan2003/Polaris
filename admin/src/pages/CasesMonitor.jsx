import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { casesApi } from '../lib/api';
import { getSocket } from '../lib/socket';

export default function CasesMonitor() {
  const [cases, setCases] = useState([]);

  const load = () => casesApi.list().then(setCases).catch(console.error);
  useEffect(() => {
    load();
    const socket = getSocket();
    const refresh = () => load();
    socket.on('case:started', refresh);
    socket.on('case:round_complete', refresh);
    socket.on('case:agent_speaking', refresh);
    socket.on('case:verdict_ready', refresh);
    return () => {
      socket.off('case:started', refresh);
      socket.off('case:round_complete', refresh);
      socket.off('case:agent_speaking', refresh);
      socket.off('case:verdict_ready', refresh);
    };
  }, []);

  const statusColor = {
    pending: 'text-amber-400',
    processing: 'text-primary animate-pulse',
    completed: 'text-emerald-400',
    failed: 'text-red-400',
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-6">Cases Monitor</h2>
      <div className="space-y-3">
        {cases.map((c) => (
          <Link
            key={c._id}
            to={`/cases/${c._id}`}
            className="block bg-surface border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-text-secondary text-sm mt-1">{c.category}</p>
                <p className="text-xs text-text-secondary mt-2">
                  Phase: {c.currentPhase?.replace(/_/g, ' ')}
                  {c.currentAgent && ` • ${c.currentAgent}`}
                </p>
              </div>
              <span className={`text-sm font-medium ${statusColor[c.status] || ''}`}>{c.status}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.participatingAgents?.map((a) => (
                <span key={a} className="text-xs bg-white/5 px-2 py-0.5 rounded">{a.replace(/_/g, ' ')}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
