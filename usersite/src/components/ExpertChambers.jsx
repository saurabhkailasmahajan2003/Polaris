import { useEffect, useState } from 'react';
import { agentsApi } from '../lib/api';
import { useApp } from '../context/AppContext';
import { buildingLabel } from '../lib/agentBuildings';

export default function ExpertChambers({ onClose, onOpenAgent }) {
  const [agents, setAgents] = useState([]);
  const { speakingAgent, typingAgent } = useApp();

  useEffect(() => {
    agentsApi.list().then((all) => setAgents(all.filter((a) => !a.isJudge))).catch(console.error);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Expert Chambers</h2>
        </div>
        <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>
      <p className="text-text-secondary text-sm mb-4">
        The minds that deliberate — when one speaks, their chamber lights up.
      </p>

      {speakingAgent && speakingAgent.buildingId === 'expert_chambers' && (
        <div className="mb-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2.5">
          <p className="text-xs font-mono text-cyan-300 animate-pulse">
            ● {speakingAgent.agentName} is forming an opinion · {buildingLabel(speakingAgent.buildingId)}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {agents.map((agent) => {
          const isSpeaking = speakingAgent?.agentId === agent.agentId
            || typingAgent === agent.name;
          return (
            <button
              key={agent.agentId}
              type="button"
              onClick={() => onOpenAgent?.(agent.agentId)}
              className={`w-full text-left bg-city border rounded-xl p-4 transition-colors flex items-center gap-3 ${
                isSpeaking
                  ? 'border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'border-white/5 hover:border-primary/30'
              }`}
            >
              <span className="text-2xl">{agent.avatar}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm" style={{ color: agent.color }}>{agent.name}</p>
                <p className="text-text-secondary text-xs">{agent.role}</p>
                {isSpeaking && (
                  <p className="text-[10px] text-cyan-300 font-mono mt-1 animate-pulse">
                    Thinking carefully… give them a moment
                  </p>
                )}
              </div>
              {isSpeaking ? (
                <span className="ml-auto text-[10px] text-cyan-300 animate-pulse font-mono shrink-0">SPEAKING</span>
              ) : agent.activeCaseId ? (
                <span className="ml-auto text-[10px] text-primary animate-pulse font-mono shrink-0">ACTIVE</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
