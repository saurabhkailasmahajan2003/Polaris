import { useEffect, useState } from 'react';
import { statsApi, casesApi, eventsApi } from '../../lib/api';
import { getSocket } from '../../lib/socket';

function Metric({ label, value, color = 'from-primary to-tertiary' }) {
  return (
    <div className="flex-1 min-w-[100px]">
      <div className="flex justify-between mb-1">
        <span className="text-[9px] uppercase tracking-widest text-text-muted font-mono">{label}</span>
        <span className="text-[10px] font-mono text-text-secondary">{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function WorldStateBar() {
  const [state, setState] = useState({ trust: 84, economy: 72, freedom: 78, crime: 12, health: 81, happiness: 76 });

  useEffect(() => {
    const load = async () => {
      try {
        const [stats, cases, events] = await Promise.all([statsApi.get(), casesApi.list(), eventsApi.list()]);
        const votes = events.reduce((s, e) => s + (e.voteCount || 0), 0);
        setState({
          trust: Math.min(98, 70 + stats.completedVerdicts * 3),
          economy: Math.min(95, 60 + stats.activeCases * 8),
          freedom: 78,
          crime: Math.max(5, 20 - stats.completedVerdicts * 2),
          health: Math.min(90, 75 + votes / 50),
          happiness: Math.min(92, 70 + stats.completedVerdicts * 2),
        });
      } catch { /* defaults */ }
    };
    load();
    const socket = getSocket();
    socket.on('case:verdict_ready', load);
    return () => socket.off('case:verdict_ready', load);
  }, []);

  return (
    <div className="border-b border-white/[0.06] bg-surface/60 backdrop-blur-md px-4 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-mono">World State</span>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-4">
        <Metric label="Trust" value={state.trust} />
        <Metric label="Economy" value={state.economy} color="from-warning to-amber-400" />
        <Metric label="Freedom" value={state.freedom} color="from-secondary to-purple-400" />
        <Metric label="Crime" value={state.crime} color="from-danger to-red-400" />
        <Metric label="Health" value={state.health} color="from-success to-emerald-400" />
        <Metric label="Happiness" value={state.happiness} color="from-tertiary to-cyan-400" />
      </div>
    </div>
  );
}
