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
import { toggleSidebar } from '../features/ui/uiSlice'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

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
      { key: 'configuration.employee', path: '/configuration/employee', icon: Users },
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
  const dispatch = useDispatch()
  const location = useLocation()

  // Determine which section should be expanded based on current route
  const defaultExpanded = useMemo(() => {
    const match = sections.find(sec => sec.children?.some(ch => location.pathname.startsWith(ch.path)))
    return match?.key || null
  }, [location.pathname])
  const [expanded, setExpanded] = useState(defaultExpanded)

  const toggle = (key) => {
    setExpanded(prev => (prev === key ? null : key))
  }

  return (
    <motion.aside
      initial={{ width: 0 }}
      animate={{ width: open ? 260 : 64 }}
      className="sidebar-area bg-sidebar text-gray-100 flex flex-col border-r border-gray-800 h-full overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 h-header border-b border-gray-700">
        <span className="font-semibold tracking-wide text-sm">{open ? t('appName') : 'SME'}</span>
        <button onClick={() => dispatch(toggleSidebar())} className="text-gray-300 hover:text-white" aria-label="Toggle sidebar">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        {sections.map(sec => (
          <div key={sec.key} className="mb-1">
            <SidebarSection section={sec} open={open} t={t} expanded={expanded} onToggle={toggle} />
          </div>
        ))}
      </nav>
      <div className="text-xs text-gray-400 px-4 py-3 border-t border-gray-700">v0.1.0</div>
    </motion.aside>
  )
}

function SidebarSection({ section, open, t, expanded, onToggle }) {
  const Icon = section.icon
  const hasChildren = !!section.children
  if (!hasChildren) {
    return (
      <NavLink to={section.path} className={({ isActive }) => `flex items-center gap-2 px-4 py-2 text-sm ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`} end>
        <Icon size={18} /> {open && <span>{t(`menu.${section.key}`) || t(section.key)}</span>}
      </NavLink>
    )
  }
  const isOpen = expanded === section.key && open
  return (
    <div>
      <button type="button" onClick={() => onToggle(section.key)} className="w-full px-4 py-2 flex items-center justify-between text-xs uppercase tracking-wide text-gray-400 hover:text-white">
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
              <NavLink key={child.key} to={child.path} className={({ isActive }) => `flex items-center gap-3 pl-8 pr-3 py-1.5 text-[13px] ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
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
