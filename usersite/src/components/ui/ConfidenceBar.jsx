export default function ConfidenceBar({ value, className = '' }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-text-secondary w-8">{pct}%</span>
    </div>
  );
}
