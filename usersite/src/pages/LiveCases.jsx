import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageShell from '../components/layout/PageShell';
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
      <PageShell title="Live Cases" subtitle="Cases currently under AI deliberation">
        <section className="mb-8 md:mb-10">
          <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text-muted mb-3 sm:mb-4 flex items-center gap-2">
            <LiveBadge /> Active
          </h2>
          <div className="space-y-3">
            {live.length === 0 && <p className="text-text-muted text-sm">No active cases</p>}
            {live.map((c) => (
              <Link
                key={c._id}
                to={`/cases/${c._id}`}
                className="glass-card rounded-xl p-4 sm:p-5 block hover:neon-glow transition-all group touch-manipulation"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <LiveBadge />
                      <CategoryBadge category={c.category} />
                    </div>
                    <h3 className="font-heading font-semibold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-2 capitalize line-clamp-1">
                      {c.currentPhase?.replace(/_/g, ' ')} {c.currentAgent && `• ${c.currentAgent}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {completed.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text-muted mb-3 sm:mb-4">Completed</h2>
            <div className="space-y-3">
              {completed.map((c) => (
                <Link
                  key={c._id}
                  to={`/cases/${c._id}`}
                  className="glass-card rounded-xl p-4 block hover:border-primary/30 transition-all touch-manipulation"
                >
                  <h3 className="font-medium text-sm line-clamp-2">{c.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </PageShell>
    </AppLayout>
  );
}
