
import { useState, useMemo } from 'react'
import PurchaseHeader from '../components/PurchaseHeader'
import { Link } from 'react-router-dom'
import { Search, Plus, Eye, Pencil, Printer, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Dummy Data
const STATUSES = ['Draft','Approved','Partially Received','Completed']
const SUPPLIERS = ['Supplier A','Supplier B','Supplier C','Supplier D']
const rows = Array.from({ length: 57 }).map((_,i)=> ({
  id: i+1,
  poNo: 'PO-'+String(1000+i),
  supplier: SUPPLIERS[i % SUPPLIERS.length],
  poDate: new Date(2025, 0, (i%28)+1),
  expectedDate: new Date(2025, 1, (i%28)+1),
  totalAmount: Math.floor(Math.random()*40000)+5000,
  status: STATUSES[i % STATUSES.length],
  createdBy: 'User '+ ((i%5)+1),
  createdDate: new Date(2025, 0, (i%28)+1, 10, (i%55)),
}))

export default function PurchaseOrderLanding() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [supplier, setSupplier] = useState('')
  const [status, setStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(()=>{
    return rows.filter(r => {
      if (search && !r.poNo.toLowerCase().includes(search.toLowerCase()) && !r.supplier.toLowerCase().includes(search.toLowerCase())) return false
      if (supplier && r.supplier !== supplier) return false
      if (status && r.status !== status) return false
      if (fromDate && r.poDate < new Date(fromDate)) return false
      if (toDate && r.poDate > new Date(toDate)) return false
      return true
    })
  },[search,supplier,status,fromDate,toDate])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const pageRows = filtered.slice((page-1)*pageSize, page*pageSize)

  return (
    <div className="flex flex-col">
      <PurchaseHeader
        title={t('purchase.order')}
        right={<RightHeader search={search} setSearch={setSearch} t={t} />}
      />

      {/* Filters */}
      <div className="card mb-4">
        <div className="grid md:grid-cols-5 gap-4 text-sm">
          <div className="flex flex-col">
            <label htmlFor="supplier" className="font-medium mb-1">{t('purchase.dash.filters.supplier')}</label>
            <select id="supplier" value={supplier} onChange={e=>{setSupplier(e.target.value); setPage(1)}} className="border border-gray-300 rounded px-2 py-1">
              <option value="">{t('common.all', 'All')}</option>
              {SUPPLIERS.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="status" className="font-medium mb-1">{t('common.status', 'Status')}</label>
            <select id="status" value={status} onChange={e=>{setStatus(e.target.value); setPage(1)}} className="border border-gray-300 rounded px-2 py-1">
              <option value="">{t('common.all', 'All')}</option>
              {STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="fromDate" className="font-medium mb-1">{t('purchase.dash.filters.dateRange', 'From Date')}</label>
            <input id="fromDate" type="date" value={fromDate} onChange={e=>{setFromDate(e.target.value); setPage(1)}} className="border border-gray-300 rounded px-2 py-1" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="toDate" className="font-medium mb-1">{t('purchase.dash.filters.dateRange', 'To Date')}</label>
            <input id="toDate" type="date" value={toDate} onChange={e=>{setToDate(e.target.value); setPage(1)}} className="border border-gray-300 rounded px-2 py-1" />
          </div>
          <div className="flex flex-col justify-end">
            <button onClick={()=>{setSearch('');setSupplier('');setStatus('');setFromDate('');setToDate('');setPage(1)}} className="btn-outline text-xs">{t('common.reset', 'Reset Filters')}</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-base w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-xs uppercase text-gray-600">
              <Th>{t('purchase.order', 'PO No')}</Th>
              <Th>{t('purchase.dash.filters.supplier', 'Supplier Name')}</Th>
              <Th>{t('purchase.dash.filters.dateRange', 'PO Date')}</Th>
              <Th>{t('purchase.dash.filters.dateRange', 'Expected Delivery Date')}</Th>
              <Th style={{textAlign:"right"}}>{t('purchase.dash.kpis.totalAmount', 'Total Amount')}</Th>
              <Th>{t('common.status', 'Status')}</Th>
              <Th>{t('common.createdBy', 'Created By')}</Th>
              <Th>{t('common.createdDate', 'Created Date')}</Th>
              <Th style={{textAlign:"center"}}>{t('common.actions', 'Actions')}</Th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pageRows.map(r => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <Td>{r.poNo}</Td>
                <Td>{r.supplier}</Td>
                <Td>{formatDate(r.poDate)}</Td>
                <Td>{formatDate(r.expectedDate)}</Td>
                <Td className="text-right">৳ {r.totalAmount.toLocaleString()}</Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td>{r.createdBy}</Td>
                <Td>{formatDateTime(r.createdDate)}</Td>
                <Td style={{textAlign:"center"}}>
                  <div className="flex gap-2 justify-center">
                    <Link to={`/purchase/order/${r.poNo}`} className="icon-btn" title={t('common.view', 'View')}><Eye size={16} /></Link>
                    <Link to={`/purchase/order/${r.poNo}/edit`} className="icon-btn" title={t('common.edit', 'Edit')}><Pencil size={16} /></Link>
                    <button className="icon-btn" title={t('common.print', 'Print')}><Printer size={16} /></button>
                    <button className="icon-btn text-red-600" title={t('common.delete', 'Delete')}><Trash2 size={16} /></button>
                  </div>
                </Td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <Td colSpan={9} className="text-center py-10 text-gray-500">{t('purchase.dash.lists.recentPOs', 'No purchase orders found.')}</Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-gray-600">{t('common.showing', 'Showing')} {(page-1)*pageSize + 1} - {Math.min(page*pageSize, filtered.length)} {t('common.of', 'of')} {filtered.length}</span>
        <div className="flex items-center gap-2">
          <button disabled={page===1} onClick={()=> setPage(p=> p-1)} className="btn-outline px-2 py-1 disabled:opacity-40">{t('common.prev', 'Prev')}</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page===totalPages} onClick={()=> setPage(p=> p+1)} className="btn-outline px-2 py-1 disabled:opacity-40">{t('common.next', 'Next')}</button>
        </div>
      </div>
    </div>
  )
}

function RightHeader({ search, setSearch, t }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
        <input value={search} onChange={e=>{setSearch(e.target.value)}} placeholder={t('common.search', 'Search PO or Supplier')} className="pl-7 pr-2 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-56" />
      </div>
      <Link to="/purchase/order/create" className="btn-primary flex items-center gap-1 text-sm"><Plus size={14} /> {t('purchase.dash.actions.createPO', 'Create New Purchase Order')}</Link>
    </div>
  )
}

function Th({ children ,style}) { return <th  style={style} className="text-left px-3 py-2 font-medium border border-gray-300">{children}</th> }
function Td({ children,style }) { return <td style={style} className="px-3 py-2 border border-gray-200">{children}</td> }

function formatDate(d) { return d.toISOString().split('T')[0] }
function formatDateTime(d) { return d.toISOString().replace('T',' ').slice(0,16) }

function StatusBadge({ status }) {
  const colors = {
    Draft: 'bg-gray-100 text-gray-700 border-gray-200',
    Approved: 'bg-blue-100 text-blue-700 border-blue-200',
    'Partially Received': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Completed: 'bg-green-100 text-green-700 border-green-200',
  }
  return <span className={`text-[11px] px-2 py-1 rounded-md border ${colors[status]}`}>{status}</span>
}
