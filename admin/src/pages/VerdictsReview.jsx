import { useEffect, useState } from 'react';
import { verdictsApi } from '../lib/api';

const borderColors = {
  approved: 'border-l-emerald-500',
  rejected: 'border-l-red-500',
  approved_with_conditions: 'border-l-amber-500',
  delayed: 'border-l-blue-500',
};

export default function VerdictsReview() {
  const [verdicts, setVerdicts] = useState([]);

  useEffect(() => {
    verdictsApi.list().then(setVerdicts).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-6">Verdicts Review</h2>
      <div className="space-y-4">
        {verdicts.map((v) => (
          <div
            key={v._id}
            className={`bg-surface border border-white/5 border-l-4 ${borderColors[v.decision] || 'border-l-primary'} rounded-xl p-6`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-heading font-semibold">{v.case?.title || 'Case'}</h3>
              <span className="text-xs bg-white/5 px-2 py-1 rounded capitalize">{v.decision?.replace(/_/g, ' ')}</span>
            </div>
            <p className="font-medium">{v.statement}</p>
            <p className="text-text-secondary text-sm mt-3">{v.justification}</p>

            {v.consequences?.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {v.consequences.map((c) => (
                  <div key={c.timeframe} className="bg-background rounded-lg p-3">
                    <p className="text-xs text-primary font-mono mb-1">{c.timeframe?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-text-secondary">{c.socialImpact}</p>
                  </div>
                ))}
              </div>
            )}

            {v.agentPositions?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-text-secondary mb-2">Agent Positions</p>
                <div className="flex flex-wrap gap-2">
                  {v.agentPositions.map((p) => (
                    <span key={p.agentId} className="text-xs bg-white/5 px-2 py-1 rounded">
                      {p.agentName}: {p.finalPosition?.slice(0, 60)}...
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {verdicts.length === 0 && <p className="text-text-secondary">No verdicts yet</p>}
      </div>
    </div>
  );
}
