import React from 'react';
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import BottomNav from '../common/components/BottomNav';

export default function LayoutShell() {
  const open = useSelector(s => s.ui.sidebarOpen)
  const darkMode = useSelector(s => s.ui.darkMode)
  const MOBILE_BREAKPOINT = 576;
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= MOBILE_BREAKPOINT);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync dark class on <html> so all Tailwind dark: variants + CSS vars work globally
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const sidebarWidth = open ? 260 : 64;
  return (
    <div className="app-shell" style={{ gridTemplateColumns: isMobile ? '1fr' : `${sidebarWidth}px 1fr` }}>
      {!isMobile && <Sidebar />}
      <Header />
      <main className="main-area p-3 space-y-3 overflow-y-auto"><Outlet /></main>
      {isMobile && (
        <React.Suspense fallback={null}>
          <BottomNav />
        </React.Suspense>
      )}
    </div>
  );
}
