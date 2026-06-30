import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageShell from '../components/layout/PageShell';
import AgentAvatar from '../components/ui/AgentAvatar';
import { agentsApi } from '../lib/api';

export default function AgentsList() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    agentsApi.list().then((all) => setAgents(all.filter((a) => !a.isJudge))).catch(() => {});
  }, []);

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell
        title="Expert Agents"
        subtitle="The minds that deliberate on civilization's greatest questions"
        maxWidth="max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.agentId}
              to={`/agents/${agent.agentId}`}
              className="glass-card rounded-xl p-4 sm:p-5 flex gap-3 sm:gap-4 hover:neon-glow transition-all group touch-manipulation min-w-0"
            >
              <AgentAvatar name={agent.name} agentId={agent.agentId} size="lg" glow={!!agent.activeCaseId} />
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-semibold text-sm sm:text-base group-hover:text-primary transition-colors truncate" style={{ color: agent.color }}>
                  {agent.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary truncate">{agent.role}</p>
                <p className="text-xs text-text-muted mt-1 sm:mt-2 line-clamp-2">{agent.personality}</p>
                {agent.activeCaseId && <span className="text-[10px] text-success font-mono mt-2 block">● Active</span>}
              </div>
            </Link>
          ))}
        </div>
      </PageShell>
    </AppLayout>
  );
}
