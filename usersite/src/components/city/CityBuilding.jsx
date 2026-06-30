import { motion } from 'framer-motion';

function BuildingWindows({ rows = 4, cols = 3, lit = false }) {
  return (
    <div className="flex flex-col gap-1.5 px-3 pt-3 flex-1">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-1.5 justify-center">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={`w-1.5 h-2 rounded-sm ${
                lit && (r + c) % 2 === 0
                  ? 'window-light bg-primary/50'
                  : 'bg-white/[0.04]'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CityBuilding({
  label,
  tagline,
  height,
  width = 'w-[7.5rem]',
  isActive,
  isSelected,
  onClick,
  accent = '#4f6ef7',
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-stretch text-left group ${width}`}
      style={{ height: `${height}px` }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div
        className={`flex-1 flex flex-col rounded-t-lg border border-white/[0.08] bg-building transition-all duration-300
          group-hover:border-primary/40 group-hover:shadow-building-hover
          ${isActive ? 'building-active' : ''}
          ${isSelected ? 'border-primary/60 shadow-building-active' : ''}`}
      >
        {/* Roof line */}
        <div
          className="h-0.5 w-full rounded-t-lg opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
        <BuildingWindows lit={isActive || isSelected} rows={Math.floor(height / 40)} cols={3} />
        {/* Antenna for tall buildings */}
        {height > 200 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/20">
            <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-white/30'}`} />
          </div>
        )}
      </div>

      {/* Building base / plaza */}
      <div className="px-2 py-2.5 border border-t-0 border-white/[0.06] rounded-b-lg bg-building/90 group-hover:border-primary/25 transition-colors">
        <p className="font-heading text-xs font-semibold text-text-primary leading-tight">{label}</p>
        <p className="text-[10px] text-text-secondary mt-0.5 leading-snug opacity-80">{tagline}</p>
      </div>

      {/* Ground reflection glow */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: accent, opacity: isActive ? 0.25 : undefined }}
      />
    </motion.button>
  );
}
