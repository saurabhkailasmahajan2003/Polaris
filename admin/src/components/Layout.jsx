import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/events', label: 'Events' },
  { to: '/cases', label: 'Cases' },
  { to: '/verdicts', label: 'Verdicts' },
  { to: '/agents', label: 'Agents' },
];

export default function Layout({ children }) {
  const { platformName } = useConfig();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-surface border-r border-white/5 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="font-heading text-xl font-bold text-primary">{platformName}</h1>
          <p className="text-text-secondary text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="space-y-1 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
