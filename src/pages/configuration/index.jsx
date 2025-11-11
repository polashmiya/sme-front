import { Route } from 'react-router-dom'
import SectionScaffold from '../shared/SectionScaffold'

const pages = [
  { key: 'configuration.employee', path: '/configuration/employee' },
  { key: 'configuration.itemProfile', path: '/configuration/item-profile' },
  { key: 'configuration.customerProfile', path: '/configuration/customer-profile' },
  { key: 'configuration.supplierProfile', path: '/configuration/supplier-profile' },
  { key: 'configuration.offerSetup', path: '/configuration/offer-setup' },
  { key: 'configuration.customerPrice', path: '/configuration/customer-price' },
  { key: 'configuration.standardPrice', path: '/configuration/standard-price' },
]

const ConfigurationPages = pages.map(p => (
  <Route key={p.path} path={p.path} element={<SectionScaffold tKey={p.key} />} />
))

export default ConfigurationPages
