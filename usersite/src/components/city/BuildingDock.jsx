import { motion } from 'framer-motion';
import { CITY_BUILDINGS } from '../../lib/cityBuildings';
import LiveBadge from '../ui/LiveBadge';

export default function BuildingDock({ selected, onSelect, activeCaseIds = [] }) {
  const hasActiveCases = activeCaseIds.length > 0;

  return (
    <div className="shrink-0 border-t border-white/[0.08] bg-surface-deep/95 backdrop-blur-xl">
      <div className="px-4 pt-3 pb-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted text-center">
          Select an institution to explore
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 py-3 snap-x snap-mandatory">
        {CITY_BUILDINGS.map((b) => {
          const isSelected = selected === b.id;
          const isPulsing = b.pulsesWhenActive && hasActiveCases;
          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => onSelect(b.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`snap-center shrink-0 w-36 rounded-xl p-3 text-left transition-all border ${
                isSelected
                  ? 'border-primary/60 bg-primary/10 shadow-neon'
                  : 'border-white/[0.08] bg-surface/80 hover:border-white/20'
              } ${isPulsing && !isSelected ? 'animate-pulse-live border-primary/40' : ''}`}
              style={isSelected ? { boxShadow: `0 0 24px ${b.color}44` } : undefined}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{b.icon}</span>
                {(isPulsing || isSelected) && <LiveBadge />}
              </div>
              <p className="font-heading font-semibold text-xs leading-tight" style={{ color: isSelected ? b.color : '#f1f5f9' }}>
                {b.label}
              </p>
              <p className="text-[10px] text-text-muted mt-1 line-clamp-2">{b.tagline}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
