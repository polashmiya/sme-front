import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Trash2 } from "lucide-react";
import FormHeader from "../../../../../components/FormHeader";

const schema = yup
  .object({
    poNo: yup.string().required("PO No is required"),
    returnDate: yup.string().required("Return Date is required"),
    supplier: yup.string().required("Supplier is required"),
  })
  .required();

const DUMMY_ITEMS = [
  { id: 1, name: "Item A", rate: 100 },
  { id: 2, name: "Item B", rate: 250 },
  { id: 3, name: "Item C", rate: 500 },
];

export default function PurchaseReturnCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const [items, setItems] = useState([
    { itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate },
  ]);

  const handleAddLine = () => {
    setItems([...items, { itemId: DUMMY_ITEMS[0].id, qty: 1, rate: DUMMY_ITEMS[0].rate }]);
  };

  const handleRemoveLine = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    setItems((items) =>
      items.map((row, i) => {
        if (i !== idx) return row;
        if (field === "itemId") {
          const item = DUMMY_ITEMS.find((it) => it.id === Number(value));
          return { ...row, itemId: Number(value), rate: item ? item.rate : 0 };
        }
        if (field === "qty") return { ...row, qty: Math.max(1, Number(value)) };
        if (field === "rate") return { ...row, rate: Math.max(0, Number(value)) };
        return row;
      })
    );
  };

  const lineTotal = (row) => row.qty * row.rate;
  const grandTotal = items.reduce((sum, row) => sum + lineTotal(row), 0);

  const validateItems = () => {
    if (items.length === 0) return "At least one item is required.";
    const seen = new Set();
    for (const row of items) {
      if (!row.itemId) return "All item rows must have an item.";
      if (seen.has(row.itemId)) return "Duplicate items are not allowed.";
      seen.add(row.itemId);
      if (!row.qty || row.qty < 1) return "All item rows must have quantity.";
      if (Number(row.rate) < 0) return "Rate cannot be negative.";
    }
    return null;
  };

  const onSubmit = (data) => {
    const itemError = validateItems();
    if (itemError) {
      alert(itemError);
      return;
    }
    alert(
      "Submitted: " + JSON.stringify({ ...data, items, grandTotal }, null, 2)
    );
    reset();
    setItems([{ itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate }]);
  };

  return (
    <div className="flex flex-col">
      <FormHeader title="Create Purchase Return" right={null} />
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <label htmlFor="poNo" className="font-medium mb-1">PO No</label>
            <input id="poNo" type="text" {...register("poNo")} className="border border-gray-300 rounded px-2 py-1" />
            {errors.poNo && <span className="text-red-600 text-xs mt-1">{errors.poNo.message}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="supplier" className="font-medium mb-1">Supplier</label>
            <select id="supplier" {...register("supplier")} className="border border-gray-300 rounded px-2 py-1">
              <option value="">Select supplier</option>
              <option>Supplier A</option>
              <option>Supplier B</option>
              <option>Supplier C</option>
            </select>
            {errors.supplier && <span className="text-red-600 text-xs mt-1">{errors.supplier.message}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="returnDate" className="font-medium mb-1">Return Date</label>
            <input id="returnDate" type="date" {...register("returnDate")} className="border border-gray-300 rounded px-2 py-1" />
            {errors.returnDate && <span className="text-red-600 text-xs mt-1">{errors.returnDate.message}</span>}
          </div>
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Items</h3>
            <button type="button" className="btn-outline text-xs" onClick={handleAddLine}>+ Add Line</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-base border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th style={{textAlign:'left'}} className="px-3 py-2 border border-gray-300">Item</th>
                  <th style={{textAlign:'right'}} className="px-3 py-2 border border-gray-300">Qty</th>
                  <th style={{textAlign:'right'}} className="px-3 py-2 border border-gray-300">Rate</th>
                  <th style={{textAlign:'right'}} className="px-3 py-2 border border-gray-300">Total</th>
                  <th style={{textAlign:'center'}} className="px-3 py-2 border border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 border border-gray-200">
                      <select value={row.itemId} onChange={(e) => handleItemChange(idx, "itemId", e.target.value)} className="border border-gray-300 rounded px-2 py-1">
                        {DUMMY_ITEMS.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      <input type="number" min="1" value={row.qty} onChange={(e) => handleItemChange(idx, "qty", e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-right" />
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      <input type="number" min="0" value={row.rate} onChange={(e) => handleItemChange(idx, "rate", e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-20 text-right" />
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">{lineTotal(row)}</td>
                    <td className="px-3 py-2 border border-gray-200 text-center">
                      <button type="button" className="text-red-600 p-1" onClick={() => handleRemoveLine(idx)} disabled={items.length === 1} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-semibold px-3 py-2">Grand Total</td>
                  <td className="text-right font-semibold px-3 py-2">{grandTotal}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" className="btn-outline" onClick={() => { reset(); setItems([{ itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate }]); }}>Cancel</button>
          <button type="submit" className="btn-primary">Save Return</button>
        </div>
      </form>
    </div>
  );
}
