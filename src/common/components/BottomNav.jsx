import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShoppingBag, MoreHorizontal } from 'lucide-react';

const MAIN_MENUS = [
  { key: 'dashboard', label: 'Home',     icon: LayoutDashboard, path: '/' },
  { key: 'purchase',  label: 'Purchase', icon: ShoppingCart,     path: '/purchase' },
  { key: 'sales',     label: 'Sales',    icon: ShoppingBag,      path: '/sales' },
  { key: 'more',      label: 'More',     icon: MoreHorizontal },
];

export default function BottomNav() {
  const navigate = useNavigate();
  if (window.innerWidth > 576) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 w-full flex justify-around items-center z-50 py-2 shadow-lg"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        minWidth: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {MAIN_MENUS.map(menu => {
        const Icon = menu.icon;
        if (menu.key === 'more') {
          return (
            <button
              key="more"
              className="flex flex-col items-center text-xs px-2 py-1"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => navigate('/more-menus')}
            >
              <Icon size={22} />
              <span>More</span>
            </button>
          );
        }
        return (
          <NavLink
            key={menu.key}
            to={menu.path}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-2 py-1 focus:outline-none transition-colors ${
                isActive ? 'text-[#9B6DFF]' : ''
              }`
            }
            style={({ isActive }) => isActive ? {} : { color: 'var(--text-muted)' }}
            end={menu.key === 'dashboard'}
          >
            <Icon size={22} />
            <span>{menu.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
