import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, ShoppingCart, ShoppingBag, Banknote, Boxes, Settings, CheckCircle,
  ChevronLeft, ChevronRight, ChevronDown, BarChart3, FilePlus2, Inbox, RotateCcw,
  CreditCard, FileText, Truck, BookText, Wallet, Files, SlidersHorizontal, Users,
  Package, UserRound, Building2, BadgePercent, Tag, Sun, Moon,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { toggleSidebar, toggleSidebarWhite } from '../ui/uiSlice'

const navGroups = [
  {
    label: null,
    items: [
      { key: 'dashboard', icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
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
    ],
  },
  {
    label: 'SYSTEM',
    items: [
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
      { key: 'approval', icon: CheckCircle, path: '/approval' },
    ],
  },
]

const sections = navGroups.flatMap(g => g.items)

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

  const toggle = key => setExpanded(prev => prev === key ? null : key)

  const isDark = !sidebarWhite
  const bg = isDark ? '#0f172a' : '#ffffff'
  const borderColor = isDark ? '#1e293b' : '#e5e7eb'
  const textMuted = isDark ? '#64748b' : '#9ca3af'
  const PRIMARY = '#16a34a'

  return (
    <aside
      className="sidebar-area flex flex-col h-full overflow-hidden transition-all duration-300"
      style={{
        width: open ? 260 : 64,
        minWidth: open ? 260 : 64,
        maxWidth: open ? 260 : 64,
        background: bg,
        borderRight: `1px solid ${borderColor}`,
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center h-header px-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        {open ? (
          <>
            <NavLink to="/" className="flex items-center gap-2.5 flex-1 min-w-0 focus:outline-none">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
              >
                <span className="text-white font-bold text-sm leading-none">C</span>
              </div>
              <div className="min-w-0">
                <div
                  className="font-semibold text-[13px] leading-tight truncate"
                  style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                >
                  Corelium
                </div>
                <div className="text-[10px] leading-tight" style={{ color: textMuted }}>
                  Enterprise Suite
                </div>
              </div>
            </NavLink>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="flex-shrink-0 p-1.5 rounded-md transition-colors"
              style={{ color: textMuted }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={15} />
            </button>
          </>
        ) : (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="mx-auto p-1.5 rounded-md transition-colors"
            style={{ color: textMuted }}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: `${borderColor} transparent` }}
      >
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-5' : 'mt-1'}>
            {group.label && open && (
              <div
                className="px-4 mb-1 select-none"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: textMuted,
                }}
              >
                {group.label}
              </div>
            )}
            {group.label && !open && (
              <div
                className="mx-auto mb-2 mt-1"
                style={{ width: 20, height: 1, background: borderColor }}
              />
            )}
            <div>
              {group.items.map(sec => (
                <SidebarItem
                  key={sec.key}
                  section={sec}
                  open={open}
                  t={t}
                  expanded={expanded}
                  onToggle={toggle}
                  isDark={isDark}
                  borderColor={borderColor}
                  textMuted={textMuted}
                  primary={PRIMARY}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-3 py-2.5"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        {open ? (
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 11, color: textMuted }}>v0.1.0</span>
            <button
              onClick={() => dispatch(toggleSidebarWhite())}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: textMuted }}
              title={isDark ? 'Light mode' : 'Dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => dispatch(toggleSidebarWhite())}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: textMuted }}
              title={isDark ? 'Light mode' : 'Dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

function SidebarItem({ section, open, t, expanded, onToggle, isDark, borderColor, textMuted, primary }) {
  const Icon = section.icon
  const hasChildren = !!section.children
  const [hovered, setHovered] = useState(false)
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)
  const location = useLocation()

  const isExpanded = expanded === section.key && open
  const hasActiveChild = hasChildren && section.children.some(ch => location.pathname.startsWith(ch.path))

  useEffect(() => {
    if (hovered && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setFlyoutPos({ top: rect.top, left: rect.right + 6 })
    }
  }, [hovered])

  const textColor = isDark ? '#cbd5e1' : '#4b5563'
  const activeBg = isDark ? 'rgba(22,163,74,0.1)' : '#f0fdf4'
  const activeIndicator = `inset 3px 0 0 ${primary}`
  const flyoutBg = isDark ? '#1e293b' : '#ffffff'

  // COLLAPSED — leaf
  if (!open && !hasChildren) {
    return (
      <div ref={ref} className="px-2 mb-px"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <NavLink
          to={section.path}
          end
          className="flex items-center justify-center h-9 rounded-md transition-all duration-150"
          style={({ isActive }) => ({
            color: isActive ? primary : textColor,
            background: isActive ? activeBg : 'transparent',
            boxShadow: isActive ? activeIndicator : 'none',
          })}
        >
          <Icon size={17} />
        </NavLink>
        {hovered && (
          <ItemTooltip top={flyoutPos.top} left={flyoutPos.left} bg={flyoutBg} borderColor={borderColor} textColor={textColor}>
            {t(`menu.${section.key}`) || section.key}
          </ItemTooltip>
        )}
      </div>
    )
  }

  // COLLAPSED — parent with flyout
  if (!open && hasChildren) {
    return (
      <div
        ref={ref}
        className="px-2 mb-px"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="w-full flex items-center justify-center h-9 rounded-md transition-all duration-150"
          style={{
            color: hasActiveChild ? primary : textColor,
            background: hasActiveChild ? activeBg : 'transparent',
            boxShadow: hasActiveChild ? activeIndicator : 'none',
          }}
        >
          <Icon size={17} />
        </button>
        {hovered && (
          <div
            className="fixed z-50 rounded-lg shadow-xl py-2"
            style={{
              top: flyoutPos.top,
              left: flyoutPos.left,
              background: flyoutBg,
              border: `1px solid ${borderColor}`,
              minWidth: 190,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className="px-3 pb-1.5"
              style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: textMuted }}
            >
              {t(`menu.${section.key}`)}
            </div>
            {section.children.map(child => {
              const ChildIcon = child.icon || ChevronRight
              return (
                <NavLink
                  key={child.key}
                  to={child.path}
                  onClick={() => setHovered(false)}
                  className="flex items-center gap-2.5 px-3 py-2 transition-colors"
                  style={({ isActive }) => ({
                    fontSize: 12.5,
                    color: isActive ? primary : textColor,
                    background: isActive ? activeBg : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                  })}
                >
                  <ChildIcon size={13} />
                  <span>{t(child.key)}</span>
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // EXPANDED — leaf
  if (!hasChildren) {
    return (
      <div className="px-2 mb-px">
        <NavLink
          to={section.path}
          end
          className="flex items-center gap-3 px-3 h-9 rounded-md transition-all duration-150"
          style={({ isActive }) => ({
            fontSize: 13,
            fontWeight: 500,
            color: isActive ? primary : textColor,
            background: isActive ? activeBg : 'transparent',
            boxShadow: isActive ? activeIndicator : 'none',
          })}
        >
          <Icon size={16} />
          <span>{t(`menu.${section.key}`) || section.key}</span>
        </NavLink>
      </div>
    )
  }

  // EXPANDED — parent with accordion
  return (
    <div className="px-2 mb-px">
      <button
        type="button"
        onClick={() => onToggle(section.key)}
        className="w-full flex items-center gap-3 px-3 h-9 rounded-md transition-all duration-150"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: hasActiveChild ? primary : textColor,
          background: hasActiveChild && !isExpanded ? activeBg : 'transparent',
          boxShadow: hasActiveChild && !isExpanded ? activeIndicator : 'none',
        }}
      >
        <Icon size={16} />
        <span className="flex-1 text-left">{t(`menu.${section.key}`)}</span>
        <ChevronDown
          size={13}
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.4,
          }}
        />
      </button>
      {isExpanded && (
        <div className="mt-0.5 mb-1">
          {section.children.map(child => {
            const ChildIcon = child.icon || ChevronRight
            return (
              <NavLink
                key={child.key}
                to={child.path}
                className="flex items-center gap-2.5 h-8 px-9 rounded-md transition-all duration-150"
                style={({ isActive }) => ({
                  fontSize: 12.5,
                  color: isActive ? primary : isDark ? '#94a3b8' : '#6b7280',
                  background: isActive ? activeBg : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  boxShadow: isActive ? `inset 2px 0 0 ${primary}` : 'none',
                })}
              >
                <ChildIcon size={13} />
                <span>{t(child.key)}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ItemTooltip({ top, left, bg, borderColor, textColor, children }) {
  return (
    <div
      className="fixed z-50 rounded-md shadow-lg px-3 py-1.5 pointer-events-none"
      style={{
        top: top + 4,
        left,
        background: bg,
        border: `1px solid ${borderColor}`,
        color: textColor,
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  )
}
