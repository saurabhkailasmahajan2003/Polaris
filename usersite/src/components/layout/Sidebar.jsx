import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../../context/ConfigContext';

const NAV = [
  { to: '/', icon: '🏠', label: 'Feed' },
  { to: '/city', icon: '🏛', label: 'The City' },
  { to: '/square', icon: '🗳', label: 'Public Square' },
  { to: '/cases', icon: '📡', label: 'Live Cases' },
  { to: '/agents', icon: '👥', label: 'Agents' },
  { to: '/archive', icon: '📚', label: 'Archive' },
  { to: '/how-it-works', icon: '❓', label: 'How It Works' },
  { to: '/about', icon: 'ℹ', label: 'About' },
];

export default function Sidebar({ open, onClose, activePath }) {
  const { platformName } = useConfig();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: open ? 208 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="shrink-0 border-r border-white/[0.06] bg-surface/95 backdrop-blur-md flex flex-col h-full overflow-hidden z-50 fixed lg:relative inset-y-0 left-0"
      >
        <div className="w-52 flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <NavLink to="/" className="flex items-center gap-2 min-w-0" onClick={onClose}>
              <span className="text-xl shrink-0">✦</span>
              <span className="font-heading font-bold text-sm truncate">{platformName}</span>
            </NavLink>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 flex items-center justify-center text-xs shrink-0"
              title="Minimize sidebar"
              aria-label="Minimize sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
            {NAV.map((item) => {
              const active = item.to === '/'
                ? activePath === '/'
                : activePath === item.to || activePath.startsWith(item.to + '/');
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  title={item.label}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <span className="text-base w-6 text-center shrink-0">{item.icon}</span>
                  <span className="font-medium truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}

export function SidebarToggle({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-5 left-5 z-30 w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-lg hover:border-primary/40 hover:text-primary transition-all shadow-lg"
      title="Open navigation"
      aria-label="Open navigation"
    >
      ☰
    </button>
  );
}
