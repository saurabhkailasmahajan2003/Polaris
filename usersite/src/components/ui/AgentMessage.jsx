import { motion } from 'framer-motion';
import AgentAvatar from './AgentAvatar';
import MiniChart from './MiniChart';

export default function AgentMessage({ message }) {
  const { agentId, agentName, round, time, content, confidence, mention, flagged, tags } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex gap-3">
        <AgentAvatar name={agentName} agentId={agentId} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-heading font-semibold text-sm">{agentName}</span>
            <span className="text-[10px] font-mono text-text-muted">Round {round}</span>
            <span className="text-[10px] text-text-muted">• {time}</span>
            {flagged && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-danger/20 text-danger border border-danger/30">
                Fact Checker Flagged
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {mention && <span className="text-primary">@{mention} </span>}
            {content.replace(new RegExp(`@${mention}[\\s:]*`, 'i'), '')}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {confidence && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-text-secondary">
                Confidence: {confidence}%
              </span>
            )}
            {tags?.map((t) => (
              <span key={t} className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                t === 'Supported' ? 'bg-success/10 text-success border-success/30' : 'bg-primary/10 text-primary border-primary/30'
              }`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AgentPositionCard({ agentId, name, position, reasoning, confidence, stance }) {
  const stanceColors = { Supports: 'text-success', Conditional: 'text-warning', Concerns: 'text-danger' };
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex gap-3">
        <AgentAvatar name={name} agentId={agentId} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-heading font-semibold text-sm">{name}</p>
              {stance && <p className={`text-xs font-mono mt-0.5 ${stanceColors[stance] || 'text-text-secondary'}`}>{stance}</p>}
            </div>
            <span className="text-xs font-mono text-text-secondary">{confidence}%</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">{reasoning}</p>
          <MiniChart trend={stance === 'Concerns' ? 'mixed' : 'up'} className="mt-2" />
        </div>
      </div>
    </div>
  );
}
