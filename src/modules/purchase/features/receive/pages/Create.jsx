import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, Package, Building2,
  FileText, ClipboardList, Save, X, AlertCircle,
  CheckCircle2, Truck, ShoppingCart, Calculator,
} from "lucide-react";
import FormInput from "../../../../../common/ant/FormInput";
import FormDropdown from "../../../../../common/ant/FormDropdown";

// ─── Static Reference Data ────────────────────────────────────────────────────
const SUPPLIERS = [
  { label: "Alpha Tech Supplies",      value: "1", contact: "Md. Rafiqul Islam", phone: "+880-1700-000001", email: "procurement@alphatech.com.bd" },
  { label: "Beta Trading Co. Ltd.",    value: "2", contact: "Fatema Begum",       phone: "+880-1800-000002", email: "order@betatrading.com"          },
  { label: "Gamma Electronics Ltd.",   value: "3", contact: "Karim Ahmed",        phone: "+880-1911-000003", email: "sales@gammaelec.com"             },
  { label: "Delta Logistics Inc.",     value: "4", contact: "Nasrin Akhter",      phone: "+880-1750-000004", email: "supply@deltalogistics.net"       },
  { label: "Epsilon Office Solutions", value: "5", contact: "Jahanara Sultana",   phone: "+880-1830-000005", email: "info@epsilonoffice.com"          },
];

const WAREHOUSES = [
  { label: "Main Warehouse – Dhaka (WH-01)",           value: "wh-01" },
  { label: "Secondary Warehouse – Chittagong (WH-02)", value: "wh-02" },
  { label: "Distribution Center – Gazipur (WH-03)",   value: "wh-03" },
  { label: "Regional Depot – Sylhet (WH-04)",          value: "wh-04" },
];

const ITEMS_CATALOG = [
  { value: "1",  label: "Desktop Computer (Core i5)",       uom: "Pcs",  rate: 45000 },
  { value: "2",  label: "Laptop (Core i7, 16GB RAM)",        uom: "Pcs",  rate: 85000 },
  { value: "3",  label: "Executive Office Chair",            uom: "Pcs",  rate: 8500  },
  { value: "4",  label: 'Office Table (60"x30")',            uom: "Pcs",  rate: 12000 },
  { value: "5",  label: "A4 Paper (500 Sheets/Ream)",        uom: "Box",  rate: 350   },
  { value: "6",  label: "HP Printer Ink Cartridge Set",      uom: "Set",  rate: 2200  },
  { value: "7",  label: "Network Switch 24-Port (Cisco)",    uom: "Pcs",  rate: 12000 },
  { value: "8",  label: "UPS 1000VA (APC)",                  uom: "Pcs",  rate: 9500  },
  { value: "9",  label: "CAT6 Ethernet Cable (100m)",        uom: "Roll", rate: 1800  },
  { value: "10", label: 'Samsung 27" Monitor',               uom: "Pcs",  rate: 28000 },
  { value: "11", label: "Wireless Keyboard & Mouse Combo",   uom: "Set",  rate: 1800  },
  { value: "12", label: "External Hard Drive 1TB",           uom: "Pcs",  rate: 5500  },
];

const CONDITIONS = [
  { label: "Good",          value: "good"     },
  { label: "Acceptable",    value: "acceptable"},
  { label: "Damaged",       value: "damaged"  },
  { label: "Partial Defect",value: "partial"  },
];

const APPROVED_POS = [
  {
    value: "po-1000", label: "PO-1000",
    supplierId: "1", supplierName: "Alpha Tech Supplies",
    warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" },
    items: [
      { itemId: "1",  itemName: "Desktop Computer (Core i5)",     uom: "Pcs",  poQty: 10, prevReceived: 4 },
      { itemId: "10", itemName: 'Samsung 27" Monitor',             uom: "Pcs",  poQty: 10, prevReceived: 4 },
      { itemId: "11", itemName: "Wireless Keyboard & Mouse Combo", uom: "Set",  poQty: 10, prevReceived: 0 },
    ],
  },
  {
    value: "po-1003", label: "PO-1003",
    supplierId: "2", supplierName: "Beta Trading Co. Ltd.",
    warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" },
    items: [
      { itemId: "5",  itemName: "A4 Paper (500 Sheets/Ream)",   uom: "Box",  poQty: 100, prevReceived: 50 },
      { itemId: "6",  itemName: "HP Printer Ink Cartridge Set", uom: "Set",  poQty: 20,  prevReceived: 5  },
    ],
  },
  {
    value: "po-1007", label: "PO-1007",
    supplierId: "3", supplierName: "Gamma Electronics Ltd.",
    warehouse: { label: "Distribution Center – Gazipur (WH-03)", value: "wh-03" },
    items: [
      { itemId: "7",  itemName: "Network Switch 24-Port (Cisco)", uom: "Pcs",  poQty: 5,  prevReceived: 0 },
      { itemId: "8",  itemName: "UPS 1000VA (APC)",               uom: "Pcs",  poQty: 8,  prevReceived: 3 },
      { itemId: "9",  itemName: "CAT6 Ethernet Cable (100m)",     uom: "Roll", poQty: 20, prevReceived: 10},
    ],
  },
];

const UOM_OPTIONS = [
  "Pcs","Kg","Ltr","Box","Set","M","Ft","Roll","Dozen","Bag","Carton","Pair",
].map((u) => ({ label: u, value: u }));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genGRN = () => {
  const y = new Date().getFullYear();
  return `GRN-${y}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
};

const TODAY  = new Date().toISOString().split("T")[0];
const GRN_NO = genGRN();

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const newDirectRow = () => ({
  _id:       Math.random().toString(36).slice(2),
  itemId:    "",
  itemName:  "",
  description: "",
  uom:       "Pcs",
  receiveQty: 1,
  unitCost:  0,
  batchNo:   "",
  remarks:   "",
});

const newOrderRow = (item) => ({
  _id:         Math.random().toString(36).slice(2),
  itemId:      item.itemId,
  itemName:    item.itemName,
  uom:         item.uom,
  poQty:       item.poQty,
  prevReceived:item.prevReceived,
  pendingQty:  item.poQty - item.prevReceived,
  receiveQty:  item.poQty - item.prevReceived,
  condition:   "good",
  remarks:     "",
});

// ─── Yup Schemas ─────────────────────────────────────────────────────────────
const orderBasedSchema = yup.object({
  poId:        yup.mixed().test("req", "Purchase Order is required", (v) => v && v.value),
  receiveDate: yup.string().required("Receive Date is required"),
  receivedBy:  yup.string(),
  vehicleNo:   yup.string(),
  remarks:     yup.string(),
}).required();

const directSchema = yup.object({
  supplierId:    yup.mixed().test("req", "Supplier is required", (v) => v && v.value),
  warehouse:     yup.mixed().test("req", "Warehouse is required", (v) => v && v.value),
  receiveDate:   yup.string().required("Receive Date is required"),
  vendorInvoice: yup.string(),
  receivedBy:    yup.string(),
  vehicleNo:     yup.string(),
  remarks:       yup.string(),
}).required();

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHead({ icon: Icon, label, iconColor, badge }) {
  return (
    <div className="flex items-center justify-between pb-3 mb-1 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
      </div>
      {badge}
    </div>
  );
}

function StyledTextarea({ field, rows = 3, placeholder }) {
  return (
    <textarea
      {...field}
      rows={rows}
      placeholder={placeholder}
      style={{
        background: "var(--bg-surface)", color: "var(--text-primary)",
        border: "1px solid var(--border-strong)", borderRadius: 6,
        padding: "7px 10px", width: "100%", fontSize: 13, lineHeight: 1.5,
        resize: "vertical", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onFocus={(e)  => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(22,163,74,0.2)"; e.currentTarget.style.borderColor = "rgb(22 163 74)"; }}
      onBlur={(e)   => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
    />
  );
}

function ReadonlyField({ label, value, mono }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div
        className={`ctrl-input text-xs flex items-center ${mono ? "font-mono" : ""}`}
        style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed", userSelect: "none" }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

// ─── Order-Based Items Table ──────────────────────────────────────────────────
function OrderBasedItems({ items, onChangeRow }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-xs border-collapse" style={{ minWidth: 820 }}>
        <thead>
          <tr style={{ background: "var(--bg-elevated)" }}>
            {[
              { label: "#",             w: 36,  align: "center" },
              { label: "Item",          w: null,align: "left"   },
              { label: "UOM",           w: 60,  align: "center" },
              { label: "PO Qty",        w: 80,  align: "right"  },
              { label: "Prev. Received",w: 100, align: "right"  },
              { label: "Pending Qty",   w: 90,  align: "right"  },
              { label: "Receive Qty *", w: 100, align: "right"  },
              { label: "Condition",     w: 130, align: "center" },
              { label: "Remarks",       w: 150, align: "left"   },
            ].map((col) => (
              <th
                key={col.label}
                className="px-2.5 py-2.5 font-semibold whitespace-nowrap"
                style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.align, width: col.w || undefined }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr
              key={row._id}
              className="transition-colors"
              style={{ borderBottom: "1px solid var(--border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td className="px-2.5 py-2 text-center font-medium" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
              <td className="px-2.5 py-2 font-medium" style={{ color: "var(--text-primary)" }}>{row.itemName}</td>
              <td className="px-2.5 py-2 text-center" style={{ color: "var(--text-muted)" }}>{row.uom}</td>
              <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{row.poQty}</td>
              <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{row.prevReceived}</td>
              <td className="px-2.5 py-2 text-right font-semibold tabular-nums" style={{ color: row.pendingQty === 0 ? "#16a34a" : "var(--text-primary)" }}>
                {row.pendingQty}
              </td>
              <td className="px-2 py-1.5">
                <input
                  type="number" min="0" max={row.pendingQty} step="0.01"
                  className="ctrl-input text-xs text-right"
                  value={row.receiveQty}
                  onChange={(e) => onChangeRow(row._id, "receiveQty", Math.min(Number(e.target.value), row.pendingQty))}
                  style={{ background: row.receiveQty > row.pendingQty ? "#fee2e2" : undefined }}
                />
              </td>
              <td className="px-2 py-1.5">
                <select
                  className="ctrl-input text-xs"
                  value={row.condition}
                  onChange={(e) => onChangeRow(row._id, "condition", e.target.value)}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1.5">
                <input
                  type="text" className="ctrl-input text-xs"
                  value={row.remarks}
                  placeholder="Optional..."
                  onChange={(e) => onChangeRow(row._id, "remarks", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
            <td colSpan={5} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Total Receive Qty</td>
            <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {items.reduce((s, r) => s + (Number(r.pendingQty) || 0), 0)}
            </td>
            <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-emerald-600">
              {items.reduce((s, r) => s + (Number(r.receiveQty) || 0), 0)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Direct Items Table ───────────────────────────────────────────────────────
function DirectItems({ items, onChangeRow, onAddRow, onRemoveRow }) {
  return (
    <>
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-xs border-collapse" style={{ minWidth: 940 }}>
          <thead>
            <tr style={{ background: "var(--bg-elevated)" }}>
              {[
                { label: "#",             w: 36,  align: "center" },
                { label: "Item *",        w: 180, align: "left"   },
                { label: "Description",   w: null,align: "left"   },
                { label: "UOM",           w: 80,  align: "center" },
                { label: "Receive Qty *", w: 100, align: "right"  },
                { label: "Unit Cost",     w: 110, align: "right"  },
                { label: "Total Cost",    w: 110, align: "right"  },
                { label: "Batch No.",     w: 100, align: "left"   },
                { label: "Remarks",       w: 130, align: "left"   },
                { label: "",              w: 40,  align: "center" },
              ].map((col) => (
                <th
                  key={col.label}
                  className="px-2.5 py-2.5 font-semibold whitespace-nowrap"
                  style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.align, width: col.w || undefined }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => {
              const total = (Number(row.receiveQty) || 0) * (Number(row.unitCost) || 0);
              return (
                <tr
                  key={row._id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-2.5 py-1.5 text-center font-medium" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                  <td className="px-2 py-1.5">
                    <select
                      className="ctrl-input text-xs"
                      value={row.itemId}
                      onChange={(e) => {
                        const item = ITEMS_CATALOG.find((it) => it.value === e.target.value);
                        onChangeRow(row._id, "__item__", item);
                      }}
                    >
                      <option value="">— Select item —</option>
                      {ITEMS_CATALOG.map((it) => (
                        <option key={it.value} value={it.value}>{it.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="text" className="ctrl-input text-xs"
                      value={row.description}
                      placeholder="Description..."
                      onChange={(e) => onChangeRow(row._id, "description", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select className="ctrl-input text-xs text-center" value={row.uom} onChange={(e) => onChangeRow(row._id, "uom", e.target.value)}>
                      {UOM_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number" min="0.01" step="0.01"
                      className="ctrl-input text-xs text-right"
                      value={row.receiveQty}
                      onChange={(e) => onChangeRow(row._id, "receiveQty", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number" min="0" step="0.01"
                      className="ctrl-input text-xs text-right"
                      value={row.unitCost}
                      onChange={(e) => onChangeRow(row._id, "unitCost", e.target.value)}
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {fmt(total)}
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="text" className="ctrl-input text-xs"
                      value={row.batchNo}
                      placeholder="Batch / Lot No."
                      onChange={(e) => onChangeRow(row._id, "batchNo", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="text" className="ctrl-input text-xs"
                      value={row.remarks}
                      placeholder="Optional..."
                      onChange={(e) => onChangeRow(row._id, "remarks", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(row._id)}
                      disabled={items.length === 1}
                      className="p-1 rounded transition-colors text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Remove line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Totals</td>
              <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-emerald-600">
                {fmt(items.reduce((s, r) => s + (Number(r.receiveQty) || 0), 0))}
              </td>
              <td />
              <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                {fmt(items.reduce((s, r) => s + (Number(r.receiveQty) || 0) * (Number(r.unitCost) || 0), 0))}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Tip: Selecting an item auto-fills UOM and Unit Cost from the catalog.
        </p>
        <button type="button" onClick={onAddRow} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Line
        </button>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseReceiveCreate() {
  const navigate = useNavigate();
  const [receiveType, setReceiveType] = useState("order_based");

  // ── Order-based state
  const [selectedPO,    setSelectedPO]    = useState(null);
  const [orderItems,    setOrderItems]    = useState([]);
  const [supplierInfo,  setSupplierInfo]  = useState({ name: "", phone: "", email: "" });

  // ── Direct state
  const [directItems, setDirectItems] = useState([newDirectRow()]);

  // ── Form for order-based
  const obForm = useForm({
    resolver: yupResolver(orderBasedSchema),
    defaultValues: { poId: null, receiveDate: TODAY, receivedBy: "", vehicleNo: "", remarks: "" },
  });

  // ── Form for direct
  const dirForm = useForm({
    resolver: yupResolver(directSchema),
    defaultValues: { supplierId: null, warehouse: null, receiveDate: TODAY, vendorInvoice: "", receivedBy: "", vehicleNo: "", remarks: "" },
  });

  // ── PO selection handler
  const handlePOSelect = (opt) => {
    if (!opt?.value) { setSelectedPO(null); setOrderItems([]); setSupplierInfo({ name: "", phone: "", email: "" }); return; }
    const po = APPROVED_POS.find((p) => p.value === opt.value);
    if (!po) return;
    setSelectedPO(po);
    setOrderItems(po.items.filter((it) => it.poQty - it.prevReceived > 0).map(newOrderRow));
    const supp = SUPPLIERS.find((s) => s.value === po.supplierId);
    setSupplierInfo({ name: po.supplierName, phone: supp?.phone || "", email: supp?.email || "" });
    obForm.setValue("warehouse", po.warehouse);
  };

  // ── Order items change
  const handleOrderRowChange = (id, field, value) =>
    setOrderItems((p) => p.map((r) => r._id !== id ? r : { ...r, [field]: value }));

  // ── Direct items change
  const handleDirectRowChange = (id, field, value) =>
    setDirectItems((p) =>
      p.map((r) => {
        if (r._id !== id) return r;
        if (field === "__item__") {
          const item = value;
          return item
            ? { ...r, itemId: item.value, itemName: item.label, uom: item.uom, unitCost: item.rate, description: item.label }
            : { ...r, itemId: "", itemName: "", unitCost: 0 };
        }
        return { ...r, [field]: value };
      })
    );

  // ── Totals (direct)
  const directSummary = useMemo(() => {
    const totalQty  = directItems.reduce((s, r) => s + (Number(r.receiveQty) || 0), 0);
    const totalCost = directItems.reduce((s, r) => s + (Number(r.receiveQty) || 0) * (Number(r.unitCost) || 0), 0);
    return { totalQty, totalCost };
  }, [directItems]);

  const obIsSubmitting  = obForm.formState.isSubmitting;
  const dirIsSubmitting = dirForm.formState.isSubmitting;

  const onSubmitOrderBased = (data) => {
    if (orderItems.length === 0) { alert("Please select a PO with pending items."); return; }
    const totalReceiveQty = orderItems.reduce((s, r) => s + (Number(r.receiveQty) || 0), 0);
    if (totalReceiveQty === 0) { alert("Total receive quantity cannot be zero."); return; }
    console.log("GRN Payload (Order Based):", { grnNo: GRN_NO, type: "order_based", ...data, poId: data.poId?.value, items: orderItems });
    alert(`Goods Receive Note saved!\nGRN No: ${GRN_NO}`);
    navigate("/purchase/receive");
  };

  const onSubmitDirect = (data) => {
    if (!directItems.some((r) => r.itemId)) { alert("Please add at least one item."); return; }
    console.log("GRN Payload (Direct):", { grnNo: GRN_NO, type: "direct", ...data, supplierId: data.supplierId?.value, warehouse: data.warehouse?.value, items: directItems });
    alert(`Goods Receive Note saved!\nGRN No: ${GRN_NO}`);
    navigate("/purchase/receive");
  };

  const handleSave = () => {
    if (receiveType === "order_based") obForm.handleSubmit(onSubmitOrderBased)();
    else dirForm.handleSubmit(onSubmitDirect)();
  };

  const isSubmitting = receiveType === "order_based" ? obIsSubmitting : dirIsSubmitting;

  return (
    <motion.div
      className="flex flex-col gap-5 pb-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* ══ Page Header ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Create Goods Receive Note
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {GRN_NO} &nbsp;·&nbsp; New Document &nbsp;·&nbsp; Draft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/purchase/receive")}
            className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Save GRN
          </button>
        </div>
      </div>

      {/* ══ Type Selector ════════════════════════════════════════════════════ */}
      <div className="card">
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
          Select Receive Type
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {[
            {
              key: "order_based",
              icon: ClipboardList,
              title: "Order Based Receive",
              desc: "Receive goods against an approved Purchase Order (PO). Quantities are validated against PO.",
              iconColor: "text-blue-600",
              activeBorder: "border-blue-500",
              activeBg: "rgba(59,130,246,0.06)",
            },
            {
              key: "direct",
              icon: Truck,
              title: "Direct Receive",
              desc: "Receive goods directly without a PO reference — spot purchase or emergency procurement.",
              iconColor: "text-orange-600",
              activeBorder: "border-orange-500",
              activeBg: "rgba(249,115,22,0.06)",
            },
          ].map((opt) => {
            const active = receiveType === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setReceiveType(opt.key)}
                className="text-left p-4 rounded-xl border-2 transition-all"
                style={{
                  borderColor:  active ? (opt.key === "order_based" ? "#3b82f6" : "#f97316") : "var(--border)",
                  background:   active ? opt.activeBg : "var(--bg-surface)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <opt.icon className={`w-4 h-4 ${opt.iconColor}`} />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{opt.title}</span>
                  {active && <CheckCircle2 className={`w-4 h-4 ml-auto ${opt.key === "order_based" ? "text-blue-500" : "text-orange-500"}`} />}
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ Order-Based Form ═════════════════════════════════════════════════ */}
      {receiveType === "order_based" && (
        <div className="flex flex-col gap-5">
          {/* Row 1: GRN Info + PO Details */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* GRN / Receive Info */}
            <div className="lg:col-span-3 card space-y-4">
              <SectionHead icon={ClipboardList} label="GRN Information" iconColor="text-emerald-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <ReadonlyField label="GRN Number" value={GRN_NO} mono />
                <FormDropdown
                  name="poId"
                  control={obForm.control}
                  label="Purchase Order *"
                  options={APPROVED_POS.map((p) => ({ label: `${p.label} – ${p.supplierName}`, value: p.value }))}
                  placeholder="Select approved PO..."
                  onChange={handlePOSelect}
                />
                {obForm.formState.errors.poId && (
                  <p className="text-xs text-red-500 -mt-2 sm:col-span-2">{obForm.formState.errors.poId.message}</p>
                )}
                <FormInput name="receiveDate" control={obForm.control} label="Receive Date *" type="date" />
                <FormInput name="receivedBy"  control={obForm.control} label="Received By"   placeholder="Name of receiver" />
                <FormInput name="vehicleNo"   control={obForm.control} label="Vehicle No."   placeholder="e.g. DHA-12345" />
                <Controller
                  name="warehouse"
                  control={obForm.control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Delivery Warehouse</label>
                      <div className="ctrl-input text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed" }}>
                        {field.value?.label || "Auto-filled from PO"}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Supplier & PO Summary */}
            <div className="lg:col-span-2 card space-y-4">
              <SectionHead icon={Building2} label="Supplier & PO Details" iconColor="text-blue-600" />
              {selectedPO ? (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="p-3 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                    <p className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{selectedPO.label}</p>
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <span style={{ color: "var(--text-muted)", minWidth: 80 }}>Supplier</span>
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{supplierInfo.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <span style={{ color: "var(--text-muted)", minWidth: 80 }}>Phone</span>
                        <span style={{ color: "var(--text-primary)" }}>{supplierInfo.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <span style={{ color: "var(--text-muted)", minWidth: 80 }}>Email</span>
                        <span style={{ color: "var(--text-primary)" }}>{supplierInfo.email}</span>
                      </div>
                      <div className="flex gap-2">
                        <span style={{ color: "var(--text-muted)", minWidth: 80 }}>Warehouse</span>
                        <span style={{ color: "var(--text-primary)" }}>{selectedPO.warehouse?.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span style={{ color: "var(--text-muted)", minWidth: 80 }}>Pending Items</span>
                        <span className="font-semibold text-emerald-600">{orderItems.length} line(s)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks / Notes</label>
                    <Controller
                      name="remarks"
                      control={obForm.control}
                      render={({ field }) => <StyledTextarea field={field} rows={3} placeholder="Additional remarks..." />}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <ShoppingCart className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No PO Selected</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Select an approved Purchase Order to view details and items.</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          {orderItems.length > 0 && (
            <div className="card space-y-4">
              <SectionHead
                icon={Package}
                label="Items to Receive"
                iconColor="text-orange-600"
                badge={
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    {orderItems.length} pending line{orderItems.length !== 1 ? "s" : ""}
                  </span>
                }
              />
              <OrderBasedItems items={orderItems} onChangeRow={handleOrderRowChange} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Pending Qty = PO Qty minus previously received. Receive Qty cannot exceed Pending Qty.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══ Direct Form ══════════════════════════════════════════════════════ */}
      {receiveType === "direct" && (
        <div className="flex flex-col gap-5">
          {/* Row 1: GRN Info + Supplier Info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* GRN / Receive Info */}
            <div className="lg:col-span-3 card space-y-4">
              <SectionHead icon={ClipboardList} label="GRN Information" iconColor="text-emerald-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <ReadonlyField label="GRN Number" value={GRN_NO} mono />
                <FormInput name="receiveDate"   control={dirForm.control} label="Receive Date *"        type="date" />
                <FormDropdown
                  name="supplierId"
                  control={dirForm.control}
                  label="Supplier *"
                  options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                  placeholder="Select supplier..."
                />
                {dirForm.formState.errors.supplierId && (
                  <p className="text-xs text-red-500 -mt-2">{dirForm.formState.errors.supplierId.message}</p>
                )}
                <FormDropdown
                  name="warehouse"
                  control={dirForm.control}
                  label="Warehouse *"
                  options={WAREHOUSES}
                  placeholder="Select warehouse..."
                />
                {dirForm.formState.errors.warehouse && (
                  <p className="text-xs text-red-500 -mt-2">{dirForm.formState.errors.warehouse.message}</p>
                )}
                <FormInput name="vendorInvoice" control={dirForm.control} label="Vendor Invoice / Ref No." placeholder="e.g. INV-2026-001" />
                <FormInput name="receivedBy"    control={dirForm.control} label="Received By"              placeholder="Name of receiver" />
                <FormInput name="vehicleNo"     control={dirForm.control} label="Vehicle No."              placeholder="e.g. DHA-12345" />
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-2 card space-y-4">
              <SectionHead icon={Calculator} label="Receive Summary" iconColor="text-orange-600" />
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-secondary)" }}>Total Line Items</span>
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{directItems.filter((r) => r.itemId).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-secondary)" }}>Total Qty</span>
                      <span className="font-semibold text-emerald-600">{fmt(directSummary.totalQty)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between">
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total Cost</span>
                        <span className="text-lg font-bold text-emerald-600">৳ {fmt(directSummary.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks / Notes</label>
                  <Controller
                    name="remarks"
                    control={dirForm.control}
                    render={({ field }) => <StyledTextarea field={field} rows={5} placeholder="Additional remarks, special conditions, inspection notes..." />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="card space-y-4">
            <SectionHead
              icon={Package}
              label="Received Items"
              iconColor="text-orange-600"
              badge={
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {directItems.length} line{directItems.length !== 1 ? "s" : ""}
                </span>
              }
            />
            <DirectItems
              items={directItems}
              onChangeRow={handleDirectRowChange}
              onAddRow={() => setDirectItems((p) => [...p, newDirectRow()])}
              onRemoveRow={(id) => setDirectItems((p) => p.filter((r) => r._id !== id))}
            />
          </div>
        </div>
      )}

      {/* ══ Footer Actions ════════════════════════════════════════════════════ */}
      <div className="card flex flex-wrap items-center justify-between gap-3" style={{ background: "var(--bg-surface)" }}>
        <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Fields marked with * are required.
          {receiveType === "order_based"
            ? " Receive Qty cannot exceed Pending Qty for each item."
            : " Enter received items with quantities and unit costs."}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate("/purchase/receive")} className="btn-outline text-sm flex items-center gap-1.5">
            <X className="w-4 h-4" /> Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save GRN
          </button>
        </div>
      </div>
    </motion.div>
  );
}
