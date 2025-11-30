import {
  FilePlus2,
  Inbox,
  RotateCcw,
  CreditCard,
  FileText,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobilePageHeader from "./MobilePageHeader";

const PURCHASE_SUB_MENUS = [
  {
    key: "purchase.dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/purchase/dashboard",
  },
  {
    key: "purchase.order",
    label: "Order",
    icon: FilePlus2,
    path: "/purchase/order",
  },
  {
    key: "purchase.receive",
    label: "Receive",
    icon: Inbox,
    path: "/purchase/receive",
  },
  {
    key: "purchase.return",
    label: "Return",
    icon: RotateCcw,
    path: "/purchase/return",
  },
  {
    key: "purchase.payment",
    label: "Payment",
    icon: CreditCard,
    path: "/purchase/payment",
  },
  {
    key: "purchase.report",
    label: "Report",
    icon: FileText,
    path: "/purchase/report",
  },
];

export default function PurchaseSubMenuPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]  px-4 pt-4 pb-20">
      <MobilePageHeader title="Purchase Modules" showBack={false} />
      <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto">
        {PURCHASE_SUB_MENUS.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.key}
              className=" flex items-center gap-4 px-4 py-5 rounded-2xl border border-gray-200 shadow-md bg-white hover:bg-blue-50 focus:outline-none transition-all"
              style={{ minWidth: 0 }}
              onClick={() => navigate(menu.path)}
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                <Icon size={28} className="text-blue-600" />
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
