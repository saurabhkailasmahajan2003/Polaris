import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { statsApi, casesApi, eventsApi } from '../../lib/api';
import { getSocket } from '../../lib/socket';

function MetricBar({ label, value, max = 100, unit = '%', accent = 'metric-bar-fill' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex-1 min-w-[120px]">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] uppercase tracking-widest text-text-secondary font-mono">{label}</span>
        <span className="text-xs font-mono text-text-primary">
          {typeof value === 'number' && unit === '%' ? pct : value}
          {unit === '%' ? '%' : unit !== '' ? ` ${unit}` : ''}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${accent}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function WorldStateBar({ liveActivity = 0 }) {
  const [metrics, setMetrics] = useState({
    integrity: 72,
    deliberations: 0,
    verdicts: 0,
    engagement: 0,
    agentPulse: 0,
  });

  const load = async () => {
    try {
      const [stats, cases, events] = await Promise.all([
        statsApi.get(),
        casesApi.list(),
        eventsApi.list(),
      ]);

      const processing = cases.filter((c) => c.status === 'processing').length;
      const completed = cases.filter((c) => c.status === 'completed').length;
      const totalVotes = events.reduce((s, e) => s + (e.voteCount || 0), 0);
      const integrity = stats.completedVerdicts > 0
        ? Math.min(98, 60 + stats.completedVerdicts * 4 + (completed / Math.max(cases.length, 1)) * 20)
        : 68;

      setMetrics({
        integrity: Math.round(integrity),
        deliberations: processing,
        verdicts: stats.completedVerdicts || 0,
        engagement: Math.min(100, totalVotes * 3),
        agentPulse: processing > 0 ? 85 : 40,
      });
    } catch {
      /* keep defaults */
    }
  };

  useEffect(() => {
    load();
    const socket = getSocket();
    const refresh = () => load();
    socket.on('case:started', refresh);
    socket.on('case:verdict_ready', refresh);
    socket.on('case:agent_speaking', () => {
      setMetrics((m) => ({ ...m, agentPulse: Math.min(100, m.agentPulse + 8) }));
    });
    socket.on('city:activity', () => {
      setMetrics((m) => ({ ...m, agentPulse: Math.min(100, m.agentPulse + 5) }));
    });
    return () => {
      socket.off('case:started', refresh);
      socket.off('case:verdict_ready', refresh);
      socket.off('case:agent_speaking');
      socket.off('city:activity');
    };
  }, []);

  useEffect(() => {
    if (liveActivity > 0) {
      setMetrics((m) => ({ ...m, agentPulse: Math.min(100, m.agentPulse + 3) }));
    }
  }, [liveActivity]);

  return (
    <div className="border-b border-white/[0.06] bg-building/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-mono">
              World State
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 via-white/10 to-transparent" />
        </div>
        <div className="flex flex-wrap gap-4 md:gap-6">
          <MetricBar label="Integrity" value={metrics.integrity} />
          <MetricBar label="Deliberations" value={metrics.deliberations} max={5} unit="" accent="bg-amber-500" />
          <MetricBar label="Verdicts" value={metrics.verdicts} max={20} unit="" accent="bg-emerald-500" />
          <MetricBar label="Engagement" value={metrics.engagement} accent="bg-secondary" />
          <MetricBar label="Agent Pulse" value={metrics.agentPulse} accent="metric-bar-fill" />
        </div>
      </div>
    </div>
  );
}
