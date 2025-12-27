import { BarChart3, SlidersHorizontal, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobilePageHeader from './MobilePageHeader';

const INVENTORY_SUB_MENUS = [
  { key: 'inventory.dashboard', label: 'Dashboard', icon: BarChart3, path: '/inventory/dashboard' },
  { key: 'inventory.adjustment', label: 'Adjustment', icon: SlidersHorizontal, path: '/inventory/adjustment' },
  { key: 'inventory.reports', label: 'Reports', icon: FileText, path: '/inventory/reports' },
];

export default function InventorySubMenuPage() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 576;
  return (
    <div className="flex flex-col items-center min-h-[60vh]  px-4 pt-2 pb-20">
      <MobilePageHeader title="Inventory Modules" showBack={true} />
      {!isMobile && <h2 className="text-lg font-semibold mb-6">Inventory Modules</h2>}
      <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto mt-2">
        {INVENTORY_SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.key}
              className="w-full flex items-center gap-4 px-4 py-5 rounded-2xl border border-gray-200 shadow-md bg-white hover:bg-primary/5 focus:outline-none transition-all"
              style={{ minWidth: 0 }}
              onClick={() => navigate(menu.path)}
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: '#F3EDFF' }}>
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
