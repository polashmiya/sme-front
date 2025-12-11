import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  PieChart as PieIcon,
  TrendingUp,
  Banknote,
  AlarmClock,
  Wallet,
  BarChart3,
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
import { HeaderWithOutCard } from "../../../../common/components/Header";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#dc2626",
  "#0d9488",
  "#854d0e",
];
const colorFor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const revenueVsExpense = months.map((m) => ({
  name: m,
  revenue: Math.floor(Math.random() * 1100000) + 300000,
  expense: Math.floor(Math.random() * 700000) + 150000,
}));
const receivableAging = [
  { name: "0-30d", value: 120000 },
  { name: "31-60d", value: 65000 },
  { name: "60+d", value: 40000 },
];
const payableAging = [
  { name: "Upcoming", value: 95000 },
  { name: "Overdue", value: 55000 },
];
const expenseBreakdown = [
  { name: "Salaries", value: 380000 },
  { name: "Rent", value: 100000 },
  { name: "Utilities", value: 50000 },
  { name: "Marketing", value: 80000 },
  { name: "Others", value: 30000 },
];
const cashFlow = months.map((m) => ({
  name: m,
  inflow: Math.floor(Math.random() * 900000) + 200000,
  outflow: Math.floor(Math.random() * 700000) + 150000,
}));

const kpis = [
  {
    key: "cashBank",
    icon: DollarSign,
    value: "৳ 15,50,000",
    tone: "text-green-600",
  },
  {
    key: "receivables",
    icon: Wallet,
    value: "৳ 2,50,000",
    tone: "text-blue-600",
  },
  {
    key: "payables",
    icon: CreditCard,
    value: "৳ 1,80,000",
    tone: "text-red-600",
  },
  {
    key: "expenses",
    icon: Banknote,
    value: "৳ 1,20,000",
    tone: "text-indigo-600",
  },
  {
    key: "overdueReceivables",
    icon: AlarmClock,
    value: "৳ 40,000",
    tone: "text-orange-600",
  },
  {
    key: "upcomingPayments",
    icon: CreditCard,
    value: "৳ 25,000",
    tone: "text-yellow-600",
  },
  {
    key: "netProfit",
    icon: TrendingUp,
    value: "৳ 5,60,000",
    tone: "text-green-700",
  },
  { key: "budgetSpend", icon: PieIcon, value: "72%", tone: "text-purple-600" },
];

export default function AccountDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 576;
  return (
    <>
      <HeaderWithOutCard
        title={t("account.dash.title", { defaultValue: "Account Dashboard" })}
        onBack={isMobile ? () => navigate(-1) : undefined}
      />
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
                {t(`account.dash.kpis.${k.key}`)}
              </div>
              <div className="text-xl font-semibold mt-1">{k.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid xl:grid-cols-3 gap-6">
          <ChartCard title={t("account.dash.charts.revenueVsExpense")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpense}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(n) => n / 1000 + "k"} />
                <Tooltip formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("account.dash.charts.receivableAging")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={receivableAging}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("account.dash.charts.payableAging")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payableAging}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("account.dash.charts.expenseBreakdown")}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {expenseBreakdown.map((it) => (
                    <Cell key={it.name} fill={colorFor(it.name)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t("account.dash.charts.cashFlow")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlow}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(n) => n / 1000 + "k"} />
                <Tooltip formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="inflow" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Lists & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <ListCard
            title={t("account.dash.lists.approvals")}
            items={[
              {
                id: "EXP-101",
                label: "Expense-101 - Travel - ৳ 5,000",
                to: "/account/expense",
                status: "Pending",
              },
              {
                id: "JRN-102",
                label: "Journal-102 - Adjustment - ৳ 12,000",
                to: "/account/journal",
                status: "Pending",
              },
            ]}
          />
          <ListCard
            title={t("account.dash.lists.recentPayments")}
            items={[
              {
                id: "PMT-2001",
                label: "Supplier X - PO-1023 - ৳ 50,000",
                to: "/purchase/payment",
                status: "Paid",
              },
              {
                id: "PMT-2002",
                label: "Supplier Y - PO-1024 - ৳ 35,000",
                to: "/purchase/payment",
                status: "Paid",
              },
            ]}
          />
          <ListCard
            title={t("account.dash.lists.recentCollections")}
            items={[
              {
                id: "COL-3001",
                label: "Customer A - SO-105 - ৳ 30,000",
                to: "/sales/collection",
                status: "Received",
              },
              {
                id: "COL-3002",
                label: "Customer B - SO-108 - ৳ 25,000",
                to: "/sales/collection",
                status: "Received",
              },
            ]}
          />
          <ListCard
            title={t("account.dash.lists.overdueReceivables")}
            items={[
              {
                id: "CUS-B",
                label: "Customer B - ৳ 40,000",
                to: "/sales/collection",
                status: "Overdue",
              },
              {
                id: "CUS-C",
                label: "Customer C - ৳ 25,000",
                to: "/sales/collection",
                status: "Overdue",
              },
            ]}
          />
          <ListCard
            title={t("account.dash.lists.recentExpenses")}
            items={[
              {
                id: "EXP-1",
                label: "Electricity Bill - ৳ 8,000",
                to: "/account/expense",
                status: "Paid",
              },
              {
                id: "EXP-2",
                label: "Office Supplies - ৳ 12,000",
                to: "/account/expense",
                status: "Pending",
              },
            ]}
          />
          <ListCard
            title={t("account.dash.lists.budgetAlerts")}
            items={[
              {
                id: "BUD-1",
                label: "Marketing - 85% of monthly budget",
                to: "/account/financial-report",
                status: "Alert",
              },
              {
                id: "BUD-2",
                label: "Utilities - 75% of monthly budget",
                to: "/account/financial-report",
                status: "Warning",
              },
            ]}
          />
        </div>
      </div>
    </>
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
      Paid: "bg-green-100 text-green-700 border-green-200",
      Received: "bg-blue-100 text-blue-700 border-blue-200",
      Overdue: "bg-red-100 text-red-700 border-red-200",
      Alert: "bg-orange-100 text-orange-700 border-orange-200",
      Warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
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
