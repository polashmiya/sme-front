import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Trash2 } from "lucide-react";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import { Fields } from "../../../../../common/components/FieldRenderer";


const schema = yup
  .object({
    supplier: yup.string().required("Supplier is required"),
    poDate: yup.string().required("PO Date is required"),
    expectedDate: yup.string().required("Expected Delivery Date is required"),
  })
  .required();

// Dummy item data
const DUMMY_ITEMS = [
  { id: 1, name: "Item A", rate: 100 },
  { id: 2, name: "Item B", rate: 250 },
  { id: 3, name: "Item C", rate: 500 },
];

export default function PurchaseOrderCreate() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      supplier: "",
      poDate: "",
      expectedDate: "",
    },
  });
  // Items state: [{itemId, qty, rate}]
  const [items, setItems] = useState([
    { itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate },
  ]);

  // Add new item row
  const handleAddLine = () => {
    setItems([
      ...items,
      { itemId: DUMMY_ITEMS[0].id, qty: 1, rate: DUMMY_ITEMS[0].rate },
    ]);
  };

  // Remove item row
  const handleRemoveLine = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Update item row
  const handleItemChange = (idx, field, value) => {
    setItems((items) =>
      items.map((row, i) => {
        if (i !== idx) return row;
        if (field === "itemId") {
          const item = DUMMY_ITEMS.find((it) => it.id === Number(value));
          return { ...row, itemId: Number(value), rate: item ? item.rate : 0 };
        }
        if (field === "qty") {
          return { ...row, qty: Math.max(1, Number(value)) };
        }
        if (field === "rate") {
          return { ...row, rate: Math.max(0, Number(value)) };
        }
        return row;
      })
    );
  };

  // Calculate totals
  const lineTotal = (row) => row.qty * row.rate;
  const grandTotal = items.reduce((sum, row) => sum + lineTotal(row), 0);

  // Validate items before submit
  const validateItems = () => {
    if (items.length === 0) return "At least one item is required.";
    const seen = new Set();
    for (const row of items) {
      if (!row.itemId) return "All item rows must have an item.";
      if (seen.has(row.itemId)) return "Duplicate items are not allowed.";
      seen.add(row.itemId);
      if (!row.qty || row.qty < 1) return "All item rows must have quantity.";
      if (
        row.rate === undefined ||
        row.rate === null ||
        row.rate === "" ||
        Number(row.rate) < 0
      )
        return "All item rows must have valid rate.";
    }
    return null;
  };

  const onSubmit = (data) => {
    const itemError = validateItems();
    if (itemError) {
      alert(itemError);
      return;
    }
    // Simulate submission; integrate API later
    alert(
      "Submitted: " + JSON.stringify({ ...data, items, grandTotal }, null, 2)
    );
    reset();
    setItems([{ itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate }]);
  };

  return (
    <CommonCreateLayout
      title="Create Purchase Order"
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => {
        reset();
        setItems([{ itemId: 1, qty: 1, rate: DUMMY_ITEMS[0].rate }]);
      }}
      submitLabel="Save PO"
      itemsTitle="Items"
      onAddLine={handleAddLine}
      itemsColumns={[
        {
          key: "item",
          title: "Item",
          className: "text-left px-3 py-2",
          dataIndex: "itemId",
          render: (value, row) => {
            const options = DUMMY_ITEMS.map((it) => ({ value: it.id, label: it.name }));
            const selected = options.find((opt) => opt.value === row.itemId) || null;
            return (
              <Dropdown
                options={options}
                value={selected}
                onChange={(opt) => handleItemChange(row._idx, "itemId", opt.value)}
                className="min-w-[140px]"
                searchable={true}
              />
            );
          },
        },
        {
          key: "qty",
          title: "Qty",
          className: "text-right px-3 py-2",
          dataIndex: "qty",
          render: (value, row) => (
            <input
              type="number"
              min="1"
              value={row.qty}
              onChange={(e) => handleItemChange(row._idx, "qty", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-20 text-right text-sm"
            />
          ),
        },
        {
          key: "rate",
          title: "Rate",
          className: "text-right px-3 py-2",
          dataIndex: "rate",
          render: (value, row) => (
            <input
              type="number"
              min="0"
              value={row.rate}
              onChange={(e) => handleItemChange(row._idx, "rate", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-24 text-right text-sm"
            />
          ),
        },
        {
          key: "total",
          title: "Total",
          className: "text-right px-3 py-2",
          dataIndex: "total",
          render: (_, row) => (
            <span className="text-sm font-medium">{lineTotal(row)}</span>
          ),
        },
        {
          key: "action",
          title: "Action",
          className: "text-center px-3 py-2",
          dataIndex: "action",
          render: (_, row) => (
            <button
              type="button"
              className="text-red-600 p-1"
              onClick={() => handleRemoveLine(row._idx)}
              disabled={items.length === 1}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          ),
        },
      ]}
      itemsData={items.map((r, idx) => ({ ...r, _idx: idx }))}
      itemsFooter={
        <div className="flex justify-end mt-2 text-sm">
          <div className="font-semibold">Grand Total:&nbsp;{grandTotal}</div>
        </div>
      }
    >
      {(() => {
        const fields = [
          {
            ddl: {
              name: "supplier",
              label: "Supplier",
              options: ["Supplier A", "Supplier B", "Supplier C"].map((s) => ({ label: s, value: s })),
              placeholder: "Select supplier",
            },
          },
          { input: { name: "poDate", label: "PO Date", type: "date" } },
          { input: { name: "expectedDate", label: "Expected Delivery", type: "date" } },
        ];
        return <Fields fields={fields} commonProps={{ control }} parentDivClassName="grid md:grid-cols-3 gap-4 text-sm" />;
      })()}
    </CommonCreateLayout>
  );
}
