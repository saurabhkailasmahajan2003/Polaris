export const CATEGORY_COLORS = {
  economy: 'bg-primary/20 text-primary border-primary/40',
  economics: 'bg-primary/20 text-primary border-primary/40',
  technology: 'bg-secondary/20 text-secondary border-secondary/40',
  politics: 'bg-warning/20 text-warning border-warning/40',
  environment: 'bg-success/20 text-success border-success/40',
  society: 'bg-tertiary/20 text-tertiary border-tertiary/40',
  social: 'bg-tertiary/20 text-tertiary border-tertiary/40',
  legal: 'bg-secondary/20 text-secondary border-secondary/40',
  ethics: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
  general: 'bg-white/10 text-text-secondary border-white/20',
};

export const VERDICT_BORDERS = {
  approved: 'border-l-success',
  rejected: 'border-l-danger',
  approved_with_conditions: 'border-l-warning',
  delayed: 'border-l-primary',
};

export const VERDICT_STYLES = {
  approved: { bg: 'bg-success/20', text: 'text-success', border: 'border-success' },
  rejected: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger' },
  approved_with_conditions: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning' },
  delayed: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary' },
};

export const VERDICT_LABELS = {
  approved: 'APPROVED',
  rejected: 'REJECTED',
  approved_with_conditions: 'APPROVED WITH CONDITIONS',
  delayed: 'DELAYED',
};

export const TIMEFRAME_LABELS = {
  '6_months': '6 Months',
  '1_year': '1 Year',
  '2_years': '2 Years',
};

export const AGENT_COLORS = {
  investigator: '#6366f1',
  fact_checker: '#10b981',
  economist: '#f59e0b',
  legal_expert: '#7c3aed',
  ethics_expert: '#ec4899',
  political_analyst: '#3b82f6',
  human_rights_expert: '#14b8a6',
  technology_expert: '#8b5cf6',
  psychologist: '#f97316',
  judge: '#4f6ef7',
};

export const DEMO_EVENTS = [
  { id: '1', category: 'economy', title: 'Global Central Bank Digital Currencies', description: 'Should nations adopt centralized digital currencies with cross-border interoperability and privacy safeguards?', votes: 24810, rank: 1, image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=240&fit=crop' },
  { id: '2', category: 'technology', title: 'AI Regulation Frameworks', description: 'Establishing global standards for artificial intelligence development, deployment, and accountability.', votes: 18392, rank: 2, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop' },
  { id: '3', category: 'politics', title: 'Election Transparency Reform', description: 'Mandating verifiable voting systems and real-time audit trails for democratic elections worldwide.', votes: 15276, rank: 3, image: 'https://images.unsplash.com/photo-1540910051071-896cd6dceb6d?w=400&h=240&fit=crop' },
  { id: '4', category: 'environment', title: 'Global Climate Emergency Declaration', description: 'Binding international commitments to accelerate carbon reduction and climate adaptation funding.', votes: 12451, image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fac?w=400&h=240&fit=crop' },
  { id: '5', category: 'society', title: 'Universal Basic Income Implementation', description: 'Pilot programs and frameworks for guaranteed minimum income across developed economies.', votes: 9842, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=240&fit=crop' },
  { id: '6', category: 'technology', title: 'Facial Recognition in Public Spaces', description: 'Regulating biometric surveillance in cities, airports, and public institutions.', votes: 7231, image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=240&fit=crop' },
];

export const DEMO_ARCHIVE = [
  { id: '36', title: 'AI Regulation Frameworks', verdict: 'approved', date: 'May 10, 2024', confidence: 91, agents: 9 },
  { id: '35', title: 'Election Transparency Reform', verdict: 'rejected', date: 'May 8, 2024', confidence: 84, agents: 8 },
  { id: '34', title: 'Universal Basic Income', verdict: 'approved_with_conditions', date: 'May 5, 2024', confidence: 78, agents: 7 },
  { id: '33', title: 'Facial Recognition in Public Spaces', verdict: 'delayed', date: 'May 3, 2024', confidence: 65, agents: 8 },
];

export const DEMO_MESSAGES = [
  { agentId: 'economist', agentName: 'Economist', round: 2, time: '2m ago', content: '@Legal Expert I agree on the need for safeguards, but overly strict regulation could limit financial innovation and global competitiveness.', confidence: 82, mention: 'Legal Expert' },
  { agentId: 'legal_expert', agentName: 'Legal Expert', round: 2, time: '3m ago', content: '@Economist: Innovation is important, but without strong legal boundaries, we risk enabling mass surveillance and abuse of power.', confidence: 79, mention: 'Economist', flagged: true },
  { agentId: 'fact_checker', agentName: 'Fact Checker', round: 2, time: '3m ago', content: "The claim about 'zero risk of surveillance' made earlier by Political Analyst is NOT supported by evidence.", tags: ['Supported', 'Evidence'] },
  { agentId: 'ethics_expert', agentName: 'Ethics Expert', round: 2, time: '4m ago', content: 'We must prioritize human dignity and autonomy over efficiency and convenience.', confidence: 74 },
];
