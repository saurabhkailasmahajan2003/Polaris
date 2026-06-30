import { useEffect, useState } from 'react';
import { verdictsApi } from '../lib/api';
import { VERDICT_BORDERS } from '../lib/constants';

export default function SupremeCourt({ onClose, onOpenCase }) {
  const [verdicts, setVerdicts] = useState([]);

  useEffect(() => {
    verdictsApi.list().then(setVerdicts).catch(console.error);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-1">Institution</p>
          <h2 className="font-heading text-xl font-bold">Supreme Court</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">✕</button>
      </div>
      <p className="text-text-secondary text-sm mb-6">Completed verdicts from Polaris deliberations.</p>
      <div className="space-y-3">
        {verdicts.map((v) => (
          <button
            key={v._id}
            type="button"
            onClick={() => onOpenCase?.(v.caseId)}
            className={`w-full text-left bg-city border border-white/5 border-l-4 ${VERDICT_BORDERS[v.decision]} rounded-xl p-4 hover:border-primary/30 transition-colors`}
          >
            <p className="font-medium text-sm">{v.case?.title}</p>
            <p className="text-text-secondary text-xs mt-1 line-clamp-2">{v.statement}</p>
          </button>
        ))}
        {verdicts.length === 0 && <p className="text-text-secondary text-sm">No verdicts yet</p>}
      </div>
    </div>
  );
}
