import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import PurchaseDashboardPage from './features/dashboard/PurchaseDashboardPage'
import PurchaseOrderLanding from './features/order/pages/Landing'
import PurchaseOrderForm from './features/order/pages/Create'
import PurchaseReceiveLanding from './features/receive/pages/Landing'
import PurchaseReceiveForm from './features/receive/pages/Create'
import PurchaseReturnLanding from './features/return/pages/Landing'
import PurchaseReturnForm from './features/return/pages/Create'
import PurchasePaymentLanding from './features/payment/pages/Landing'
import PurchasePaymentForm from './features/payment/pages/Create'
import PurchaseReportsLanding from './features/reports/pages/Landing'

const pages = [
  { key: 'purchase.dashboard', path: '/purchase/dashboard', component: <PurchaseDashboardPage /> },
  { key: 'purchase.order', path: '/purchase/order', component: <PurchaseOrderLanding /> },
  { key: 'purchase.order.create', path: '/purchase/order/create', component: <PurchaseOrderForm /> },
  { key: 'purchase.receive', path: '/purchase/receive', component: <PurchaseReceiveLanding /> },
  { key: 'purchase.receive.create', path: '/purchase/receive/create', component: <PurchaseReceiveForm /> },
  { key: 'purchase.return', path: '/purchase/return', component: <PurchaseReturnLanding /> },
  { key: 'purchase.return.create', path: '/purchase/return/create', component: <PurchaseReturnForm /> },
  { key: 'purchase.payment', path: '/purchase/payment', component: <PurchasePaymentLanding /> },
  { key: 'purchase.payment.create', path: '/purchase/payment/create', component: <PurchasePaymentForm /> },
  { key: 'purchase.report', path: '/purchase/report', component: <PurchaseReportsLanding />, report: true },
]

const PurchasePages = pages.map(p => (
  <Route
    key={p.path}
    path={p.path}
    element={p.component ? p.component : <SectionScaffold tKey={p.key} report={p.report} />}
  />
))

export default PurchasePages
