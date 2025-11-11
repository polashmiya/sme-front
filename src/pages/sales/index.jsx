import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import SalesDashboardPage from './SalesDashboardPage'

const pages = [
  { key: 'sales.dashboard', path: '/sales/dashboard' },
  { key: 'sales.order', path: '/sales/order' },
  { key: 'sales.delivery', path: '/sales/delivery' },
  { key: 'sales.return', path: '/sales/return' },
  { key: 'sales.collection', path: '/sales/collection' },
  { key: 'sales.report', path: '/sales/report', report: true },
]

const SalesPages = pages.map(p => (
  <Route
    key={p.path}
    path={p.path}
    element={p.key === 'sales.dashboard' ? <SalesDashboardPage /> : <SectionScaffold tKey={p.key} report={p.report} />}
  />
))

export default SalesPages
