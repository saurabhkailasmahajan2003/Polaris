import { VERDICT_LABELS, VERDICT_STYLES } from '../../lib/constants';

export default function VerdictBadge({ verdict, className = '' }) {
  const key = verdict?.toLowerCase?.().replace(/ /g, '_') || 'approved';
  const style = VERDICT_STYLES[key] || VERDICT_STYLES.approved;
  const label = VERDICT_LABELS[key] || verdict;

  return (
    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-semibold tracking-wide border ${style.bg} ${style.text} ${style.border} ${className}`}>
      {label}
    </span>
  );
}
