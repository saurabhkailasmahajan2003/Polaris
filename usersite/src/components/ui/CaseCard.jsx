import { Link } from 'react-router-dom';
import VerdictBadge from './VerdictBadge';
import CategoryBadge from './CategoryBadge';
import { AGENT_COLORS } from '../../lib/constants';

export default function CaseCard({ caseNum, title, verdict, date, confidence, agents = 7, agentIds = [], onClick, className = '' }) {
  const inner = (
  <div className={`glass-card rounded-xl p-4 hover:neon-glow transition-all cursor-pointer group ${className}`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-mono text-text-muted">#{caseNum}</span>
      {verdict && <VerdictBadge verdict={verdict} />}
    </div>
    <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">{title}</h3>
    {date && <p className="text-[10px] text-text-muted mt-1 font-mono">{date}</p>}
    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.06]">
      <span className="text-[10px] font-mono text-text-secondary">Confidence: {confidence}%</span>
      <span className="text-[10px] font-mono text-text-secondary">Agents: {agents}</span>
    </div>
    {agentIds.length > 0 && (
      <div className="flex -space-x-2 mt-3">
        {agentIds.slice(0, 5).map((id) => (
          <div key={id} className="w-6 h-6 rounded-full border border-night text-[8px] flex items-center justify-center font-bold" style={{ background: `${AGENT_COLORS[id] || '#4f6ef7'}33`, color: AGENT_COLORS[id] }}>
            {id[0]?.toUpperCase()}
          </div>
        ))}
      </div>
    )}
  </div>
  );

  if (onClick) return <button type="button" onClick={onClick} className="w-full text-left">{inner}</button>;
  return inner;
}

export function EventCard({ event, onVote, voting }) {
  return (
    <div className="glass-card rounded-xl p-4 flex gap-4 hover:border-primary/30 transition-all">
      {event.image && (
        <img src={event.image} alt="" className="w-24 h-20 object-cover rounded-lg shrink-0 hidden sm:block" />
      )}
      <div className="flex-1 min-w-0">
        <CategoryBadge category={event.category} className="mb-2" />
        <h3 className="font-heading font-semibold text-sm">{event.title}</h3>
        <p className="text-xs text-text-muted mt-1 line-clamp-2">{event.description}</p>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-sm font-mono text-text-secondary">{event.voteCount?.toLocaleString?.() || event.votes?.toLocaleString?.()} votes</span>
        {onVote && (
          <button
            type="button"
            onClick={() => onVote(event._id || event.id)}
            disabled={voting}
            className="px-4 py-1.5 text-xs font-medium border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all disabled:opacity-50"
          >
            Vote
          </button>
        )}
      </div>
    </div>
  );
}
