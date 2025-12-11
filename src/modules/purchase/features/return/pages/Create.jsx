import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Trash2 } from "lucide-react";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";

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
    <CommonCreateLayout
      title="Create Purchase Return"
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => { reset(); setItems([{ itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate }]); }}
      submitLabel="Save Return"
      itemsTitle="Items"
      onAddLine={handleAddLine}
      itemsColumns={[
        { key: 'item', title: 'Item', className: 'text-left px-3 py-2', dataIndex: 'itemId', render: (value, row) => (
          <select value={row.itemId} onChange={(e) => handleItemChange(row._idx, 'itemId', e.target.value)} className="border border-gray-300 rounded px-2 py-1">
            {DUMMY_ITEMS.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        ) },
        { key: 'qty', title: 'Qty', className: 'text-right px-3 py-2', dataIndex: 'qty', render: (value, row) => (
          <input type="number" min="1" value={row.qty} onChange={(e) => handleItemChange(row._idx, 'qty', e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-right" />
        ) },
        { key: 'rate', title: 'Rate', className: 'text-right px-3 py-2', dataIndex: 'rate', render: (value, row) => (
          <input type="number" min="0" value={row.rate} onChange={(e) => handleItemChange(row._idx, 'rate', e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-20 text-right" />
        ) },
        { key: 'total', title: 'Total', className: 'text-right px-3 py-2', dataIndex: 'total', render: (_, row) => lineTotal(row) },
        { key: 'action', title: 'Action', className: 'text-center px-3 py-2', dataIndex: 'action', render: (_, row) => (
          <button type="button" className="text-red-600 p-1" onClick={() => handleRemoveLine(row._idx)} disabled={items.length === 1} title="Delete">
            <Trash2 size={16} />
          </button>
        ) },
      ]}
      itemsData={items.map((r, idx) => ({ ...r, _idx: idx }))}
      itemsFooter={
        <div className="flex justify-end mt-2 text-sm">
          <div className="font-semibold">Grand Total:&nbsp;{grandTotal}</div>
        </div>
      }
    >
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
    </CommonCreateLayout>
  );
}
