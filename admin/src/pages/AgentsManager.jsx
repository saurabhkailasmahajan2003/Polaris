import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { agentsApi } from '../lib/api';

export default function AgentsManager() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    agentsApi.list().then(setAgents).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-6">Agents Manager</h2>
      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.agentId} className="bg-surface border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{agent.avatar}</span>
              <div>
                <p className="font-heading font-semibold" style={{ color: agent.color }}>{agent.name}</p>
                <p className="text-text-secondary text-sm">{agent.role}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-3">{agent.personality}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {agent.expertise?.map((e) => (
                <span key={e} className="text-xs bg-white/5 px-2 py-0.5 rounded">{e}</span>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-text-secondary">
              <span>Cases: {agent.casesParticipated}</span>
              <span>Accuracy: {agent.accuracyRate}%</span>
              {agent.activeCaseId && <span className="text-primary animate-pulse">Active</span>}
            </div>
            {agent.caseHistory?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-text-secondary mb-2">Recent History</p>
                {agent.caseHistory.slice(-3).map((h, i) => (
                  <p key={i} className="text-xs text-text-secondary truncate">{h.caseTitle}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
