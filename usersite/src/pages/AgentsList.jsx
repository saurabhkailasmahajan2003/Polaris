import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AgentAvatar from '../components/ui/AgentAvatar';
import { agentsApi } from '../lib/api';

export default function AgentsList() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    agentsApi.list().then((all) => setAgents(all.filter((a) => !a.isJudge))).catch(() => {});
  }, []);

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <header className="mb-6 md:mb-8 hidden md:block">
          <h1 className="font-heading text-2xl font-bold">EXPERT AGENTS</h1>
          <p className="text-text-secondary text-sm mt-1">The minds that deliberate on civilization&apos;s greatest questions</p>
        </header>
        <div className="grid md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.agentId}
              to={`/agents/${agent.agentId}`}
              className="glass-card rounded-xl p-5 flex gap-4 hover:neon-glow transition-all group"
            >
              <AgentAvatar name={agent.name} agentId={agent.agentId} size="lg" glow={!!agent.activeCaseId} />
              <div>
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors" style={{ color: agent.color }}>{agent.name}</h3>
                <p className="text-sm text-text-secondary">{agent.role}</p>
                <p className="text-xs text-text-muted mt-2 line-clamp-2">{agent.personality}</p>
                {agent.activeCaseId && <span className="text-[10px] text-success font-mono mt-2 block">● Active</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
