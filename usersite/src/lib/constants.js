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

/** Optional cover images by category when an event has no image */
export const CATEGORY_IMAGES = {
  economy: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=240&fit=crop',
  economics: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=240&fit=crop',
  technology: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop',
  politics: 'https://images.unsplash.com/photo-1540910051071-896cd6dceb6d?w=400&h=240&fit=crop',
  environment: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fac?w=400&h=240&fit=crop',
  society: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=240&fit=crop',
  social: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=240&fit=crop',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=240&fit=crop',
  ethics: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=240&fit=crop',
  general: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=240&fit=crop',
};
