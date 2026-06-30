import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ThreeCity from '../components/city/ThreeCity';
import CityPanelOverlay from '../components/city/CityPanelOverlay';
import LiveBadge from '../components/ui/LiveBadge';
import { useApp } from '../context/AppContext';
import { casesApi } from '../lib/api';

export default function City() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [panelCaseId, setPanelCaseId] = useState(null);
  const [panelAgentId, setPanelAgentId] = useState(null);
  const [activeCaseIds, setActiveCaseIds] = useState([]);
  const { activeCases } = useApp();

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
    <AppLayout showWorldState={false} showTicker={false} mobileShell={false}>
      <div className="relative h-full flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <div className="flex items-start justify-between p-4 md:p-5">
            <div className="pointer-events-auto">
              <div className="flex items-center gap-2 mb-1">
                <LiveBadge />
                <span className="text-[10px] font-mono text-text-muted">Night cycle</span>
              </div>
              <h1 className="font-heading text-xl md:text-2xl font-bold">The City</h1>
              <p className="text-xs text-text-secondary mt-0.5 max-w-xs">
                Click a building in the city to explore
              </p>
            </div>
            <Link
              to="/"
              className="pointer-events-auto text-xs text-text-muted hover:text-primary transition-colors glass-card px-3 py-1.5 rounded-lg"
            >
              ← Home
            </Link>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
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
          />
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
