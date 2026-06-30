import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import PageShell, { ScrollTabs, TabButton } from '../components/layout/PageShell';
import CategoryBadge from '../components/ui/CategoryBadge';
import { EventCard } from '../components/ui/CaseCard';
import { eventsApi, votesApi } from '../lib/api';
import { DEMO_EVENTS } from '../lib/constants';

const RANK_STYLES = ['border-warning shadow-[0_0_20px_rgba(245,158,11,0.3)]', 'border-gray-400/50', 'border-amber-700/50'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];
const TABS = [
  { id: 'trending_events', label: 'Trending', full: 'Trending Events' },
  { id: 'top_voted', label: 'Top Voted', full: 'Top Voted' },
  { id: 'my_votes', label: 'My Votes', full: 'My Votes' },
];

export default function PublicSquare() {
  const [tab, setTab] = useState('trending_events');
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [voting, setVoting] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    eventsApi.list().then((data) => {
      if (data?.length) setEvents(data.map((e, i) => ({ ...e, votes: e.voteCount, image: DEMO_EVENTS[i % 6]?.image })));
    }).catch(() => {});
  }, []);

  const top3 = [...events].sort((a, b) => (b.votes || b.voteCount || 0) - (a.votes || a.voteCount || 0)).slice(0, 3);
  const filtered = events.filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()));

  const handleVote = async (id) => {
    setVoting(id);
    try {
      await votesApi.vote(id);
      const data = await eventsApi.list();
      setEvents(data.map((e, i) => ({ ...e, votes: e.voteCount, image: DEMO_EVENTS[i % 6]?.image })));
    } catch { /* demo mode */ }
    setVoting(null);
  };

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell
        title="Public Square"
        subtitle="Vote on real-world events to bring them into Polaris"
      >
        <ScrollTabs>
          {TABS.map((t) => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              <span className="sm:hidden">{t.label}</span>
              <span className="hidden sm:inline">{t.full}</span>
            </TabButton>
          ))}
        </ScrollTabs>

        <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text-muted mb-3 sm:mb-4">
          Top 3 Entering Polaris Today
        </h2>
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
                <img src={event.image || DEMO_EVENTS[i]?.image} alt="" className="w-full h-full object-cover opacity-80" />
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
          {filtered.map((event) => (
            <EventCard key={event._id || event.id} event={event} onVote={handleVote} voting={voting === (event._id || event.id)} />
          ))}
        </div>
      </PageShell>
    </AppLayout>
  );
}
