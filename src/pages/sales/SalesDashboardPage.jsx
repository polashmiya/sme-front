import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { ShoppingCart, CheckCircle2, Clock, RotateCcw, Wallet, CreditCard, AlertTriangle, BarChart3, CirclePlus, Package } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'

const COLORS = ['#2563eb','#16a34a','#9333ea','#ea580c','#dc2626','#0d9488','#854d0e']

const months = ['Jan','Feb','Mar','Apr','May','Jun']
const salesTrend = months.map(m => ({ name:m, sales: Math.floor(Math.random()*950000)+150000 }))
const topItems = Array.from({length:5}).map((_,i)=>({ name:`Item ${i+1}`, value: Math.floor(Math.random()*5000)+500 }))
const topCustomers = Array.from({length:5}).map((_,i)=>({ name:`Customer ${i+1}`, value: Math.floor(Math.random()*400000)+80000 }))
const deliveryStatusData = [{ name:'Delivered', value: 380 }, { name:'Pending', value: 70 }, { name:'Returned', value: 15 }]
const receivableAging = [{ name:'0-30d', value: 120000 },{ name:'31-60d', value: 65000 },{ name:'60+d', value: 25000 }]

const kpis = [
  { key:'totalSales', icon: Wallet, value:'৳ 12,50,000', tone:'text-green-600' },
  { key:'totalOrders', icon: ShoppingCart, value:'45 Orders', tone:'text-blue-600' },
  { key:'delivered', icon: CheckCircle2, value:'38 Orders', tone:'text-green-600' },
  { key:'pending', icon: Clock, value:'7 Orders', tone:'text-yellow-600' },
  { key:'returns', icon: RotateCcw, value:'৳ 15,000', tone:'text-red-600' },
  { key:'collections', icon: CreditCard, value:'৳ 10,00,000', tone:'text-indigo-600' },
  { key:'receivables', icon: AlertTriangle, value:'৳ 2,50,000', tone:'text-orange-600' },
  { key:'lowStockImpact', icon: Package, value:'12 items', tone:'text-red-600' },
]

export default function SalesDashboardPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6">
      {/* Filters & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <Filter label={t('sales.dash.filters.dateRange')} />
          <Filter label={t('sales.dash.filters.branch')} />
          <Filter label={t('sales.dash.filters.salesperson')} />
          <Filter label={t('sales.dash.filters.customerGroup')} />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/sales/order" className="btn-primary"><CirclePlus size={16} /> {t('sales.dash.actions.createOrder')}</Link>
          <Link to="/sales/collection" className="btn-outline">{t('sales.dash.actions.recordCollection')}</Link>
          <Link to="/sales/return" className="btn-outline">{t('sales.dash.actions.processReturn')}</Link>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k,i)=>(
          <motion.div key={k.key} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }} className="card">
            <div className="text-xs font-medium text-gray-600 flex items-center gap-2"><k.icon size={16} className={k.tone} /> {t(`sales.dash.kpis.${k.key}`)}</div>
            <div className="text-xl font-semibold mt-1">{k.value}</div>
          </motion.div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid xl:grid-cols-3 gap-6">
        <ChartCard title={t('sales.dash.charts.trend')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTrend}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={n=> (n/1000)+'k'} />
              <Tooltip formatter={(v)=> v.toLocaleString()} />
              <Bar dataKey="sales" fill="#2563eb" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('sales.dash.charts.topItems')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItems} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#9333ea" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('sales.dash.charts.topCustomers')}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topCustomers} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={2}>
                {topCustomers.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('sales.dash.charts.deliveryStatus')}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={deliveryStatusData} dataKey="value" outerRadius={70} paddingAngle={2}>
                {deliveryStatusData.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('sales.dash.charts.receivableAging')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={receivableAging}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#dc2626" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      {/* Lists & Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ListCard title={t('sales.dash.lists.approvals')} items={[
          { id:'SO-1025', label:'SO-1025 - Customer X - ৳ 50,000', to:'/sales/order', status:'Pending' },
          { id:'SO-1024', label:'SO-1024 - Customer A - ৳ 32,000', to:'/sales/order', status:'Pending' },
        ]} />
        <ListCard title={t('sales.dash.lists.recentOrders')} items={[
          { id:'SO-1020', label:'SO-1020 - Customer A - Pending', to:'/sales/order', status:'Pending' },
          { id:'SO-1019', label:'SO-1019 - Customer B - Approved', to:'/sales/order', status:'Approved' },
          { id:'SO-1018', label:'SO-1018 - Customer C - Delivered', to:'/sales/order', status:'Delivered' },
        ]} />
        <ListCard title={t('sales.dash.lists.pendingDeliveries')} items={[
          { id:'SO-1015', label:'SO-1015 - ETA: 3 days', to:'/sales/delivery', status:'Pending' },
          { id:'SO-1014', label:'SO-1014 - ETA: 1 day', to:'/sales/delivery', status:'Pending' },
        ]} />
        <ListCard title={t('sales.dash.lists.recentReturns')} items={[
          { id:'RET-1', label:'Item C - 5 pcs', to:'/sales/return', status:'Returned' },
          { id:'RET-2', label:'Item D - 2 pcs', to:'/sales/return', status:'Returned' },
        ]} />
        <ListCard title={t('sales.dash.lists.overdueReceivables')} items={[
          { id:'CUS-B', label:'Customer B - ৳ 40,000', to:'/sales/collection', status:'Overdue' },
          { id:'CUS-C', label:'Customer C - ৳ 25,000', to:'/sales/collection', status:'Overdue' },
        ]} />
        <ListCard title={t('sales.dash.lists.topHighlights')} items={[
          { id:'TOP-1', label:'Customer A - ৳ 2,00,000', to:'/sales/order', status:'Top' },
          { id:'TOP-2', label:'Item 1 - 1200 units', to:'/sales/order', status:'Fast' },
        ]} />
      </div>
    </div>
  )
}

function Filter({ label }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 font-medium">{label}:</span>
      <select className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white">
        <option>All</option>
      </select>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="card h-64 flex flex-col">
      <h2 className="text-xs font-semibold mb-2 flex items-center gap-2"><BarChart3 size={14} className="text-gray-500" /> {title}</h2>
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  )
}

function ListCard({ title, items }) {
  const badge = (status) => {
    const m = {
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Approved: 'bg-blue-100 text-blue-700 border-blue-200',
      Delivered: 'bg-green-100 text-green-700 border-green-200',
      Overdue: 'bg-red-100 text-red-700 border-red-200',
      Returned: 'bg-orange-100 text-orange-700 border-orange-200',
      Top: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      Fast: 'bg-purple-100 text-purple-700 border-purple-200',
    }
    return `inline-block px-2 py-0.5 text-[11px] rounded-md border ${m[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`
  }
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="card flex flex-col">
      <h2 className="text-xs font-semibold mb-3 flex items-center gap-2">{title}</h2>
      <ul className="space-y-2 text-sm">
        {items.map(it => (
          <li key={it.id} className="flex items-center justify-between gap-2">
            <Link to={it.to} className="flex-1 block px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              {it.label}
            </Link>
            {it.status && <span className={badge(it.status)}>{it.status}</span>}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
