import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Banknote,
  Boxes,
  Settings,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
  FilePlus2,
  Inbox,
  RotateCcw,
  CreditCard,
  FileText,
  Truck,
  BookText,
  Wallet,
  Files,
  SlidersHorizontal,
  Users,
  Package,
  UserRound,
  Building2,
  BadgePercent,
  Tag,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { toggleSidebar, toggleSidebarWhite } from '../ui/uiSlice'

const sections = [
  {
    key: 'dashboard', icon: LayoutDashboard, path: '/',
  },
  {
    key: 'purchase', icon: ShoppingCart, children: [
      { key: 'purchase.dashboard', path: '/purchase/dashboard', icon: BarChart3 },
      { key: 'purchase.order', path: '/purchase/order', icon: FilePlus2 },
      { key: 'purchase.receive', path: '/purchase/receive', icon: Inbox },
      { key: 'purchase.return', path: '/purchase/return', icon: RotateCcw },
      { key: 'purchase.payment', path: '/purchase/payment', icon: CreditCard },
      { key: 'purchase.report', path: '/purchase/report', icon: FileText },
    ],
  },
  {
    key: 'sales', icon: ShoppingBag, children: [
      { key: 'sales.dashboard', path: '/sales/dashboard', icon: BarChart3 },
      { key: 'sales.order', path: '/sales/order', icon: FilePlus2 },
      { key: 'sales.delivery', path: '/sales/delivery', icon: Truck },
      { key: 'sales.return', path: '/sales/return', icon: RotateCcw },
      { key: 'sales.collection', path: '/sales/collection', icon: Wallet },
      { key: 'sales.report', path: '/sales/report', icon: FileText },
    ],
  },
  {
    key: 'account', icon: Banknote, children: [
      { key: 'account.dashboard', path: '/account/dashboard', icon: BarChart3 },
      { key: 'account.coa', path: '/account/coa', icon: Files },
      { key: 'account.journal', path: '/account/journal', icon: BookText },
      { key: 'account.expense', path: '/account/expense', icon: Wallet },
      { key: 'account.financial', path: '/account/financial-report', icon: FileText },
      { key: 'account.other', path: '/account/other-report', icon: FileText },
    ],
  },
  {
    key: 'inventory', icon: Boxes, children: [
      { key: 'inventory.dashboard', path: '/inventory/dashboard', icon: BarChart3 },
      { key: 'inventory.adjustment', path: '/inventory/adjustment', icon: SlidersHorizontal },
      { key: 'inventory.reports', path: '/inventory/reports', icon: FileText },
    ],
  },
  {
    key: 'configuration', icon: Settings, children: [
      { key: 'configuration.employee.employee', path: '/configuration/employee', icon: Users },
      { key: 'configuration.itemProfile', path: '/configuration/item-profile', icon: Package },
      { key: 'configuration.customerProfile', path: '/configuration/customer-profile', icon: UserRound },
      { key: 'configuration.supplierProfile', path: '/configuration/supplier-profile', icon: Building2 },
      { key: 'configuration.offerSetup', path: '/configuration/offer-setup', icon: BadgePercent },
      { key: 'configuration.customerPrice', path: '/configuration/customer-price', icon: Tag },
      { key: 'configuration.standardPrice', path: '/configuration/standard-price', icon: Tag },
    ],
  },
  {
    key: 'approval', icon: CheckCircle, path: '/approval',
  },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const open = useSelector(s => s.ui.sidebarOpen)
  const sidebarWhite = useSelector(s => s.ui.sidebarWhite)
  const dispatch = useDispatch()
  const location = useLocation()
  const [expanded, setExpanded] = useState(() => {
    const match = sections.find(sec => sec.children?.some(ch => location.pathname.startsWith(ch.path)))
    return match?.key || null
  })
  useEffect(() => {
    const match = sections.find(sec => sec.children?.some(ch => location.pathname.startsWith(ch.path)))
    setExpanded(match?.key || null)
  }, [location.pathname])

  const toggle = (key) => {
    setExpanded(prev => (prev === key ? null : key))
  }

  // Smooth width transition and content clipping
  return (
    <aside
      className={`sidebar-area flex flex-col border-r h-full overflow-hidden transition-all duration-300 ${sidebarWhite ? 'bg-white text-gray-900 border-gray-200' : 'bg-sidebar text-gray-100 border-gray-800'}`}
      style={{ width: open ? 260 : 64, minWidth: open ? 260 : 64, maxWidth: open ? 260 : 64 }}
    >
      {/* Header: only show color toggle in header if expanded */}
      <div className={`flex items-center justify-between px-4 h-header border-b ${sidebarWhite ? 'border-gray-200' : 'border-gray-700'}`}>
        <NavLink to="/" className="font-semibold tracking-wide text-sm focus:outline-none">
          {open ? (
            <span dangerouslySetInnerHTML={{ __html: t('appName') }} />
          ) : (
            'SME'
          )}
        </NavLink>
        <div className="flex gap-1 items-center">
          {open && (
            <button
              onClick={() => dispatch(toggleSidebarWhite())}
              className={`rounded p-1 transition-colors duration-150 ${sidebarWhite ? 'text-gray-700 hover:bg-gray-200' : 'bg-gray-900 text-gray-200 hover:bg-gray-800'}`}
              aria-label="Toggle sidebar color"
              title={sidebarWhite ? 'Switch to dark sidebar' : 'Switch to white sidebar'}
              style={{ marginRight: 4, background: sidebarWhite ? 'transparent' : undefined }}
            >
              {/* Color toggle icon: simple circle */}
              <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: sidebarWhite ? '#fff' : '#0f172a', border: '1.5px solid #cbd5e1' }} />
            </button>
          )}
          <button onClick={() => dispatch(toggleSidebar())} className={`${sidebarWhite ? 'text-gray-500 hover:text-gray-800' : 'text-gray-300 hover:text-white'}`} aria-label="Toggle sidebar">
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>
      <nav
        className="flex-1 py-2 min-h-0 overflow-hidden"
        style={{
          overflowY: open ? 'auto' : 'hidden',
          transition: 'overflow 0.3s',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {sections.map(sec => (
            <div key={sec.key} className="mb-1">
              <SidebarSection section={sec} open={open} t={t} expanded={expanded} onToggle={toggle} sidebarWhite={sidebarWhite} />
            </div>
          ))}
        </div>
      </nav>
      {/* Bottom: show color toggle here if collapsed */}
      {!open && (
        <div className="flex flex-col items-center py-3 border-t w-full" style={{ borderColor: sidebarWhite ? '#e5e7eb' : '#374151' }}>
          <button
            onClick={() => dispatch(toggleSidebarWhite())}
            className={`rounded p-1 transition-colors duration-150 ${sidebarWhite ? 'text-gray-700 hover:bg-gray-200' : 'bg-gray-900 text-gray-200 hover:bg-gray-800'}`}
            aria-label="Toggle sidebar color"
            title={sidebarWhite ? 'Switch to dark sidebar' : 'Switch to white sidebar'}
            style={{ marginBottom: 2, background: sidebarWhite ? 'transparent' : undefined }}
          >
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: sidebarWhite ? '#fff' : '#0f172a', border: '1.5px solid #cbd5e1' }} />
          </button>
        </div>
      )}
      <div className={`text-xs px-4 py-3 border-t ${sidebarWhite ? 'text-gray-400 border-gray-200' : 'text-gray-400 border-gray-700'}`}>v0.1.0</div>
    </aside>
  )
}


function SidebarSection({ section, open, t, expanded, onToggle, sidebarWhite }) {
  const Icon = section.icon
  const hasChildren = !!section.children
  const [hovered, setHovered] = useState(false)
  const [submenuStyle, setSubmenuStyle] = useState({})
  const sectionRef = useRef(null)
  useEffect(() => {
    if (hovered && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      setSubmenuStyle({
        position: 'fixed',
        left: rect.right + 2,
        top: rect.top,
        zIndex: 1000,
        minWidth: 180,
      })
    }
  }, [hovered])

  // No children: just render the icon and label (if open)
  if (!hasChildren) {
    // Collapsed: match icon size, spacing, and alignment with submenu icons
    if (!open) {
      return (
        <div className="relative flex justify-center" style={{ width: '100%' }}>
          <NavLink
            to={section.path}
            className={({ isActive }) => `flex items-center justify-center w-12 h-12 mx-auto my-1 rounded transition-colors duration-150 ${sidebarWhite ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}${isActive ? 'text-[#9B6DFF]' : ''}`}
            style={{ minWidth: 48, minHeight: 48 }}
            end
          >
            <Icon size={22} />
          </NavLink>
        </div>
      )
    }
    // Expanded: show icon and label
    return (
      <NavLink
        to={section.path}
        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 text-sm${isActive ? 'text-[#9B6DFF]' : (sidebarWhite ? ' text-gray-700 hover:bg-gray-100 hover:text-gray-900' : ' text-gray-300 hover:bg-gray-800 hover:text-white')}`}
        end
      >
        <Icon size={18} /> {open && <span>{t(`menu.${section.key}`) || t(section.key)}</span>}
      </NavLink>
    )
  }

  // Expanded sidebar: show normal dropdown
  if (open) {
    const isOpen = expanded === section.key && open
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(section.key)}
          className={`w-full px-4 py-2 flex items-center justify-between text-xs uppercase tracking-wide ${sidebarWhite ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
        >
          <span className="flex items-center gap-2">
            <Icon size={16} /> {open && <span>{t(`menu.${section.key}`)}</span>}
          </span>
          {open && <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isOpen && (
          <div className="pb-1">
            {section.children.map(child => {
              const ChildIcon = child.icon || ChevronRight
              return (
                <NavLink
                  key={child.key}
                  to={child.path}
                  className={({ isActive }) => `flex items-center gap-3 pl-8 pr-3 py-1.5 text-[13px]${isActive ? ' text-[#9B6DFF]' : (sidebarWhite ? ' text-gray-700 hover:bg-gray-100 hover:text-gray-900' : ' text-gray-300 hover:bg-gray-800 hover:text-white')}`}
                >
                  <ChildIcon size={14} />
                  {open && <span>{t(child.key)}</span>}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Collapsed sidebar: show icon, and on hover show floating submenu (aligned with icon)

  return (
    <div
      ref={sectionRef}
      className="relative flex justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: '100%' }}
    >
      <button
        type="button"
        className={`flex items-center justify-center w-12 h-12 mx-auto my-1 rounded transition-colors duration-150 ${sidebarWhite ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        style={{ minWidth: 48, minHeight: 48 }}
      >
        <Icon size={22} />
      </button>
      <div
        style={{
          ...submenuStyle,
          pointerEvents: hovered ? 'auto' : 'none',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0px)' : 'translateY(10px)',
          transition: 'opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1)',
        }}
        className={`${sidebarWhite ? 'bg-white border border-gray-200' : 'bg-gray-900 border border-gray-700'} rounded-md shadow-lg py-2 absolute`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {section.children && section.children.map(child => {
          const ChildIcon = child.icon || ChevronRight
          return (
            <NavLink
              key={child.key}
              to={child.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2 text-sm whitespace-nowrap${isActive ? ' text-[#9B6DFF]' : (sidebarWhite ? ' text-gray-700 hover:bg-gray-100 hover:text-gray-900' : ' text-gray-300 hover:bg-gray-800 hover:text-white')}`}
              style={{ minWidth: 160 }}
              onClick={() => setHovered(false)}
            >
              <ChildIcon size={16} />
              <span>{t(child.key)}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
