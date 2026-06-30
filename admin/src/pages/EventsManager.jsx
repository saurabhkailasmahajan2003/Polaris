import { useEffect, useState } from 'react';
import { eventsApi, casesApi } from '../lib/api';

const CATEGORIES = ['politics', 'economics', 'technology', 'legal', 'ethics', 'human_rights', 'social', 'environment', 'security', 'general'];

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', source: '', category: 'general', image: '' });
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState('');

  const load = () => eventsApi.list().then(setEvents).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventsApi.create(form);
      setForm({ title: '', description: '', source: '', category: 'general', image: '' });
      load();
      setMessage('Event created');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const result = await casesApi.deploy(3);
      setMessage(result.message);
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setDeploying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await eventsApi.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold">Events Manager</h2>
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 disabled:opacity-50"
        >
          {deploying ? 'Deploying...' : 'Deploy Top Voted Cases'}
        </button>
      </div>

      {message && <p className="text-primary text-sm mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="bg-surface border border-white/5 rounded-xl p-6 mb-8 grid gap-4">
        <h3 className="font-heading font-semibold">Post New Event</h3>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[100px]"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Source URL"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium w-fit">
          Post Event
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="font-heading font-semibold mb-2">All Events</h3>
        {events.map((event) => (
          <div key={event._id} className="bg-surface border border-white/5 rounded-xl p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-text-secondary text-sm mt-1 line-clamp-2">{event.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-text-secondary">
                <span className="bg-white/5 px-2 py-0.5 rounded">{event.category}</span>
                <span>{event.voteCount} votes</span>
                {event.deployed && <span className="text-emerald-400">Deployed</span>}
              </div>
            </div>
            {!event.deployed && (
              <button onClick={() => handleDelete(event._id)} className="text-red-400 text-sm hover:underline">
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
