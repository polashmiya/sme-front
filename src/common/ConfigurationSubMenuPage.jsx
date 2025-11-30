import { Users, Package, UserRound, Building2, BadgePercent, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobilePageHeader from './MobilePageHeader';

const CONFIG_SUB_MENUS = [
  { key: 'configuration.employee', label: 'Employee', icon: Users, path: '/configuration/employee' },
  { key: 'configuration.itemProfile', label: 'Item Profile', icon: Package, path: '/configuration/item-profile' },
  { key: 'configuration.customerProfile', label: 'Customer Profile', icon: UserRound, path: '/configuration/customer-profile' },
  { key: 'configuration.supplierProfile', label: 'Supplier Profile', icon: Building2, path: '/configuration/supplier-profile' },
  { key: 'configuration.offerSetup', label: 'Offer Setup', icon: BadgePercent, path: '/configuration/offer-setup' },
  { key: 'configuration.customerPrice', label: 'Customer Price', icon: Tag, path: '/configuration/customer-price' },
  { key: 'configuration.standardPrice', label: 'Standard Price', icon: Tag, path: '/configuration/standard-price' },
];

export default function ConfigurationSubMenuPage() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 576;
  return (
    <div className="flex flex-col items-center min-h-[60vh]  px-4 pt-2 pb-20 relative">
      {isMobile ? (
        <MobilePageHeader title="Configuration Modules" showBack={true} />
      ) : (
        <h2 className="text-lg font-semibold mb-6">Configuration Modules</h2>
      )}
      <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto mt-2">
        {CONFIG_SUB_MENUS.map(menu => {
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
