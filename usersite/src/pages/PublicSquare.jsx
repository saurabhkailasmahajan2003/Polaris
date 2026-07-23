import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import PageShell, { ScrollTabs, TabButton } from '../components/layout/PageShell';
import CategoryBadge from '../components/ui/CategoryBadge';
import { EventCard } from '../components/ui/CaseCard';
import { eventsApi, votesApi, casesApi } from '../lib/api';
import { CATEGORY_IMAGES } from '../lib/constants';
import { getSocket } from '../lib/socket';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const RANK_STYLES = ['border-warning shadow-[0_0_20px_rgba(245,158,11,0.3)]', 'border-gray-400/50', 'border-amber-700/50'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];
const TABS = [
  { id: 'trending_events', label: 'Trending', full: 'Trending Events' },
  { id: 'top_voted', label: 'Top Voted', full: 'Top Voted' },
  { id: 'my_votes', label: 'My Votes', full: 'My Votes' },
];

function withDisplayFields(e) {
  return {
    ...e,
    votes: e.voteCount ?? e.votes ?? 0,
    image: e.image || CATEGORY_IMAGES[e.category] || CATEGORY_IMAGES.general,
  };
}

export default function PublicSquare() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('trending_events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deployedAway, setDeployedAway] = useState(false);
  const [voting, setVoting] = useState(null);
  const [search, setSearch] = useState('');

  const loadEvents = async () => {
    try {
      const [data, cases] = await Promise.all([
        eventsApi.list(),
        casesApi.list().catch(() => []),
      ]);
      const list = Array.isArray(data) ? data.map(withDisplayFields) : [];
      setEvents(list);
      const hasCityWork = Array.isArray(cases) && cases.some((c) =>
        ['pending', 'processing', 'completed'].includes(c.status)
      );
      setDeployedAway(list.length === 0 && hasCityWork);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    const socket = getSocket();
    const onDeployed = () => {
      setEvents([]);
      setDeployedAway(true);
      setLoading(false);
    };
    socket.on('cases:deployed', onDeployed);
    return () => socket.off('cases:deployed', onDeployed);
  }, []);

  const top3 = [...events].sort((a, b) => (b.votes || b.voteCount || 0) - (a.votes || a.voteCount || 0)).slice(0, 3);
  const filtered = events.filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()));

  const handleVote = async (id) => {
    setVoting(id);
    try {
      await votesApi.vote(id);
      await loadEvents();
    } catch { /* ignore */ }
    setVoting(null);
  };

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell
        title="Public Square"
        subtitle="Vote on real-world events to bring them into Polaris"
      >
        <div className="flex justify-end mb-3">
          <LanguageSwitcher compact />
        </div>

        <ScrollTabs>
          {TABS.map((tabItem) => (
            <TabButton key={tabItem.id} active={tab === tabItem.id} onClick={() => setTab(tabItem.id)}>
              <span className="sm:hidden">{tabItem.label}</span>
              <span className="hidden sm:inline">{tabItem.full}</span>
            </TabButton>
          ))}
        </ScrollTabs>

        <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text-muted mb-3 sm:mb-4">
          Top 3 Entering Polaris Today
        </h2>
        {loading ? (
          <p className="text-sm text-text-muted mb-8">Loading events…</p>
        ) : top3.length === 0 ? (
          <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 px-4 py-6 text-center">
            <p className="text-sm text-text-secondary mb-4">
              {deployedAway ? t.squareEmpty : t.feedEmptyIdleBody}
            </p>
            {deployedAway && (
              <Link
                to="/city"
                className="inline-flex px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
              >
                {t.goToCity}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 md:mb-10">
            {top3.map((event, i) => (
              <motion.div
                key={event._id || event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-xl overflow-hidden border-2 ${RANK_STYLES[i]}`}
              >
                <div className="relative h-28 sm:h-32">
                  <img src={event.image} alt="" className="w-full h-full object-cover opacity-80" />
                  <span className="absolute top-2 left-2 text-xl sm:text-2xl">{RANK_LABELS[i]}</span>
                  <CategoryBadge category={event.category} className="absolute top-2 right-2" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-heading font-semibold text-sm line-clamp-2">{event.title}</h3>
                  <p className="text-xs sm:text-sm font-mono text-primary mt-2 flex items-center gap-1">
                    ↑ {(event.votes || event.voteCount || 0).toLocaleString()} votes
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <select className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent w-full">
            <option>All Events</option>
          </select>
          <select className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent w-full">
            <option>All Categories</option>
          </select>
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent w-full sm:col-span-2 lg:col-span-2"
          />
        </div>

        <div className="space-y-3">
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-text-muted py-8 text-center">
              {deployedAway ? t.squareEmpty : 'No events to show. Add events from admin.'}
            </p>
          )}
          {filtered.map((event) => (
            <EventCard key={event._id || event.id} event={event} onVote={handleVote} voting={voting === (event._id || event.id)} />
          ))}
        </div>
      </PageShell>
    </AppLayout>
  );
}
