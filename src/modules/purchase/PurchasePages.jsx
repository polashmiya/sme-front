import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import PurchaseDashboardPage from './features/dashboard/PurchaseDashboardPage'
import PurchaseOrderLanding from './features/order/pages/Landing'
import PurchaseOrderForm from './features/order/pages/Create'
import PurchaseOrderView from './features/order/pages/View'
import PurchaseOrderEdit from './features/order/pages/Edit'
import PurchaseReceiveLanding from './features/receive/pages/Landing'
import PurchaseReceiveForm from './features/receive/pages/Create'
import PurchaseReceiveView from './features/receive/pages/View'
import PurchaseReceiveEdit from './features/receive/pages/Edit'
import PurchaseReturnLanding from './features/return/pages/Landing'
import PurchaseReturnForm from './features/return/pages/Create'
import PurchaseReturnView from './features/return/pages/View'
import PurchaseReturnEdit from './features/return/pages/Edit'
import PurchasePaymentLanding from './features/payment/pages/Landing'
import PurchasePaymentForm from './features/payment/pages/Create'
import PurchasePaymentView from './features/payment/pages/View'
import PurchasePaymentEdit from './features/payment/pages/Edit'
import PurchaseReportsLanding from './features/reports/pages/Landing'

const pages = [
  { key: 'purchase.dashboard', path: '/purchase/dashboard', component: <PurchaseDashboardPage /> },
  { key: 'purchase.order', path: '/purchase/order', component: <PurchaseOrderLanding /> },
  { key: 'purchase.order.create', path: '/purchase/order/create',   component: <PurchaseOrderForm /> },
  { key: 'purchase.order.edit',   path: '/purchase/order/edit/:id', component: <PurchaseOrderEdit /> },
  { key: 'purchase.order.view',   path: '/purchase/order/:id',      component: <PurchaseOrderView /> },
  { key: 'purchase.receive',        path: '/purchase/receive',           component: <PurchaseReceiveLanding /> },
  { key: 'purchase.receive.create', path: '/purchase/receive/create',   component: <PurchaseReceiveForm /> },
  { key: 'purchase.receive.edit',   path: '/purchase/receive/edit/:id', component: <PurchaseReceiveEdit /> },
  { key: 'purchase.receive.view',   path: '/purchase/receive/:id',      component: <PurchaseReceiveView /> },
  { key: 'purchase.return',        path: '/purchase/return',           component: <PurchaseReturnLanding /> },
  { key: 'purchase.return.create', path: '/purchase/return/create',   component: <PurchaseReturnForm /> },
  { key: 'purchase.return.edit',   path: '/purchase/return/edit/:id', component: <PurchaseReturnEdit /> },
  { key: 'purchase.return.view',   path: '/purchase/return/:id',      component: <PurchaseReturnView /> },
  { key: 'purchase.payment',        path: '/purchase/payment',           component: <PurchasePaymentLanding /> },
  { key: 'purchase.payment.create', path: '/purchase/payment/create',   component: <PurchasePaymentForm /> },
  { key: 'purchase.payment.edit',   path: '/purchase/payment/edit/:id', component: <PurchasePaymentEdit /> },
  { key: 'purchase.payment.view',   path: '/purchase/payment/:id',      component: <PurchasePaymentView /> },
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
