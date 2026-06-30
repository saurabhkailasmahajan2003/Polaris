import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import CategoryBadge from '../components/ui/CategoryBadge';
import { EventCard } from '../components/ui/CaseCard';
import { eventsApi, votesApi } from '../lib/api';
import { DEMO_EVENTS } from '../lib/constants';

const RANK_STYLES = ['border-warning shadow-[0_0_20px_rgba(245,158,11,0.3)]', 'border-gray-400/50', 'border-amber-700/50'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

export default function PublicSquare() {
  const [tab, setTab] = useState('trending');
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
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8 hidden md:block">
          <h1 className="font-heading text-2xl font-bold tracking-wide">PUBLIC SQUARE</h1>
          <p className="text-text-secondary text-sm mt-1">Vote on real-world events to bring them into Polaris</p>
        </header>

        <div className="flex gap-2 mb-8 border-b border-white/[0.06] pb-px">
          {['Trending Events', 'Top Voted', 'My Votes'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t.toLowerCase().replace(' ', '_'))}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === t.toLowerCase().replace(' ', '_') ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Top 3 Entering Polaris Today</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {top3.map((event, i) => (
            <motion.div
              key={event._id || event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-xl overflow-hidden border-2 ${RANK_STYLES[i]}`}
            >
              <div className="relative h-32">
                <img src={event.image || DEMO_EVENTS[i]?.image} alt="" className="w-full h-full object-cover opacity-80" />
                <span className="absolute top-2 left-2 text-2xl">{RANK_LABELS[i]}</span>
                <CategoryBadge category={event.category} className="absolute top-2 right-2" />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-sm">{event.title}</h3>
                <p className="text-sm font-mono text-primary mt-2 flex items-center gap-1">
                  ↑ {(event.votes || event.voteCount || 0).toLocaleString()} votes
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <select className="glass-card rounded-lg px-3 py-2 text-sm bg-transparent">
            <option>All Events</option>
          </select>
          <select className="glass-card rounded-lg px-3 py-2 text-sm bg-transparent">
            <option>All Categories</option>
          </select>
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-card rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px] bg-transparent"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((event) => (
            <EventCard key={event._id || event.id} event={event} onVote={handleVote} voting={voting === (event._id || event.id)} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
