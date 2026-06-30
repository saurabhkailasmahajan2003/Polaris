import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getBuilding } from '../../lib/cityBuildings';
import CasePanelContent from './CasePanelContent';
import AgentPanelContent from './AgentPanelContent';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

export default function CityPanelOverlay({
  buildingId,
  onClose,
  activeCaseIds,
  panelCaseId,
  panelAgentId,
  onOpenCase,
  onOpenAgent,
  onBackCase,
  onBackAgent,
}) {
  const building = getBuilding(buildingId);
  const ActiveComponent = building?.component;
  const accent = building?.color || '#4f6ef7';
  const isMobile = useIsMobile();

  const panelMotion = isMobile
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };

  return (
    <AnimatePresence>
      {buildingId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex flex-col md:flex-row md:justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-night/80 backdrop-blur-md"
          />

          {/* Mobile: bottom sheet · Desktop: side panel */}
          <motion.aside
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative mt-auto md:mt-0 w-full md:max-w-lg h-[min(88dvh,720px)] md:h-full flex flex-col
              border-t md:border-t-0 md:border-l border-white/[0.08] bg-surface-deep shadow-2xl
              rounded-t-2xl md:rounded-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle — mobile only */}
            <div className="md:hidden flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="h-1 shrink-0 hidden md:block" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <div
              className="h-0.5 shrink-0 md:hidden mx-4 rounded-full mb-1"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />

            <div className="flex-1 overflow-hidden min-h-0">
              <AnimatePresence mode="wait">
                {panelCaseId ? (
                  <motion.div key="case" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto overscroll-contain">
                    <CasePanelContent caseId={panelCaseId} onBack={onBackCase} />
                  </motion.div>
                ) : panelAgentId ? (
                  <motion.div key="agent" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto overscroll-contain">
                    <AgentPanelContent agentId={panelAgentId} onBack={onBackAgent} />
                  </motion.div>
                ) : ActiveComponent ? (
                  <motion.div key="building" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto overscroll-contain">
                    <ActiveComponent
                      onClose={onClose}
                      activeCaseIds={activeCaseIds}
                      onOpenCase={onOpenCase}
                      onOpenAgent={onOpenAgent}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
