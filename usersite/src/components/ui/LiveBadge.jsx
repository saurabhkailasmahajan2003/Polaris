export default function LiveBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-success ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
      LIVE
    </span>
  );
}
