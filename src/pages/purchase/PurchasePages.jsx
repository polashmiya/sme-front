import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import PurchaseDashboardPage from './PurchaseDashboardPage'
import PurchaseOrderLanding from './landing/PurchaseOrderLanding'
import PurchaseOrderForm from './form/PurchaseOrderForm'

const pages = [
  { key: 'purchase.dashboard', path: '/purchase/dashboard', component: <PurchaseDashboardPage /> },
  { key: 'purchase.order', path: '/purchase/order', component: <PurchaseOrderLanding /> },
  { key: 'purchase.order.create', path: '/purchase/order/create', component: <PurchaseOrderForm /> },
  { key: 'purchase.receive', path: '/purchase/receive' },
  { key: 'purchase.return', path: '/purchase/return' },
  { key: 'purchase.payment', path: '/purchase/payment' },
  { key: 'purchase.report', path: '/purchase/report', report: true },
]

const PurchasePages = pages.map(p => (
  <Route
    key={p.path}
    path={p.path}
    element={p.component ? p.component : <SectionScaffold tKey={p.key} report={p.report} />}
  />
))

export default PurchasePages
