import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AgentAvatar from '../components/ui/AgentAvatar';
import LiveBadge from '../components/ui/LiveBadge';
import { agentsApi } from '../lib/api';

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    agentsApi.get(id).then(setAgent).catch(() => {});
  }, [id]);

  const a = agent || {
    name: 'Ethics Expert',
    role: 'Moral Philosopher',
    agentId: 'ethics_expert',
    personality: 'Principled • Empathetic • Thoughtful • Direct',
    expertise: ['Moral Philosophy', 'Human Rights', 'Ethics', 'Justice', 'Bioethics'],
    casesParticipated: 127,
    confidenceScore: 76,
    accuracyRate: 84,
    color: '#ec4899',
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="glass-card rounded-2xl p-8 relative">
          <div className="absolute top-6 right-6 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Accuracy Record</p>
            <div className="w-20 h-20 rounded-full border-4 border-success flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <span className="font-heading text-xl font-bold text-success">{a.accuracyRate || 84}%</span>
            </div>
            <p className="text-[10px] text-text-muted mt-1">Last 50 verdicts</p>
          </div>

          <div className="flex flex-col items-center text-center mb-8 pr-24">
            <AgentAvatar name={a.name} agentId={a.agentId || id} size="xl" glow />
            <h1 className="font-heading text-3xl font-bold mt-4">{a.name}</h1>
            <p className="text-text-secondary mt-1">{a.role || 'Specializes in moral philosophy, human impact, and ethical reasoning.'}</p>
            <LiveBadge className="mt-3" />
            <span className="text-xs text-text-muted mt-1">Active in 3 cases</span>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Personality</p>
            <p className="text-sm text-text-secondary">{typeof a.personality === 'string' && a.personality.includes('•') ? a.personality : 'Principled • Empathetic • Thoughtful • Direct'}</p>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Expertise</p>
            <div className="flex flex-wrap gap-2">
              {(a.expertise || []).map((e) => (
                <span key={e} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">{e}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Cases Participated', value: a.casesParticipated || 127 },
              { label: 'Verdicts Influenced', value: 89 },
              { label: 'Average Confidence', value: `${a.confidenceScore || 76}%` },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 text-center bg-surface/50">
                <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-[10px] text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
