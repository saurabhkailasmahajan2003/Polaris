import { useEffect, useState } from 'react';
import { casesApi } from '../lib/api';

export default function FactCheckBureau({ onClose, onOpenCase }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    casesApi.list().then((all) => {
      setCases(all.filter((c) => c.verifiedEvidence));
    }).catch(console.error);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Fact Check Bureau</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>
      <p className="text-text-secondary text-sm mb-6">Verified evidence and flagged claims from active deliberations.</p>
      <div className="space-y-3">
        {cases.map((c) => (
          <button
            key={c._id}
            type="button"
            onClick={() => onOpenCase?.(c._id)}
            className="w-full text-left bg-city border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-colors"
          >
            <p className="font-medium mb-2">{c.title}</p>
            {c.verifiedEvidence?.verified_facts?.map((f, i) => (
              <div key={i} className="text-sm flex gap-2 mt-1">
                <span className={f.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}>●</span>
                <span className="text-text-secondary">{f.fact}</span>
              </div>
            ))}
            {c.verifiedEvidence?.flagged_claims?.map((f, i) => (
              <div key={i} className="text-xs text-red-400 mt-1">⚠ {f.claim}</div>
            ))}
          </button>
        ))}
        {cases.length === 0 && <p className="text-text-secondary text-sm">No verified evidence yet</p>}
      </div>
    </div>
  );
}
