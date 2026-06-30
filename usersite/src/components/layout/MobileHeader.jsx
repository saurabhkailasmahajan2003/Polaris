import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

export default function MobileHeader({ showCity = true, onOpenMenu }) {
  const { platformName } = useConfig();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-night/95 backdrop-blur-md border-b border-white/[0.08] flex items-center gap-3 px-3 safe-top">
      <button
        type="button"
        onClick={onOpenMenu}
        className="w-9 h-9 shrink-0 rounded-lg border border-white/10 flex items-center justify-center text-lg hover:border-primary/40 hover:text-primary transition-colors"
        aria-label="Open menu"
      >
        ☰
      </button>
      <Link to="/" className="font-heading font-bold text-lg tracking-tight truncate flex-1 min-w-0">
        {platformName}
      </Link>
      {showCity && (
        <Link
          to="/city"
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-semibold"
        >
          <span>🏛</span>
          <span className="hidden sm:inline">City</span>
        </Link>
      )}
    </header>
  );
}
