import { AGENT_COLORS } from '../../lib/constants';

export default function AgentAvatar({ name, agentId, size = 'md', glow = false, className = '' }) {
  const initial = (name || '?')[0].toUpperCase();
  const color = AGENT_COLORS[agentId] || '#4f6ef7';
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl' };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-heading font-bold shrink-0 ${className}`}
      style={{
        background: `${color}22`,
        color,
        border: `2px solid ${color}`,
        boxShadow: glow ? `0 0 20px ${color}66` : 'none',
      }}
    >
      {initial}
    </div>
  );
}
