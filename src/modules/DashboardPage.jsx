import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  Wallet,
  CreditCard,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileText,
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
import { HeaderWithOutCard } from "../common/components/Header";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const salesPurchaseTrend = months.map((m) => ({
  name: m,
  sales: Math.floor(Math.random() * 9000) + 1000,
  purchase: Math.floor(Math.random() * 7000) + 800,
}));
const topItems = Array.from({ length: 5 }).map((_, i) => ({
  name: `Item ${i + 1}`,
  value: Math.floor(Math.random() * 5000) + 500,
}));
const topCustomers = Array.from({ length: 5 }).map((_, i) => ({
  name: `Customer ${i + 1}`,
  value: Math.floor(Math.random() * 4000) + 400,
}));
const topSuppliers = Array.from({ length: 5 }).map((_, i) => ({
  name: `Supplier ${i + 1}`,
  value: Math.floor(Math.random() * 3500) + 350,
}));
const expenseBreakdown = [
  { name: "Rent", value: 12000 },
  { name: "Salary", value: 38000 },
  { name: "Marketing", value: 8000 },
  { name: "Utilities", value: 5000 },
  { name: "Other", value: 3000 },
];
const cashFlowTrend = months.map((m) => ({
  name: m,
  inflow: Math.floor(Math.random() * 10000) + 5000,
  outflow: Math.floor(Math.random() * 8000) + 3000,
}));

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#dc2626",
  "#0d9488",
  "#854d0e",
];

const kpiData = () => [
  { key: "totalSales", icon: ShoppingCart, value: "৳ 12,50,000" },
  { key: "totalPurchases", icon: Package, value: "৳ 8,20,000" },
  { key: "totalCollection", icon: Wallet, value: "৳ 7,10,000" },
  { key: "outstandingReceivable", icon: CreditCard, value: "৳ 2,40,000" },
  { key: "outstandingPayable", icon: CreditCard, value: "৳ 1,80,000" },
  { key: "grossProfit", icon: TrendingUp, value: "22.4%" },
  { key: "stockValue", icon: Package, value: "৳ 9,60,000" },
  { key: "expenses", icon: Wallet, value: "৳ 1,15,000" },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <>
      <HeaderWithOutCard
        title={t("dashboard.title", { defaultValue: "Dashboard" })}
        onBack={undefined}
      />
      <div className="flex flex-col gap-6">
        {/* KPI Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData().map((k, i) => (
            <motion.div
              key={k.key}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <k.icon size={16} className="text-blue-600" />{" "}
                {t(`dashboard.kpis.${k.key}`)}
              </div>
              <div className="text-xl font-semibold">{k.value}</div>
            </motion.div>
          ))}
        </div>
        {/* Charts Section */}
        <div className="grid xl:grid-cols-3 gap-6">
          <ChartCard title={t("dashboard.charts.salesVsPurchase")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPurchaseTrend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchase" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("dashboard.charts.topSellingItems")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#9333ea" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("dashboard.charts.topCustomers")}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCustomers}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {topCustomers.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("dashboard.charts.topSuppliers")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSuppliers} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#ea580c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("dashboard.charts.expenseBreakdown")}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {expenseBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("dashboard.charts.cashFlow")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowTrend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inflow" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        {/* Lists & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <ListCard
            title={t("dashboard.lists.pendingApprovals")}
            icon={<AlertTriangle size={16} className="text-yellow-600" />}
            items={[
              {
                id: "PO-1001",
                label: "PO-1001 - Supplier X - ৳ 9,500",
                to: "/approval",
              },
              {
                id: "SO-1023",
                label: "SO-1023 - Customer A - ৳ 12,000",
                to: "/approval",
              },
              {
                id: "PO-1002",
                label: "PO-1002 - Supplier Y - ৳ 7,200",
                to: "/approval",
              },
            ]}
          />
          <ListCard
            title={t("dashboard.lists.recentInvoices")}
            icon={<FileText size={16} className="text-blue-600" />}
            items={[
              {
                id: "INV-3001",
                label: "INV-3001 - Customer B - ৳ 15,400",
                to: "/sales/order",
              },
              {
                id: "INV-3002",
                label: "INV-3002 - Customer C - ৳ 11,200",
                to: "/sales/order",
              },
              {
                id: "INV-3003",
                label: "INV-3003 - Customer D - ৳ 9,800",
                to: "/sales/order",
              },
            ]}
          />
          <ListCard
            title={t("dashboard.lists.lowStock")}
            icon={<Package size={16} className="text-red-600" />}
            items={[
              {
                id: "ITM-1",
                label: "Item A (10 pcs left)",
                to: "/inventory/adjustment",
              },
              {
                id: "ITM-2",
                label: "Item B (5 pcs left)",
                to: "/inventory/adjustment",
              },
              {
                id: "ITM-3",
                label: "Item C (2 pcs left)",
                to: "/inventory/adjustment",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

function FilterSelect({ label, options }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 font-medium">{label}:</span>
      <select className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
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

function ListCard({ title, icon, items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col"
    >
      <h2 className="text-xs font-semibold mb-3 flex items-center gap-2">
        {icon} {title}
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={it.to}
              className="block px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
