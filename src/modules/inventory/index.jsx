import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import InventoryDashboardPage from './InventoryDashboardPage'

const pages = [
  { key: 'inventory.dashboard', path: '/inventory/dashboard', component: <InventoryDashboardPage /> },
  { key: 'inventory.adjustment', path: '/inventory/adjustment' },
  { key: 'inventory.reports', path: '/inventory/reports', report: true },
]

const InventoryPages = pages.map(p => (
  <Route
    key={p.path}
    path={p.path}
    element={p.component ? p.component : <SectionScaffold tKey={p.key} report={p.report} />}
  />
))

export default InventoryPages
