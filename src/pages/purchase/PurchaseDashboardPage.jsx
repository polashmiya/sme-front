import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Inbox,
  RotateCcw,
  CreditCard,
  Package,
  AlertTriangle,
  Users,
  Truck,
  BarChart3,
  PieChart as PieIcon,
  CirclePlus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#dc2626",
  "#0d9488",
  "#854d0e",
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const trend = months.map((m) => ({
  name: m,
  pos: Math.floor(Math.random() * 50) + 20,
  received: Math.floor(Math.random() * 45) + 15,
}));
const suppliers = Array.from({ length: 5 }).map((_, i) => ({
  name: `Supplier ${i + 1}`,
  value: Math.floor(Math.random() * 900000) + 100000,
}));
const returnRatio = [
  { name: "Received", value: 920 },
  { name: "Returned", value: 80 },
];
const pendingByDate = Array.from({ length: 6 }).map((_, i) => ({
  name: `D+${i}`,
  count: Math.floor(Math.random() * 12) + 1,
}));
const spendByCat = [
  { name: "Raw Materials", value: 420000 },
  { name: "Consumables", value: 160000 },
  { name: "Services", value: 120000 },
];

const kpis = [
  {
    key: "totalPOs",
    icon: ShoppingCart,
    value: "45 POs",
    tone: "text-blue-600",
  },
  { key: "received", icon: Inbox, value: "38 POs", tone: "text-green-600" },
  {
    key: "pending",
    icon: AlertTriangle,
    value: "7 POs",
    tone: "text-yellow-600",
  },
  {
    key: "returns",
    icon: RotateCcw,
    value: "৳ 15,000",
    tone: "text-orange-600",
  },
  { key: "spend", icon: Package, value: "৳ 8,20,000", tone: "text-indigo-600" },
  {
    key: "duePayments",
    icon: CreditCard,
    value: "৳ 1,80,000",
    tone: "text-red-600",
  },
  { key: "lowStock", icon: Package, value: "12 items", tone: "text-red-600" },
  { key: "leadTime", icon: Truck, value: "5.2 days", tone: "text-gray-700" },
];

export default function PurchaseDashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card"
          >
            <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <k.icon size={16} className={k.tone} />{" "}
              {t(`purchase.dash.kpis.${k.key}`)}
            </div>
            <div className="text-xl font-semibold mt-1">{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-3 gap-6">
        <ChartCard title={t("purchase.dash.charts.trend")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="pos"
                name="POs"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="received"
                name="Received"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("purchase.dash.charts.topSuppliers")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={suppliers} layout="vertical">
              <XAxis type="number" tickFormatter={(n) => n.toLocaleString()} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#9333ea" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("purchase.dash.charts.returnRatio")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={returnRatio}
                dataKey="value"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
              >
                {returnRatio.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("purchase.dash.charts.pendingByDate")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pendingByDate}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("purchase.dash.charts.spendByCategory")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendByCat}
                dataKey="value"
                outerRadius={70}
                paddingAngle={3}
              >
                {spendByCat.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Lists & Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ListCard
          title={t("purchase.dash.lists.approvals")}
          items={[
            {
              id: "PO-1025",
              label: "PO-1025 - Supplier X - ৳ 50,000",
              to: "/approval",
              status: "Pending",
            },
            {
              id: "PO-1024",
              label: "PO-1024 - Supplier A - ৳ 32,000",
              to: "/approval",
              status: "Pending",
            },
          ]}
        />
        <ListCard
          title={t("purchase.dash.lists.recentPOs")}
          items={[
            {
              id: "PO-1020",
              label: "PO-1020 - Supplier A - Pending",
              to: "/purchase/order",
              status: "Pending",
            },
            {
              id: "PO-1019",
              label: "PO-1019 - Supplier B - Approved",
              to: "/purchase/order",
              status: "Approved",
            },
            {
              id: "PO-1018",
              label: "PO-1018 - Supplier C - Received",
              to: "/purchase/order",
              status: "Received",
            },
          ]}
        />
        <ListCard
          title={t("purchase.dash.lists.lowStock")}
          items={[
            {
              id: "ITM-1",
              label: "Item A - 10 pcs left",
              to: "/inventory/adjustment",
              status: "Low",
            },
            {
              id: "ITM-2",
              label: "Item B - 5 pcs left",
              to: "/inventory/adjustment",
              status: "Low",
            },
          ]}
        />
        <ListCard
          title={t("purchase.dash.lists.pendingDeliveries")}
          items={[
            {
              id: "PO-1015",
              label: "PO-1015 - ETA: 3 days",
              to: "/purchase/receive",
              status: "Pending",
            },
            {
              id: "PO-1014",
              label: "PO-1014 - ETA: 1 days",
              to: "/purchase/receive",
              status: "Pending",
            },
          ]}
        />
        <ListCard
          title={t("purchase.dash.lists.duePayments")}
          items={[
            {
              id: "SUP-B",
              label: "Supplier B - ৳ 40,000",
              to: "/purchase/payment",
              status: "Due",
            },
            {
              id: "SUP-C",
              label: "Supplier C - ৳ 25,000",
              to: "/purchase/payment",
              status: "Due",
            },
          ]}
        />
        <ListCard
          title={t("purchase.dash.lists.returnRequests")}
          items={[
            {
              id: "RTN-1",
              label: "Item C - 5 pcs",
              to: "/purchase/return",
              status: "Requested",
            },
            {
              id: "RTN-2",
              label: "Item D - 2 pcs",
              to: "/purchase/return",
              status: "Requested",
            },
          ]}
        />
      </div>
    </div>
  );
}

function Filter({ label }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 font-medium">{label}:</span>
      <select className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white">
        <option>All</option>
      </select>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card h-64 flex flex-col"
    >
      <h2 className="text-xs font-semibold mb-2 flex items-center gap-2">
        <BarChart3 size={14} className="text-gray-500" /> {title}
      </h2>
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  );
}

function ListCard({ title, items }) {
  const badge = (status) => {
    const m = {
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Approved: "bg-blue-100 text-blue-700 border-blue-200",
      Received: "bg-green-100 text-green-700 border-green-200",
      Overdue: "bg-red-100 text-red-700 border-red-200",
      Due: "bg-red-100 text-red-700 border-red-200",
      Requested: "bg-orange-100 text-orange-700 border-orange-200",
      Low: "bg-red-100 text-red-700 border-red-200",
    };
    return `inline-block px-2 py-0.5 text-[11px] rounded-md border ${
      m[status] || "bg-gray-100 text-gray-700 border-gray-200"
    }`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col"
    >
      <h2 className="text-xs font-semibold mb-3 flex items-center gap-2">
        {title}
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-2">
            <Link
              to={it.to}
              className="flex-1 block px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {it.label}
            </Link>
            {it.status && <span className={badge(it.status)}>{it.status}</span>}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
