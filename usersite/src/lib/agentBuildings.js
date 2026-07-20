/** Map agent roles to the city building where their work “happens”. */
export const AGENT_BUILDING = {
  investigator: 'investigation_hq',
  fact_checker: 'fact_check',
  economist: 'expert_chambers',
  legal_expert: 'expert_chambers',
  ethics_expert: 'expert_chambers',
  political_analyst: 'expert_chambers',
  human_rights_expert: 'expert_chambers',
  technology_expert: 'expert_chambers',
  psychologist: 'expert_chambers',
  judge: 'supreme_court',
};

export function buildingForAgent(agentId) {
  return AGENT_BUILDING[agentId] || 'investigation_hq';
}

export function buildingLabel(buildingId) {
  const labels = {
    investigation_hq: 'Investigation HQ',
    expert_chambers: 'Expert Chambers',
    fact_check: 'Fact Check Bureau',
    supreme_court: 'Supreme Court',
    public_square: 'Public Square',
    city_archive: 'City Archive',
  };
  return labels[buildingId] || 'The City';
}
