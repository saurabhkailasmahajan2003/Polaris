import { useEffect, useState } from 'react';
import { casesApi } from '../lib/api';

export default function InvestigationHQ({ onClose, activeCaseIds, onOpenCase }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    casesApi.list().then((all) => {
      setCases(all.filter((c) => ['pending', 'processing'].includes(c.status)));
    }).catch(console.error);
  }, [activeCaseIds]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Investigation HQ</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>
      <p className="text-text-secondary text-sm mb-6">Cases currently under expert deliberation.</p>
      <div className="space-y-3">
        {cases.map((c) => (
          <button
            key={c._id}
            type="button"
            onClick={() => onOpenCase?.(c._id)}
            className={`w-full text-left bg-city border rounded-xl p-4 transition-colors ${
              activeCaseIds.includes(c._id) ? 'border-primary/50 building-active' : 'border-white/5 hover:border-primary/30'
            }`}
          >
            <p className="font-medium text-sm">{c.title}</p>
            <p className="text-xs text-primary mt-1 capitalize">{c.currentPhase?.replace(/_/g, ' ')}</p>
            {c.currentAgent && <p className="text-xs text-text-secondary mt-1">{c.currentAgent} analyzing...</p>}
          </button>
        ))}
        {cases.length === 0 && <p className="text-text-secondary text-sm">No active investigations</p>}
      </div>
    </div>
  );
}
