import LiveBadge from './LiveBadge';

export default function LiveTicker({ messages = [], citizens = 12842 }) {
  const items = messages.length > 0 ? [...messages, ...messages] : ['Polaris civilization online — awaiting deliberation...', 'Polaris civilization online — awaiting deliberation...'];

  return (
    <div className="border-t border-white/[0.06] bg-surface-deep/90 backdrop-blur-md">
      <div className="flex items-center h-10">
        <div className="flex items-center gap-2 px-4 border-r border-white/[0.06] shrink-0">
          <LiveBadge />
        </div>
        <span className="text-xs font-mono text-text-muted px-4 shrink-0 hidden sm:block">
          {citizens.toLocaleString()} citizens online
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track">
            {items.map((msg, i) => (
              <span key={i} className="text-xs font-mono text-primary/80 whitespace-nowrap px-8">
                ▸ {typeof msg === 'string' ? msg : msg.message}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
