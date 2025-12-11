import { BarChart3, Files, BookText, Wallet, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobilePageHeader from './MobilePageHeader';

const ACCOUNT_SUB_MENUS = [
  { key: 'account.dashboard', label: 'Dashboard', icon: BarChart3, path: '/account/dashboard' },
  { key: 'account.coa', label: 'Chart of Accounts', icon: Files, path: '/account/coa' },
  { key: 'account.journal', label: 'Journal', icon: BookText, path: '/account/journal' },
  { key: 'account.expense', label: 'Expense', icon: Wallet, path: '/account/expense' },
  { key: 'account.financial', label: 'Financial Report', icon: FileText, path: '/account/financial-report' },
  { key: 'account.other', label: 'Other Report', icon: FileText, path: '/account/other-report' },
];

export default function AccountSubMenuPage() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 576;
  return (
    <div className="flex flex-col items-center min-h-[60vh]  px-4 pt-2 pb-20 relative">
      {isMobile ? (
        <MobilePageHeader title="Account Modules" showBack={true} />
      ) : (
        <h2 className="text-lg font-semibold mb-6">Account Modules</h2>
      )}
      <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto mt-2">
        {ACCOUNT_SUB_MENUS.map(menu => {
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
