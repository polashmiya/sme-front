import { Route } from 'react-router-dom'
import AccountDashboardPage from './features/dashboard/AccountDashboardPage'
import ChartOfAccountsLanding from './features/chartOfAccounts/pages/Landing'
import AccountingJournalLanding from './features/journal/pages/Landing'
import FinancialReportLanding from './features/financialReport/pages/Landing'
import OtherReportLanding from './features/otherReport/pages/Landing'
import ExpenseAdvanceLanding from './features/ExpenseAndAdvance/pages/Landing'

const pages = [
  { key: 'account.dashboard', path: '/account/dashboard', component: <AccountDashboardPage /> },
  { key: 'account.coa', path: '/account/coa', component: <ChartOfAccountsLanding /> },
  { key: 'account.journal', path: '/account/journal', component: <AccountingJournalLanding /> },
  { key: 'account.expense', path: '/account/expense', component: <ExpenseAdvanceLanding /> },
  { key: 'account.financial', path: '/account/financial-report', component: <FinancialReportLanding /> },
  { key: 'account.other', path: '/account/other-report', component: <OtherReportLanding /> },
]

const AccountPages = pages.map(p => (
  <Route key={p.path} path={p.path} element={p.component} />
))

export default AccountPages
