import React from 'react';
import Sidebar from './Sidebar'
import Header from './Header'
import ChatBot from '../common/ChatBot';

import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import BottomNav from '../common/BottomNav';

export default function LayoutShell() {
  const open = useSelector(s => s.ui.sidebarOpen)
  const MOBILE_BREAKPOINT = 576;
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= MOBILE_BREAKPOINT);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = open ? 260 : 64;
  return (
    <div className="app-shell" style={{ gridTemplateColumns: isMobile ? '1fr' : `${sidebarWidth}px 1fr` }}>
      {!isMobile && <Sidebar />}
      <Header />
      <main className="main-area p-3 space-y-3 overflow-y-auto"><Outlet /></main>
      {/* <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
        <ChatBot />
      </div> */}
      {/* BottomNav for mobile */}
      {isMobile && <React.Suspense fallback={null}>
        <BottomNav/>
      </React.Suspense>}
    </div>
  );
}
