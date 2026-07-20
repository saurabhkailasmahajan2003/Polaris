import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import ThreeCity from '../components/city/ThreeCity';
import CityPanelOverlay from '../components/city/CityPanelOverlay';
import LiveBadge from '../components/ui/LiveBadge';
import { useApp } from '../context/AppContext';
import { casesApi } from '../lib/api';
import { buildingLabel } from '../lib/agentBuildings';

export default function City() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [panelCaseId, setPanelCaseId] = useState(null);
  const [panelAgentId, setPanelAgentId] = useState(null);
  const [activeCaseIds, setActiveCaseIds] = useState([]);
  const { activeCases, speakingAgent } = useApp();

  useEffect(() => {
    casesApi.list().then((cases) => {
      setActiveCaseIds(cases.filter((c) => c.status === 'processing').map((c) => c._id));
    });
  }, [activeCases]);

  const openBuilding = (id) => {
    setPanelCaseId(null);
    setPanelAgentId(null);
    setSelectedBuilding(id);
  };

  const closePanel = () => {
    setSelectedBuilding(null);
    setPanelCaseId(null);
    setPanelAgentId(null);
  };

  return (
    <AppLayout showWorldState={false} showTicker={false} hideBottomNav>
      <div className="relative h-full min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0 z-10 pointer-events-none px-3 py-2 md:p-5 md:absolute md:top-0 md:left-0 md:right-0">
          <div className="flex items-center justify-between gap-2 pointer-events-auto">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <LiveBadge />
                <span className="text-[10px] font-mono text-text-muted hidden sm:inline">Night cycle</span>
              </div>
              <h1 className="font-heading text-base sm:text-xl md:text-2xl font-bold truncate">The City</h1>
              <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5 max-w-[220px] sm:max-w-xs line-clamp-2 sm:line-clamp-none">
                Tap a glowing building — listen as agents think out loud
              </p>
            </div>
            <Link
              to="/"
              className="shrink-0 text-xs text-text-muted hover:text-primary transition-colors glass-card px-2.5 py-1.5 sm:px-3 rounded-lg touch-manipulation"
            >
              ← Home
            </Link>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative -mt-1 md:mt-0">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 80%, rgba(26,58,110,0.35) 0%, transparent 70%)',
            }}
          />
          <ThreeCity
            selectedBuilding={selectedBuilding}
            onBuildingSelect={openBuilding}
            activeCaseIds={activeCaseIds}
            speakingBuildingId={speakingAgent?.buildingId || null}
          />

          {/* Floating live cue — follow the speaker into their building */}
          <AnimatePresence>
            {speakingAgent && !selectedBuilding && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                onClick={() => openBuilding(speakingAgent.buildingId || 'investigation_hq')}
                className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 max-w-[min(92vw,360px)]
                  glass-card border border-primary/40 px-4 py-3 rounded-2xl text-left shadow-[0_0_40px_rgba(79,110,247,0.25)]
                  touch-manipulation pointer-events-auto"
              >
                <p className="text-[10px] font-mono text-primary animate-pulse mb-1">● LIVE DELIBERATION</p>
                <p className="text-sm font-heading font-semibold">
                  {speakingAgent.agentName} is thinking
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Inside {buildingLabel(speakingAgent.buildingId)} — tap to listen
                </p>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <CityPanelOverlay
          buildingId={selectedBuilding}
          onClose={closePanel}
          activeCaseIds={activeCaseIds}
          panelCaseId={panelCaseId}
          panelAgentId={panelAgentId}
          onOpenCase={(id) => { setPanelAgentId(null); setPanelCaseId(id); }}
          onOpenAgent={(id) => { setPanelCaseId(null); setPanelAgentId(id); }}
          onBackCase={() => setPanelCaseId(null)}
          onBackAgent={() => setPanelAgentId(null)}
        />
      </div>
    </AppLayout>
  );
}
