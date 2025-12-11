import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShoppingBag, MoreHorizontal, Banknote, Boxes, Settings } from 'lucide-react';
// import { useState } from 'react';

const MAIN_MENUS = [
  { key: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/' },
  { key: 'purchase', label: 'Purchase', icon: ShoppingCart, path: '/purchase' },
  { key: 'sales', label: 'Sales', icon: ShoppingBag, path: '/sales' },
  { key: 'more', label: 'More', icon: MoreHorizontal },
];

const MORE_MENUS = [
  { key: 'account', label: 'Accounts', icon: Banknote, path: '/account/dashboard' },
  { key: 'inventory', label: 'Inventory', icon: Boxes, path: '/inventory/dashboard' },
  { key: 'configuration', label: 'Configuration', icon: Settings, path: '/configuration' },
];

export default function BottomNav() {
  const navigate = useNavigate();

  // Only show on mobile
  if (window.innerWidth > 576) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center z-50 py-2 shadow-lg"
      style={{ minWidth: '100vw', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}
    >
      {MAIN_MENUS.map(menu => {
        const Icon = menu.icon;
        if (menu.key === 'more') {
          return (
            <button key="more" className="flex flex-col items-center text-xs px-2 py-1 text-gray-500" onClick={() => navigate('/more-menus')}>
              <Icon size={22} />
              <span>More</span>
            </button>
          );
        }
        return (
          <NavLink
            key={menu.key}
            to={menu.path}
            className={({ isActive }) => `flex flex-col items-center text-xs px-2 py-1 focus:outline-none ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
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
