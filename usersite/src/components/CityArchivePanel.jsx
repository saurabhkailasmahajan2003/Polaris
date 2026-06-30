import { useEffect, useState } from 'react';
import { archiveApi } from '../lib/api';
import { VERDICT_BORDERS } from '../lib/constants';

export default function CityArchivePanel({ onClose, onOpenCase }) {
  const [archives, setArchives] = useState([]);
  const [filter, setFilter] = useState({ category: '', search: '' });

  useEffect(() => {
    const params = {};
    if (filter.category) params.category = filter.category;
    if (filter.search) params.search = filter.search;
    archiveApi.list(params).then((data) => setArchives(data.archives || [])).catch(console.error);
  }, [filter]);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">City Archive</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>

      <div className="flex gap-2 mb-4 mt-4">
        <input
          placeholder="Search archive..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="bg-city border border-white/10 rounded-lg px-3 py-1.5 text-sm flex-1"
        />
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="bg-city border border-white/10 rounded-lg px-2 py-1.5 text-sm"
        >
          <option value="">All</option>
          {['politics', 'economics', 'technology', 'legal', 'ethics'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {archives.map((a) => (
          <button
            key={a._id}
            type="button"
            onClick={() => onOpenCase?.(a.caseId)}
            className={`w-full text-left bg-city border border-white/5 border-l-4 ${VERDICT_BORDERS[a.verdict]} rounded-xl p-4 hover:border-primary/30 transition-colors`}
          >
            <p className="font-medium text-sm">{a.title}</p>
            <p className="text-text-secondary text-xs mt-1 line-clamp-1">{a.verdictStatement}</p>
            <p className="text-[10px] text-text-secondary mt-2 font-mono">{new Date(a.completedAt).toLocaleDateString()}</p>
          </button>
        ))}
        {archives.length === 0 && <p className="text-text-secondary text-sm">Archive is empty</p>}
      </div>
    </div>
  );
}
