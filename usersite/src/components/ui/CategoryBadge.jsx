import { CATEGORY_COLORS } from '../../lib/constants';

export default function CategoryBadge({ category, className = '' }) {
  const key = (category || 'general').toLowerCase();
  const style = CATEGORY_COLORS[key] || CATEGORY_COLORS.general;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${style} ${className}`}>
      {category}
    </span>
  );
}
