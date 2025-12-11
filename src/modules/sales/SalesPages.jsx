import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import SalesDashboardPage from './features/dashboard/SalesDashboardPage'
import SalesOrderLanding from './features/order/pages/Landing'
import SalesOrderCreate from './features/order/pages/Create'
import SalesDeliveryLanding from './features/delivery/pages/Landing'
import SalesCollectionLanding from './features/collection/pages/Landing'
import SalesReturnLanding from './features/return/pages/Landing'
import SalesReportLanding from './features/report/pages/Landing'

const SalesPages = [
  <Route key="/sales/dashboard" path="/sales/dashboard" element={<SalesDashboardPage />} />,
  <Route key="/sales/order" path="/sales/order" element={<SalesOrderLanding />} />,
  <Route key="/sales/order/create" path="/sales/order/create" element={<SalesOrderCreate />} />,
  <Route key="/sales/delivery" path="/sales/delivery" element={<SalesDeliveryLanding />} />,
  <Route key="/sales/collection" path="/sales/collection" element={<SalesCollectionLanding />} />,
  <Route key="/sales/return" path="/sales/return" element={<SalesReturnLanding />} />,
  <Route key="/sales/report" path="/sales/report" element={<SalesReportLanding />} />,
]

export default SalesPages
