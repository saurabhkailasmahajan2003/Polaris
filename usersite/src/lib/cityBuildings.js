import SupremeCourt from '../components/SupremeCourt';
import InvestigationHQ from '../components/InvestigationHQ';
import ExpertChambers from '../components/ExpertChambers';
import FactCheckBureau from '../components/FactCheckBureau';
import PublicSquare from '../components/PublicSquare';
import CityArchivePanel from '../components/CityArchivePanel';

export const CITY_BUILDINGS = [
  {
    id: 'supreme_court',
    label: 'Supreme Court',
    tagline: 'Final judgments & consequences',
    color: '#7c3aed',
    icon: '⚖️',
    component: SupremeCourt,
  },
  {
    id: 'investigation_hq',
    label: 'Investigation HQ',
    tagline: 'Active cases & evidence',
    color: '#4f6ef7',
    icon: '🔍',
    component: InvestigationHQ,
    pulsesWhenActive: true,
  },
  {
    id: 'expert_chambers',
    label: 'Expert Chambers',
    tagline: 'Agent profiles & debate',
    color: '#06b6d4',
    icon: '🏛️',
    component: ExpertChambers,
  },
  {
    id: 'fact_check',
    label: 'Fact Check Bureau',
    tagline: 'Verified evidence',
    color: '#f59e0b',
    icon: '✓',
    component: FactCheckBureau,
  },
  {
    id: 'public_square',
    label: 'Public Square',
    tagline: 'Vote on events',
    color: '#10b981',
    icon: '🗳️',
    component: PublicSquare,
  },
  {
    id: 'city_archive',
    label: 'City Archive',
    tagline: 'Past cases & verdicts',
    color: '#dc2626',
    icon: '📚',
    component: CityArchivePanel,
  },
];

export function getBuilding(id) {
  return CITY_BUILDINGS.find((b) => b.id === id);
}
