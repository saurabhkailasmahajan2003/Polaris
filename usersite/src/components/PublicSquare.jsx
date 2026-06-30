import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { eventsApi, votesApi } from '../lib/api';

export default function PublicSquare({ onClose }) {
  const [events, setEvents] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [voting, setVoting] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    eventsApi.list().then(setEvents).catch(console.error);
    votesApi.top(5).then(setTopEvents).catch(console.error);
  }, []);

  const topIds = new Set(topEvents.map((e) => e._id));

  const handleVote = async (eventId) => {
    setVoting(eventId);
    setMessage('');
    try {
      await votesApi.vote(eventId);
      const [all, top] = await Promise.all([eventsApi.list(), votesApi.top(5)]);
      setEvents(all);
      setTopEvents(top);
      setMessage('Vote recorded!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setVoting(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Public Square</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>

      <p className="text-text-secondary text-sm mb-4">Vote on events to bring them into Polaris for expert deliberation.</p>
      {message && <p className="text-primary text-sm mb-4">{message}</p>}

      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event._id}
            layout
            className={`bg-city border rounded-xl p-5 ${
              topIds.has(event._id) ? 'border-primary/50 building-active' : 'border-white/5'
            }`}
          >
            {topIds.has(event._id) && (
              <span className="text-xs text-primary font-mono mb-2 block">★ Entering Polaris Today</span>
            )}
            <h3 className="font-heading font-semibold">{event.title}</h3>
            <p className="text-text-secondary text-sm mt-2 line-clamp-3">{event.description}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2 text-xs text-text-secondary">
                <span className="bg-white/5 px-2 py-0.5 rounded">{event.category}</span>
                <span>{event.voteCount} votes</span>
              </div>
              <button
                onClick={() => handleVote(event._id)}
                disabled={voting === event._id}
                className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {voting === event._id ? 'Voting...' : 'Vote'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
