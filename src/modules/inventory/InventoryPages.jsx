import { Route } from 'react-router-dom'
import InventoryDashboardPage from './features/dashboard/InventoryDashboardPage'
import StockAdjustmentLanding from './features/stockAdjustment/pages/Landing'
import InventoryReportsLanding from './features/reports/pages/Landing'

const pages = [
	{ key: 'inventory.dashboard', path: '/inventory/dashboard', component: <InventoryDashboardPage /> },
	{ key: 'inventory.adjustment', path: '/inventory/adjustment', component: <StockAdjustmentLanding /> },
	{ key: 'inventory.reports', path: '/inventory/reports', component: <InventoryReportsLanding /> },
]

const InventoryPages = pages.map(p => (
	<Route key={p.path} path={p.path} element={p.component} />
))

export default InventoryPages

