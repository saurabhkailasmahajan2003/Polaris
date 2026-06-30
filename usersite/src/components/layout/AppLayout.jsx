import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar, { SidebarToggle } from './Sidebar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import WorldStateBar from '../ui/WorldStateBar';
import LiveTicker from '../ui/LiveTicker';
import { useApp } from '../../context/AppContext';

const STORAGE_KEY = 'polaris-sidebar-open';

export default function AppLayout({
  children,
  showWorldState = true,
  showTicker = true,
  mobileShell = true,
  hideBottomNav = false,
}) {
  const { ticker } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch { /* ignore */ }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(sidebarOpen));
    } catch { /* ignore */ }
  }, [sidebarOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const showMobileChrome = mobileShell;
  const showBottomBar = showMobileChrome && !hideBottomNav;
  const mobilePadTop = showMobileChrome ? 'pt-14' : '';
  const mobilePadBottom = showBottomBar ? 'pb-[calc(49px+env(safe-area-inset-bottom,0px))]' : '';

  return (
    <div className="h-[100dvh] flex flex-col bg-night overflow-hidden">
      {showMobileChrome && (
        <MobileHeader onOpenMenu={() => setSidebarOpen(true)} />
      )}

      {/* Desktop-only floating toggle when sidebar collapsed */}
      {!sidebarOpen && !showMobileChrome && (
        <SidebarToggle onOpen={() => setSidebarOpen(true)} />
      )}
      {!sidebarOpen && showMobileChrome && (
        <div className="hidden md:block">
          <SidebarToggle onOpen={() => setSidebarOpen(true)} />
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activePath={location.pathname}
        />
        <div className="flex-1 flex flex-col min-w-0 min-h-0 w-full">
          {showWorldState && <WorldStateBar />}
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-1 overflow-y-auto min-h-0 md:pt-0 md:pb-0 ${mobilePadTop} ${mobilePadBottom}`}
          >
            {children}
          </motion.main>
          {showTicker && (
            <div className="hidden md:block">
              <LiveTicker messages={ticker} />
            </div>
          )}
        </div>
      </div>

      {showBottomBar && <BottomNav />}
    </div>
  );
}
