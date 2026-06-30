import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import LiveBadge from '../components/ui/LiveBadge';
import CategoryBadge from '../components/ui/CategoryBadge';
import { casesApi } from '../lib/api';
import { useApp } from '../context/AppContext';

export default function LiveCases() {
  const [cases, setCases] = useState([]);
  const { activeCases } = useApp();

  useEffect(() => {
    casesApi.list().then(setCases).catch(() => {});
  }, [activeCases]);

  const live = cases.filter((c) => ['pending', 'processing'].includes(c.status));
  const completed = cases.filter((c) => c.status === 'completed');

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <header className="mb-6 md:mb-8 hidden md:block">
          <h1 className="font-heading text-2xl font-bold">LIVE CASES</h1>
          <p className="text-text-secondary text-sm mt-1">Cases currently under AI deliberation</p>
        </header>

        <section className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
            <LiveBadge /> Active
          </h2>
          <div className="space-y-3">
            {live.length === 0 && <p className="text-text-muted text-sm">No active cases</p>}
            {live.map((c) => (
              <Link key={c._id} to={`/cases/${c._id}`} className="glass-card rounded-xl p-5 block hover:neon-glow transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <LiveBadge />
                      <CategoryBadge category={c.category} />
                    </div>
                    <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-xs text-text-muted mt-2 capitalize">{c.currentPhase?.replace(/_/g, ' ')} {c.currentAgent && `• ${c.currentAgent}`}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {completed.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Completed</h2>
            <div className="space-y-3">
              {completed.map((c) => (
                <Link key={c._id} to={`/cases/${c._id}`} className="glass-card rounded-xl p-4 block hover:border-primary/30 transition-all">
                  <h3 className="font-medium text-sm">{c.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
