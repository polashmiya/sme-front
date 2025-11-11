import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'

export default function ApprovalPage() {
  const { t } = useTranslation()
  const items = [
    { id: 1, type: 'Purchase Order', by: 'Shanto', date: '2025-11-10' },
    { id: 2, type: 'Sales Return', by: 'Rafi', date: '2025-11-09' },
  ]
  return (
    <div>
      <h1 className="page-title"><CheckCircle size={20} /> {t('menu.approval')}</h1>
      <div className="card">
        <table className="table-base">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Requested By</th>
              <th>Date</th>
              <th className="text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.type}</td>
                <td>{r.by}</td>
                <td>{r.date}</td>
                <td className="text-right">
                  <button className="btn-primary">Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
