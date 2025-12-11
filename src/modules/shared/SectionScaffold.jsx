import { useTranslation } from 'react-i18next'
import Table from '../../common/components/Table'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

export default function SectionScaffold({ tKey, report }) {
  const { t } = useTranslation()
  const componentRef = useRef()
  const handlePrint = useReactToPrint({ content: () => componentRef.current })

  const columns = [
    { key: 'sl', title: '#', dataIndex: 'sl', className: 'w-12' },
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'amount', title: 'Amount', dataIndex: 'amount', className: 'text-right' },
  ]
  const data = Array.from({ length: 8 }).map((_, i) => ({ sl: i + 1, name: `Item ${i + 1}`, amount: (Math.random() * 1000).toFixed(2) }))

  return (
    <div>
      <h1 className="page-title">{t(tKey)}</h1>
      <div className="card" ref={componentRef}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">{t(tKey)} List</h2>
          {report && (
            <div className="flex items-center gap-2">
              <button className="btn-outline" onClick={handlePrint}>{t('common.print')}</button>
            </div>
          )}
        </div>
        <Table columns={columns} data={data} />
      </div>
    </div>
  )
}
