import {
  FilePlus2,
  Truck,
  RotateCcw,
  Wallet,
  FileText,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobilePageHeader from "./MobilePageHeader";

const SALES_SUB_MENUS = [
  {
    key: "sales.dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/sales/dashboard",
  },
  { key: "sales.order", label: "Order", icon: FilePlus2, path: "/sales/order" },
  {
    key: "sales.delivery",
    label: "Delivery",
    icon: Truck,
    path: "/sales/delivery",
  },
  {
    key: "sales.return",
    label: "Return",
    icon: RotateCcw,
    path: "/sales/return",
  },
  {
    key: "sales.collection",
    label: "Collection",
    icon: Wallet,
    path: "/sales/collection",
  },
  {
    key: "sales.report",
    label: "Report",
    icon: FileText,
    path: "/sales/report",
  },
];

export default function SalesSubMenuPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]  px-4 pt-4 pb-20">
      <MobilePageHeader title="Sales Modules" showBack={false} />
      <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto">
        {SALES_SUB_MENUS.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.key}
              className="w-full flex items-center gap-4 px-4 py-5 rounded-2xl border border-gray-200 shadow-md bg-white hover:bg-primary/5 focus:outline-none transition-all"
              style={{ minWidth: 0 }}
              onClick={() => navigate(menu.path)}
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: '#F3EDFF' }}>
                <Icon size={28} style={{ color: '#8C57FF' }} />
              </span>
              <span className="text-base font-semibold text-gray-800 text-left">
                {menu.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
