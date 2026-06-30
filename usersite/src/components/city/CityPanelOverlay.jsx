import { AnimatePresence, motion } from 'framer-motion';
import { getBuilding } from '../../lib/cityBuildings';
import CasePanelContent from './CasePanelContent';
import AgentPanelContent from './AgentPanelContent';

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

  return (
    <AnimatePresence>
      {buildingId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-night/80 backdrop-blur-md"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative w-full max-w-lg h-full flex flex-col border-l border-white/[0.08] bg-surface-deep shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {panelCaseId ? (
                  <motion.div key="case" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full">
                    <CasePanelContent caseId={panelCaseId} onBack={onBackCase} />
                  </motion.div>
                ) : panelAgentId ? (
                  <motion.div key="agent" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full">
                    <AgentPanelContent agentId={panelAgentId} onBack={onBackAgent} />
                  </motion.div>
                ) : ActiveComponent ? (
                  <motion.div key="building" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full">
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
