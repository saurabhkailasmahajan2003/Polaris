/**
 * Consistent responsive page wrapper for all usersite screens.
 */
export default function PageShell({
  title,
  subtitle,
  children,
  maxWidth = 'max-w-6xl',
  className = '',
  headerExtra,
}) {
  return (
    <div className={`w-full min-w-0 px-3 py-3 sm:px-4 sm:py-4 md:px-8 md:py-8 mx-auto ${maxWidth} ${className}`}>
      {title && (
        <header className="mb-4 md:mb-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-wide truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-text-secondary text-xs sm:text-sm mt-1 leading-relaxed">{subtitle}</p>
              )}
            </div>
            {headerExtra}
          </div>
        </header>
      )}
      {children}
    </div>
  );
}

/** Horizontally scrollable tab row for mobile */
export function ScrollTabs({ children, className = '' }) {
  return (
    <div className={`flex gap-1 sm:gap-2 mb-6 md:mb-8 border-b border-white/[0.06] pb-px overflow-x-auto overscroll-x-contain -mx-3 px-3 sm:mx-0 sm:px-0 ${className}`}>
      {children}
    </div>
  );
}

export function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap shrink-0 touch-manipulation ${
        active ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}
