import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

export default function MobileHeader({ showCity = true }) {
  const { platformName } = useConfig();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-night/95 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between px-4">
      <Link to="/" className="font-heading font-bold text-lg tracking-tight">
        {platformName}
      </Link>
      {showCity && (
        <Link
          to="/city"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-semibold"
        >
          <span>🏛</span>
          <span>City</span>
        </Link>
      )}
    </header>
  );
}
