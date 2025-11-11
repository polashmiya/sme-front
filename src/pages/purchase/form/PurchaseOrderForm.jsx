import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PurchaseHeader from '../components/PurchaseHeader'

const schema = yup.object({
  supplier: yup.string().required('Supplier is required'),
  poDate: yup.string().required('PO Date is required'),
  expectedDate: yup.string().required('Expected Delivery Date is required'),
}).required()

export default function PurchaseOrderForm() {
  const { register, handleSubmit, formState:{ errors } } = useForm({ resolver: yupResolver(schema) })
  const onSubmit = (data) => {
    // Simulate submission; integrate API later
    alert('Submitted: '+ JSON.stringify(data, null, 2))
  }

  return (
    <div className="flex flex-col">
      <PurchaseHeader title="Create Purchase Order" right={null} />

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <label htmlFor="supplier" className="font-medium mb-1">Supplier</label>
            <select id="supplier" {...register('supplier')} className="border border-gray-300 rounded px-2 py-1">
              <option value="">Select supplier</option>
              <option>Supplier A</option>
              <option>Supplier B</option>
              <option>Supplier C</option>
            </select>
            {errors.supplier && <span className="text-red-600 text-xs mt-1">{errors.supplier.message}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="poDate" className="font-medium mb-1">PO Date</label>
            <input id="poDate" type="date" {...register('poDate')} className="border border-gray-300 rounded px-2 py-1" />
            {errors.poDate && <span className="text-red-600 text-xs mt-1">{errors.poDate.message}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="expectedDate" className="font-medium mb-1">Expected Delivery</label>
            <input id="expectedDate" type="date" {...register('expectedDate')} className="border border-gray-300 rounded px-2 py-1" />
            {errors.expectedDate && <span className="text-red-600 text-xs mt-1">{errors.expectedDate.message}</span>}
          </div>
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Items</h3>
            <button type="button" className="btn-outline text-xs">+ Add Line</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-base border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th className="text-left px-3 py-2 border border-gray-300">Item</th>
                  <th className="text-right px-3 py-2 border border-gray-300">Qty</th>
                  <th className="text-right px-3 py-2 border border-gray-300">Rate</th>
                  <th className="text-right px-3 py-2 border border-gray-300">Total</th>
                  <th className="px-3 py-2 border border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="px-3 py-2 border border-gray-200">Sample Item</td>
                  <td className="px-3 py-2 border border-gray-200 text-right">2</td>
                  <td className="px-3 py-2 border border-gray-200 text-right">500</td>
                  <td className="px-3 py-2 border border-gray-200 text-right">1000</td>
                  <td className="px-3 py-2 border border-gray-200 text-center"><button type="button" className="text-red-600 text-xs">Remove</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary">Save PO</button>
        </div>
      </form>
    </div>
  )
}
