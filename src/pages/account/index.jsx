import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'
import AccountDashboardPage from './AccountDashboardPage'

const pages = [
  { key: 'account.dashboard', path: '/account/dashboard', component: <AccountDashboardPage /> },
  { key: 'account.coa', path: '/account/coa' },
  { key: 'account.journal', path: '/account/journal' },
  { key: 'account.expense', path: '/account/expense' },
  { key: 'account.financial', path: '/account/financial-report', report: true },
  { key: 'account.other', path: '/account/other-report', report: true },
]

const AccountPages = pages.map(p => (
  <Route
    key={p.path}
    path={p.path}
    element={p.component ? p.component : <SectionScaffold tKey={p.key} report={p.report} />}
  />
))

export default AccountPages
