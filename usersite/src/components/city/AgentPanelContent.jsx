import { useEffect, useState } from 'react';
import { agentsApi } from '../../lib/api';

export default function AgentPanelContent({ agentId, onBack }) {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    agentsApi.get(agentId).then(setAgent).catch(console.error);
  }, [agentId]);

  if (!agent) return <p className="text-text-secondary text-sm p-6">Loading agent...</p>;

  return (
    <div className="h-full overflow-y-auto p-6">
      <button onClick={onBack} className="text-primary text-sm hover:underline mb-4">← Back</button>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{agent.avatar}</span>
        <div>
          <h2 className="font-heading text-xl font-bold" style={{ color: agent.color }}>{agent.name}</h2>
          <p className="text-text-secondary text-sm">{agent.role}</p>
        </div>
      </div>
      <p className="text-text-secondary text-sm mb-4">{agent.personality}</p>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {agent.expertise?.map((e) => (
          <span key={e} className="text-xs bg-city border border-white/5 px-2 py-0.5 rounded">{e}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-city border border-white/5 rounded-lg p-3">
          <p className="text-xl font-heading font-bold text-primary">{agent.casesParticipated}</p>
          <p className="text-[10px] text-text-secondary mt-1">Cases</p>
        </div>
        <div className="bg-city border border-white/5 rounded-lg p-3">
          <p className="text-xl font-heading font-bold text-primary">{agent.confidenceScore}%</p>
          <p className="text-[10px] text-text-secondary mt-1">Confidence</p>
        </div>
      </div>
    </div>
  );
}
