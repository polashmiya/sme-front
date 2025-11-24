import Sidebar from './Sidebar'
import Header from './Header'
import ChatBot from '../common/ChatBot';

import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function LayoutShell() {
  const open = useSelector(s => s.ui.sidebarOpen)
  const sidebarWidth = open ? 260 : 64
  return (
    <div className="app-shell " style={{ gridTemplateColumns: `${sidebarWidth}px 1fr` }}>
      <Sidebar />
      <Header />
      <main className="main-area p-3 space-y-3 overflow-y-auto"><Outlet /></main>
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
        <ChatBot />
      </div>
    </div>
  )
}
