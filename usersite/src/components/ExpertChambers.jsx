import { useEffect, useState } from 'react';
import { agentsApi } from '../lib/api';

export default function ExpertChambers({ onClose, onOpenAgent }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    agentsApi.list().then((all) => setAgents(all.filter((a) => !a.isJudge))).catch(console.error);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Expert Chambers</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>
      <p className="text-text-secondary text-sm mb-6">The ten minds that deliberate on civilization's greatest questions.</p>
      <div className="space-y-2">
        {agents.map((agent) => (
          <button
            key={agent.agentId}
            type="button"
            onClick={() => onOpenAgent?.(agent.agentId)}
            className="w-full text-left bg-city border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-colors flex items-center gap-3"
          >
            <span className="text-2xl">{agent.avatar}</span>
            <div>
              <p className="font-medium text-sm" style={{ color: agent.color }}>{agent.name}</p>
              <p className="text-text-secondary text-xs">{agent.role}</p>
            </div>
            {agent.activeCaseId && (
              <span className="ml-auto text-[10px] text-primary animate-pulse font-mono">ACTIVE</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
