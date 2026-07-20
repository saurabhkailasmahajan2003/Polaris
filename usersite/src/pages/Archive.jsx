import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageShell from '../components/layout/PageShell';
import CaseCard from '../components/ui/CaseCard';
import { archiveApi } from '../lib/api';

export default function Archive() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    archiveApi.list({ search }).then((data) => {
      if (data.archives?.length) {
        setArchives(data.archives.map((a) => ({
          id: a.caseId?.slice(-2) || a._id,
          title: a.title,
          verdict: a.verdict,
          date: new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          confidence: 80,
          agents: a.participatingAgents?.length || 7,
          caseId: a.caseId,
        })));
      } else {
        setArchives([]);
      }
    }).catch(() => {
      setArchives([]);
    }).finally(() => setLoading(false));
  }, [search]);

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell title="City Archive" subtitle="Explore completed cases and verdicts">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 md:mb-8">
          <input
            placeholder="Search archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent w-full sm:col-span-2"
          />
          <select className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent w-full"><option>All Categories</option></select>
          <select className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent w-full"><option>All Verdicts</option></select>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <select className="glass-card rounded-lg px-3 py-2 text-sm bg-transparent flex-1 min-w-[120px] sm:flex-none"><option>All Agents</option></select>
          <div className="flex rounded-lg border border-white/10 overflow-hidden ml-auto">
            <button type="button" onClick={() => setView('grid')} className={`px-3 py-2 text-xs sm:text-sm touch-manipulation ${view === 'grid' ? 'bg-primary/20 text-primary' : 'text-text-secondary'}`}>Grid</button>
            <button type="button" onClick={() => setView('list')} className={`px-3 py-2 text-xs sm:text-sm touch-manipulation ${view === 'list' ? 'bg-primary/20 text-primary' : 'text-text-secondary'}`}>List</button>
          </div>
        </div>

        {loading && <p className="text-sm text-text-muted text-center py-8">Loading archive…</p>}
        {!loading && archives.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">No completed cases yet.</p>
        )}

        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4' : 'space-y-3'}>
          {archives.map((item) => (
            <CaseCard
              key={item.id || item.caseId}
              caseNum={item.id}
              title={item.title}
              verdict={item.verdict}
              date={item.date}
              confidence={item.confidence || 84}
              agents={item.agents || 7}
              agentIds={['economist', 'legal_expert', 'ethics_expert', 'fact_checker', 'judge']}
              onClick={() => navigate(`/cases/${item.caseId || item.id}?mode=quick`)}
            />
          ))}
        </div>

        {archives.length > 0 && (
          <button type="button" className="w-full mt-6 sm:mt-8 py-3 border border-white/20 rounded-xl text-sm font-medium hover:border-primary/50 hover:text-primary transition-all touch-manipulation">
            Load More Cases
          </button>
        )}
      </PageShell>
    </AppLayout>
  );
}
