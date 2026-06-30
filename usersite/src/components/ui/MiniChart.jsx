export default function MiniChart({ trend = 'up', className = '' }) {
  const paths = {
    up: 'M2,22 L12,14 L22,18 L38,6',
    mixed: 'M2,16 L12,20 L22,10 L38,14',
    down: 'M2,8 L12,14 L22,12 L38,20',
  };
  const colors = { up: '#10b981', mixed: '#f59e0b', down: '#ef4444' };

  return (
    <svg width="60" height="30" viewBox="0 0 40 24" className={className}>
      <path d={paths[trend] || paths.up} fill="none" stroke={colors[trend] || colors.up} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
