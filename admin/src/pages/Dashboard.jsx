import { useEffect, useState } from 'react';
import { casesApi, statsApi } from '../lib/api';
import { getSocket } from '../lib/socket';

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-surface border border-white/5 rounded-xl p-6">
      <p className="text-text-secondary text-sm">{label}</p>
      <p className={`font-heading text-3xl font-bold mt-2 ${accent}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalEvents: 0, activeCases: 0, completedVerdicts: 0 });
  const [activeCases, setActiveCases] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    statsApi.get().then(setStats).catch(console.error);
    casesApi.list().then((cases) => {
      setActiveCases(cases.filter((c) => ['pending', 'processing'].includes(c.status)));
    });

    const socket = getSocket();
    socket.on('case:started', (data) => {
      setActivity((a) => [`Case started: ${data.case?.title}`, ...a].slice(0, 10));
      casesApi.list().then((cases) => {
        setActiveCases(cases.filter((c) => ['pending', 'processing'].includes(c.status)));
      });
    });
    socket.on('case:round_complete', (data) => {
      setActivity((a) => [`Round ${data.round?.roundNumber} complete`, ...a].slice(0, 10));
    });
    socket.on('case:agent_speaking', (data) => {
      setActivity((a) => [`${data.agentName} speaking...`, ...a].slice(0, 10));
    });
    socket.on('case:verdict_ready', () => {
      statsApi.get().then(setStats);
    });

    return () => {
      socket.off('case:started');
      socket.off('case:round_complete');
      socket.off('case:agent_speaking');
      socket.off('case:verdict_ready');
    };
  }, []);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Events" value={stats.totalEvents} accent="text-primary" />
        <StatCard label="Active Cases" value={stats.activeCases} accent="text-amber-400" />
        <StatCard label="Completed Verdicts" value={stats.completedVerdicts} accent="text-emerald-400" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Live Case Processing</h3>
          {activeCases.length === 0 ? (
            <p className="text-text-secondary text-sm">No active cases</p>
          ) : (
            <div className="space-y-3">
              {activeCases.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-text-secondary text-xs mt-1">
                      {c.currentPhase?.replace('_', ' ')} {c.currentAgent && `• ${c.currentAgent}`}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    c.status === 'processing' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-white/10 text-text-secondary'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Live Activity</h3>
          {activity.length === 0 ? (
            <p className="text-text-secondary text-sm">Waiting for activity...</p>
          ) : (
            <ul className="space-y-2">
              {activity.map((msg, i) => (
                <li key={i} className="text-sm text-text-secondary font-mono">{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
