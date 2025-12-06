import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Trash2 } from "lucide-react";
import CommonCreateLayout from "../../../../../components/CommonCreateLayout";

const schema = yup
  .object({
    poNo: yup.string().required("PO No is required"),
    receiveDate: yup.string().required("Receive Date is required"),
    supplier: yup.string().required("Supplier is required"),
  })
  .required();

const DUMMY_ITEMS = [
  { id: 1, name: "Item A", poQty: 10 },
  { id: 2, name: "Item B", poQty: 5 },
  { id: 3, name: "Item C", poQty: 20 },
];

export default function PurchaseReceiveCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const [items, setItems] = useState([
    { itemId: 1, receiveQty: 1 },
  ]);

  const handleAddLine = () => {
    setItems([...items, { itemId: DUMMY_ITEMS[0].id, receiveQty: 1 }]);
  };

  const handleRemoveLine = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    setItems((items) =>
      items.map((row, i) => {
        if (i !== idx) return row;
        if (field === "itemId") return { ...row, itemId: Number(value) };
        if (field === "receiveQty") return { ...row, receiveQty: Math.max(0, Number(value)) };
        return row;
      })
    );
  };

  const validateItems = () => {
    if (items.length === 0) return "At least one item is required.";
    for (const row of items) {
      if (!row.itemId) return "All item rows must have an item.";
      if (row.receiveQty < 0) return "Receive qty cannot be negative.";
    }
    return null;
  };

  const totalReceived = items.reduce((sum, r) => sum + (r.receiveQty || 0), 0);

  const onSubmit = (data) => {
    const itemError = validateItems();
    if (itemError) {
      alert(itemError);
      return;
    }
    alert(
      "Submitted: " + JSON.stringify({ ...data, items, totalReceived }, null, 2)
    );
    reset();
    setItems([{ itemId: 1, receiveQty: 1 }]);
  };

  return (
    <CommonCreateLayout
      title="Create Goods Receive"
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => { reset(); setItems([{ itemId: 1, receiveQty: 1 }]); }}
      submitLabel="Save Receive"
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
        { key: 'poQty', title: 'PO Qty', className: 'text-right px-3 py-2', dataIndex: 'poQty', render: (_, row) => {
          const item = DUMMY_ITEMS.find(it => it.id === row.itemId) || { poQty: 0 };
          return item.poQty;
        } },
        { key: 'receiveQty', title: 'Receive Qty', className: 'text-right px-3 py-2', dataIndex: 'receiveQty', render: (value, row) => (
          <input type="number" min="0" value={row.receiveQty} onChange={(e) => handleItemChange(row._idx, 'receiveQty', e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-20 text-right" />
        ) },
        { key: 'action', title: 'Action', className: 'text-center px-3 py-2', dataIndex: 'action', render: (_, row) => (
          <button type="button" className="text-red-600 p-1" onClick={() => handleRemoveLine(row._idx)} disabled={items.length === 1} title="Delete">
            <Trash2 size={16} />
          </button>
        ) },
      ]}
      itemsData={items.map((r, idx) => ({ ...r, _idx: idx }))}
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
          <label htmlFor="receiveDate" className="font-medium mb-1">Receive Date</label>
          <input id="receiveDate" type="date" {...register("receiveDate")} className="border border-gray-300 rounded px-2 py-1" />
          {errors.receiveDate && <span className="text-red-600 text-xs mt-1">{errors.receiveDate.message}</span>}
        </div>
      </div>
    </CommonCreateLayout>
  );
}
