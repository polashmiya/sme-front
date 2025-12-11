import { Banknote, Boxes, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MORE_MENUS = [
  { key: 'account', label: 'Accounts', icon: Banknote, path: '/account' },
  { key: 'inventory', label: 'Inventory', icon: Boxes, path: '/inventory' },
  { key: 'configuration', label: 'Configuration', icon: Settings, path: '/configuration' },
];

export default function MoreMenusPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]  px-4 pt-4 pb-20">
      <h2 className="text-lg font-semibold mb-6">More Menus</h2>
      <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto">
        {MORE_MENUS.map(menu => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.key}
              className="w-full flex items-center gap-4 px-4 py-5 rounded-2xl border border-gray-200 shadow-md bg-white hover:bg-blue-50 focus:outline-none transition-all"
              style={{ minWidth: 0 }}
              onClick={() => navigate(menu.path)}
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                <Icon size={28} className="text-blue-600" />
              </span>
              <span className="text-base font-semibold text-gray-800 text-left">{menu.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
