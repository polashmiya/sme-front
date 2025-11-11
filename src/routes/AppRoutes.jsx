import { Routes, Route } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import PurchasePages from '../pages/purchase'
import SalesPages from '../pages/sales'
import AccountPages from '../pages/account'
import InventoryPages from '../pages/inventory'
import ConfigurationPages from '../pages/configuration'
import ApprovalPage from '../pages/ApprovalPage'
import SignInPage from '../pages/auth/SignInPage'
import SignUpPage from '../pages/auth/SignUpPage'
import Protected from './Protected'
import LayoutShell from '../layout/LayoutShell'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route element={<Protected />}> 
        <Route element={<LayoutShell />}>
          <Route path="/" element={<DashboardPage />} />
          {PurchasePages}
          {SalesPages}
          {AccountPages}
          {InventoryPages}
          {ConfigurationPages}
          <Route path="/approval" element={<ApprovalPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
