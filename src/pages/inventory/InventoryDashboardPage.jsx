import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Package, Tags, TrendingUp, TrendingDown, AlertTriangle, Warehouse, Wrench, RefreshCcw, LineChart, PieChart as PieIcon, BarChart3, Activity, Truck, ScrollText, CirclePlus, MoveHorizontal, FileBarChart } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, LineChart as RLChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Link } from 'react-router-dom'

// Mock Data Generators
const months = ['Jan','Feb','Mar','Apr','May','Jun']
const stockInOut = months.map(m => ({ name:m, in: Math.floor(Math.random()*400)+600, out: Math.floor(Math.random()*350)+500 }))
const categoryValues = [
  { name:'Raw Materials', value: 420000 },
  { name:'Finished Goods', value: 680000 },
  { name:'Consumables', value: 120000 },
  { name:'Packaging', value: 80000 },
]
const topItemsByValue = Array.from({ length: 10 }).map((_,i)=> ({ name:`Item ${i+1}`, value: Math.floor(Math.random()*90000)+10000 }))
const lowStockTrend = months.map(m => ({ name:m, count: Math.floor(Math.random()*30)+10 }))
const warehouseValue = [
  { name:'WH1', value: 480000 },
  { name:'WH2', value: 520000 },
  { name:'WH3', value: 280000 },
]
const movementTrend = months.map(m => ({ name:m, in: Math.floor(Math.random()*500)+500, out: Math.floor(Math.random()*450)+400, transfer: Math.floor(Math.random()*200)+100 }))

const COLORS = ['#2563eb','#16a34a','#9333ea','#ea580c','#dc2626','#0d9488','#854d0e','#6366f1','#059669']
const colorFor = (name) => { let h=0; for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i))>>>0; return COLORS[h % COLORS.length] }

const kpis = [
  { key:'totalItems', icon: Package, value:'2,150', tone:'text-indigo-600' },
  { key:'totalValue', icon: Tags, value:'৳ 12,80,000', tone:'text-green-600' },
  { key:'stockInMonth', icon: TrendingUp, value:'৳ 3,50,000', tone:'text-blue-600' },
  { key:'stockOutMonth', icon: TrendingDown, value:'৳ 2,90,000', tone:'text-orange-600' },
  { key:'lowStockItems', icon: AlertTriangle, value:'25', tone:'text-red-600' },
  { key:'overstockItems', icon: Warehouse, value:'15', tone:'text-yellow-600' },
  { key:'adjustments', icon: Wrench, value:'৳ 18,000', tone:'text-purple-600' },
  { key:'turnoverRatio', icon: RefreshCcw, value:'4.8x', tone:'text-emerald-600' },
]

export default function InventoryDashboardPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6">
      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Filter label={t('inventory.dash.filters.dateRange')} />
          <Filter label={t('inventory.dash.filters.warehouse')} />
          <Filter label={t('inventory.dash.filters.category')} />
          <Filter label={t('inventory.dash.filters.itemType')} />
          <Filter label={t('inventory.dash.filters.supplier')} />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/inventory/adjustment" className="btn-primary"><Wrench size={16} /> {t('inventory.dash.actions.adjustStock')}</Link>
          <Link to="/configuration/item-profile" className="btn-outline"><CirclePlus size={16} /> {t('inventory.dash.actions.addItem')}</Link>
          <Link to="/inventory/transfer" className="btn-outline"><MoveHorizontal size={16} /> {t('inventory.dash.actions.transferStock')}</Link>
          <Link to="/inventory/reports" className="btn-outline"><FileBarChart size={16} /> {t('inventory.dash.actions.stockReport')}</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k,i)=>(
          <motion.div key={k.key} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }} className="card hover:shadow-md transition-shadow">
            <div className="text-xs font-medium text-gray-600 flex items-center gap-2"><k.icon size={16} className={k.tone} /> {t(`inventory.dash.kpis.${k.key}`)}</div>
            <div className="text-xl font-semibold mt-1">{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Analytics */}
      <div className="grid xl:grid-cols-3 gap-6">
        <ChartCard title={t('inventory.dash.charts.stockInVsOut')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockInOut}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="in" fill="#16a34a" radius={[4,4,0,0]} />
              <Bar dataKey="out" fill="#dc2626" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('inventory.dash.charts.valueByCategory')}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryValues} dataKey="value" outerRadius={70} paddingAngle={3}>
                {categoryValues.map(it => (<Cell key={it.name} fill={colorFor(it.name)} />))}
              </Pie>
              <Tooltip formatter={(v)=> '৳ '+Number(v).toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('inventory.dash.charts.topItemsByValue')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItemsByValue} layout="vertical" margin={{ left:40 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(v)=> '৳ '+Number(v).toLocaleString()} />
              <Bar dataKey="value" fill="#6366f1" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('inventory.dash.charts.lowStockTrend')}>
          <ResponsiveContainer width="100%" height="100%">
            <RLChart data={lowStockTrend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} dot={{ r:3 }} />
            </RLChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('inventory.dash.charts.warehouseStockValue')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={warehouseValue}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v)=> '৳ '+Number(v).toLocaleString()} />
              <Bar dataKey="value" fill="#059669" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('inventory.dash.charts.movementTrend')}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={movementTrend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area dataKey="in" stackId="1" stroke="#16a34a" fill="#16a34a33" />
              <Area dataKey="out" stackId="1" stroke="#dc2626" fill="#dc262633" />
              <Area dataKey="transfer" stackId="1" stroke="#2563eb" fill="#2563eb33" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Lists & Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ListCard title={t('inventory.dash.lists.lowStockAlerts')} items={[
          { id:'LS1', label:'Item A - 10 pcs left', status:'Critical', to:'/configuration/item-profile' },
          { id:'LS2', label:'Item F - 5 pcs left', status:'Critical', to:'/configuration/item-profile' },
        ]} />
        <ListCard title={t('inventory.dash.lists.overstockAlerts')} items={[
          { id:'OS1', label:'Item B - 5,000 pcs (limit 3,000)', status:'Alert', to:'/configuration/item-profile' },
          { id:'OS2', label:'Item G - 4,200 pcs (limit 3,000)', status:'Warning', to:'/configuration/item-profile' },
        ]} />
        <ListCard title={t('inventory.dash.lists.nearExpiryItems')} items={[
          { id:'NE1', label:'Item C - Expiry in 15 days', status:'Expiring', to:'/configuration/item-profile' },
          { id:'NE2', label:'Item H - Expiry in 22 days', status:'Expiring', to:'/configuration/item-profile' },
        ]} />
        <ListCard title={t('inventory.dash.lists.recentAdjustments')} items={[
          { id:'AD1', label:'Item D - Damaged - ৳ 3,000', status:'Adjusted', to:'/inventory/adjustment' },
          { id:'AD2', label:'Item I - Count Correction - ৳ 1,500', status:'Adjusted', to:'/inventory/adjustment' },
        ]} />
        <ListCard title={t('inventory.dash.lists.recentTransfers')} items={[
          { id:'TR1', label:'WH1 → WH2 - 200 pcs', status:'Transferred', to:'/inventory/transfer' },
          { id:'TR2', label:'WH2 → WH3 - 150 pcs', status:'Transferred', to:'/inventory/transfer' },
        ]} />
        <ListCard title={t('inventory.dash.lists.slowMovingItems')} items={[
          { id:'SM1', label:'Item E - No movement in 30 days', status:'Slow', to:'/configuration/item-profile' },
          { id:'SM2', label:'Item J - No movement in 25 days', status:'Slow', to:'/configuration/item-profile' },
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
      Critical: 'bg-red-100 text-red-700 border-red-200',
      Alert: 'bg-orange-100 text-orange-700 border-orange-200',
      Warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Expiring: 'bg-purple-100 text-purple-700 border-purple-200',
      Adjusted: 'bg-blue-100 text-blue-700 border-blue-200',
      Transferred: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Slow: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    return `inline-block px-2 py-0.5 text-[11px] rounded-md border ${m[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`
  }
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="card flex flex-col">
      <h2 className="text-xs font-semibold mb-3 flex items-center gap-2"><Activity size={14} className="text-gray-400" /> {title}</h2>
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
