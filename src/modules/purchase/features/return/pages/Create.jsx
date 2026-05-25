import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, Package, Building2,
  FileText, ClipboardList, Save, X, AlertCircle,
  CheckCircle2, Truck, RotateCcw, Calculator,
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
const RETURN_REASONS = [
  { label: "Damaged / Defective",   value: "damaged"    },
  { label: "Wrong Item Received",   value: "wrong_item" },
  { label: "Quality Issue",         value: "quality"    },
  { label: "Over Delivery",         value: "over_qty"   },
  { label: "Expired / Near Expiry", value: "expired"    },
  { label: "Price Dispute",         value: "price"      },
  { label: "Other",                 value: "other"      },
];
const SHIPPING_METHODS = [
  { label: "Road Transport",              value: "road"    },
  { label: "Supplier Pick-up",            value: "pickup"  },
  { label: "Courier (DHL / FedEx)",       value: "courier" },
  { label: "Own Vehicle / Fleet",         value: "own"     },
];
const COMPLETED_GRNS = [
  {
    value: "grn-2000", label: "GRN-2000",
    supplierId: "1", supplierName: "Alpha Tech Supplies",
    warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" },
    items: [
      { itemId: "1",  itemName: "Desktop Computer (Core i5)",       uom: "Pcs",  receivedQty: 6,  unitPrice: 45000 },
      { itemId: "10", itemName: 'Samsung 27" Monitor',              uom: "Pcs",  receivedQty: 6,  unitPrice: 28000 },
      { itemId: "11", itemName: "Wireless Keyboard & Mouse Combo",  uom: "Set",  receivedQty: 10, unitPrice: 1800  },
    ],
  },
  {
    value: "grn-2003", label: "GRN-2003",
    supplierId: "2", supplierName: "Beta Trading Co. Ltd.",
    warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" },
    items: [
      { itemId: "5",  itemName: "A4 Paper (500 Sheets/Ream)",   uom: "Box",  receivedQty: 50, unitPrice: 350  },
      { itemId: "6",  itemName: "HP Printer Ink Cartridge Set", uom: "Set",  receivedQty: 15, unitPrice: 2200 },
    ],
  },
  {
    value: "grn-2007", label: "GRN-2007",
    supplierId: "3", supplierName: "Gamma Electronics Ltd.",
    warehouse: { label: "Distribution Center – Gazipur (WH-03)", value: "wh-03" },
    items: [
      { itemId: "7",  itemName: "Network Switch 24-Port (Cisco)", uom: "Pcs",  receivedQty: 5,  unitPrice: 12000 },
      { itemId: "8",  itemName: "UPS 1000VA (APC)",               uom: "Pcs",  receivedQty: 5,  unitPrice: 9500  },
      { itemId: "9",  itemName: "CAT6 Ethernet Cable (100m)",     uom: "Roll", receivedQty: 10, unitPrice: 1800  },
    ],
  },
];
const UOM_OPTIONS = ["Pcs","Kg","Ltr","Box","Set","M","Ft","Roll","Dozen","Bag","Carton","Pair"].map((u) => ({ label: u, value: u }));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genPRNo = () => `PR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
const TODAY   = new Date().toISOString().split("T")[0];
const PR_NO   = genPRNo();
const fmt     = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const newDirectRow = () => ({
  _id: Math.random().toString(36).slice(2),
  itemId: "", itemName: "", description: "",
  uom: "Pcs", returnQty: 1, unitPrice: 0,
  returnReason: "damaged", remarks: "",
});

const newGRNRow = (item) => ({
  _id:          Math.random().toString(36).slice(2),
  itemId:       item.itemId,
  itemName:     item.itemName,
  uom:          item.uom,
  receivedQty:  item.receivedQty,
  returnQty:    1,
  unitPrice:    item.unitPrice,
  returnReason: "damaged",
  remarks:      "",
});

// ─── Yup Schemas ─────────────────────────────────────────────────────────────
const grnBasedSchema = yup.object({
  grnId:         yup.mixed().test("req", "GRN Reference is required", (v) => v && v.value),
  returnDate:    yup.string().required("Return Date is required"),
  returnReason:  yup.mixed().nullable(),
  shippingMethod:yup.mixed().nullable(),
  debitNoteNo:   yup.string(),
  remarks:       yup.string(),
}).required();

const directSchema = yup.object({
  supplierId:    yup.mixed().test("req", "Supplier is required", (v) => v && v.value),
  warehouse:     yup.mixed().test("req", "Warehouse is required", (v) => v && v.value),
  returnDate:    yup.string().required("Return Date is required"),
  returnReason:  yup.mixed().nullable(),
  shippingMethod:yup.mixed().nullable(),
  debitNoteNo:   yup.string(),
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
      {...field} rows={rows} placeholder={placeholder}
      style={{
        background: "var(--bg-surface)", color: "var(--text-primary)",
        border: "1px solid var(--border-strong)", borderRadius: 6,
        padding: "7px 10px", width: "100%", fontSize: 13, lineHeight: 1.5,
        resize: "vertical", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(225,29,72,0.15)"; e.currentTarget.style.borderColor = "rgb(225 29 72)"; }}
      onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
    />
  );
}

function ReadonlyField({ label, value, mono }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div className={`ctrl-input text-xs flex items-center ${mono ? "font-mono" : ""}`}
        style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed", userSelect: "none" }}>
        {value || "—"}
      </div>
    </div>
  );
}

// ─── GRN-Based Items Table ────────────────────────────────────────────────────
function GRNBasedItems({ items, onChangeRow }) {
  const totalReturnAmt = items.reduce((s, r) => s + (Number(r.returnQty) || 0) * (Number(r.unitPrice) || 0), 0);
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-xs border-collapse" style={{ minWidth: 840 }}>
        <thead>
          <tr style={{ background: "var(--bg-elevated)" }}>
            {[
              { label: "#",             w: 36,  align: "center" },
              { label: "Item",          w: null,align: "left"   },
              { label: "UOM",           w: 60,  align: "center" },
              { label: "Received Qty",  w: 100, align: "right"  },
              { label: "Return Qty *",  w: 100, align: "right"  },
              { label: "Unit Price",    w: 110, align: "right"  },
              { label: "Return Amount", w: 120, align: "right"  },
              { label: "Return Reason", w: 150, align: "left"   },
              { label: "Remarks",       w: 130, align: "left"   },
            ].map((col) => (
              <th key={col.label} className="px-2.5 py-2.5 font-semibold whitespace-nowrap"
                style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.align, width: col.w || undefined }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => {
            const lineAmt = (Number(row.returnQty) || 0) * (Number(row.unitPrice) || 0);
            return (
              <tr key={row._id} className="transition-colors" style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="px-2.5 py-2 text-center font-medium" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                <td className="px-2.5 py-2 font-medium" style={{ color: "var(--text-primary)" }}>{row.itemName}</td>
                <td className="px-2.5 py-2 text-center" style={{ color: "var(--text-muted)" }}>{row.uom}</td>
                <td className="px-2.5 py-2 text-right tabular-nums font-medium" style={{ color: "var(--text-secondary)" }}>{row.receivedQty}</td>
                <td className="px-2 py-1.5">
                  <input type="number" min="0" max={row.receivedQty} step="0.01"
                    className="ctrl-input text-xs text-right"
                    value={row.returnQty}
                    onChange={(e) => onChangeRow(row._id, "returnQty", Math.min(Number(e.target.value), row.receivedQty))}
                    style={{ background: row.returnQty > row.receivedQty ? "#fee2e2" : undefined }}
                  />
                </td>
                <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  ৳ {fmt(row.unitPrice)}
                </td>
                <td className="px-2.5 py-2 text-right font-semibold tabular-nums text-rose-600">
                  ৳ {fmt(lineAmt)}
                </td>
                <td className="px-2 py-1.5">
                  <select className="ctrl-input text-xs" value={row.returnReason}
                    onChange={(e) => onChangeRow(row._id, "returnReason", e.target.value)}>
                    {RETURN_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" className="ctrl-input text-xs" value={row.remarks}
                    placeholder="Optional..."
                    onChange={(e) => onChangeRow(row._id, "remarks", e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
            <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Total Return Amount</td>
            <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-rose-600">
              {items.reduce((s, r) => s + (Number(r.returnQty) || 0), 0)}
            </td>
            <td />
            <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-rose-600">
              ৳ {fmt(totalReturnAmt)}
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
  const totalAmt = items.reduce((s, r) => s + (Number(r.returnQty) || 0) * (Number(r.unitPrice) || 0), 0);
  return (
    <>
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-xs border-collapse" style={{ minWidth: 960 }}>
          <thead>
            <tr style={{ background: "var(--bg-elevated)" }}>
              {[
                { label: "#",             w: 36,  align: "center" },
                { label: "Item *",        w: 180, align: "left"   },
                { label: "Description",   w: null,align: "left"   },
                { label: "UOM",           w: 80,  align: "center" },
                { label: "Return Qty *",  w: 100, align: "right"  },
                { label: "Unit Price",    w: 110, align: "right"  },
                { label: "Total Amount",  w: 120, align: "right"  },
                { label: "Return Reason", w: 150, align: "left"   },
                { label: "Remarks",       w: 120, align: "left"   },
                { label: "",              w: 40,  align: "center" },
              ].map((col) => (
                <th key={col.label} className="px-2.5 py-2.5 font-semibold whitespace-nowrap"
                  style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.align, width: col.w || undefined }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => {
              const lineAmt = (Number(row.returnQty) || 0) * (Number(row.unitPrice) || 0);
              return (
                <tr key={row._id} className="transition-colors" style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-2.5 py-1.5 text-center font-medium" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                  <td className="px-2 py-1.5">
                    <select className="ctrl-input text-xs" value={row.itemId}
                      onChange={(e) => {
                        const item = ITEMS_CATALOG.find((it) => it.value === e.target.value);
                        onChangeRow(row._id, "__item__", item);
                      }}>
                      <option value="">— Select item —</option>
                      {ITEMS_CATALOG.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="text" className="ctrl-input text-xs" value={row.description}
                      placeholder="Description..." onChange={(e) => onChangeRow(row._id, "description", e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5">
                    <select className="ctrl-input text-xs text-center" value={row.uom} onChange={(e) => onChangeRow(row._id, "uom", e.target.value)}>
                      {UOM_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" min="0.01" step="0.01" className="ctrl-input text-xs text-right"
                      value={row.returnQty} onChange={(e) => onChangeRow(row._id, "returnQty", e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" min="0" step="0.01" className="ctrl-input text-xs text-right"
                      value={row.unitPrice} onChange={(e) => onChangeRow(row._id, "unitPrice", e.target.value)} />
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums text-rose-600">
                    ৳ {fmt(lineAmt)}
                  </td>
                  <td className="px-2 py-1.5">
                    <select className="ctrl-input text-xs" value={row.returnReason}
                      onChange={(e) => onChangeRow(row._id, "returnReason", e.target.value)}>
                      {RETURN_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="text" className="ctrl-input text-xs" value={row.remarks}
                      placeholder="Optional..." onChange={(e) => onChangeRow(row._id, "remarks", e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button type="button" onClick={() => onRemoveRow(row._id)} disabled={items.length === 1}
                      className="p-1 rounded transition-colors text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-25 disabled:cursor-not-allowed">
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
              <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-rose-600">
                {fmt(items.reduce((s, r) => s + (Number(r.returnQty) || 0), 0))}
              </td>
              <td />
              <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-rose-600">
                ৳ {fmt(totalAmt)}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Tip: Selecting an item auto-fills UOM and Unit Price from the catalog.
        </p>
        <button type="button" onClick={onAddRow} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Line
        </button>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseReturnCreate() {
  const navigate    = useNavigate();
  const [returnType, setReturnType] = useState("grn_based");

  const [selectedGRN,  setSelectedGRN]  = useState(null);
  const [grnItems,     setGrnItems]     = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({ name: "", phone: "", email: "" });
  const [directItems,  setDirectItems]  = useState([newDirectRow()]);

  const grnForm = useForm({
    resolver: yupResolver(grnBasedSchema),
    defaultValues: { grnId: null, returnDate: TODAY, returnReason: null, shippingMethod: null, debitNoteNo: "", remarks: "" },
  });
  const dirForm = useForm({
    resolver: yupResolver(directSchema),
    defaultValues: { supplierId: null, warehouse: null, returnDate: TODAY, returnReason: null, shippingMethod: null, debitNoteNo: "", remarks: "" },
  });

  const handleGRNSelect = (opt) => {
    if (!opt?.value) { setSelectedGRN(null); setGrnItems([]); setSupplierInfo({ name: "", phone: "", email: "" }); return; }
    const grn = COMPLETED_GRNS.find((g) => g.value === opt.value);
    if (!grn) return;
    setSelectedGRN(grn);
    setGrnItems(grn.items.map(newGRNRow));
    const supp = SUPPLIERS.find((s) => s.value === grn.supplierId);
    setSupplierInfo({ name: grn.supplierName, phone: supp?.phone || "", email: supp?.email || "" });
    grnForm.setValue("warehouse", grn.warehouse);
  };

  const handleGRNRowChange = (id, field, value) =>
    setGrnItems((p) => p.map((r) => r._id !== id ? r : { ...r, [field]: value }));

  const handleDirectRowChange = (id, field, value) =>
    setDirectItems((p) =>
      p.map((r) => {
        if (r._id !== id) return r;
        if (field === "__item__") {
          return value
            ? { ...r, itemId: value.value, itemName: value.label, uom: value.uom, unitPrice: value.rate, description: value.label }
            : { ...r, itemId: "", itemName: "", unitPrice: 0 };
        }
        return { ...r, [field]: value };
      })
    );

  const grnTotalAmt = useMemo(() =>
    grnItems.reduce((s, r) => s + (Number(r.returnQty) || 0) * (Number(r.unitPrice) || 0), 0),
    [grnItems]);

  const directTotalAmt = useMemo(() =>
    directItems.reduce((s, r) => s + (Number(r.returnQty) || 0) * (Number(r.unitPrice) || 0), 0),
    [directItems]);

  const onSubmitGRN = (data) => {
    if (grnItems.length === 0) { alert("Please select a GRN with items."); return; }
    if (grnItems.reduce((s, r) => s + (Number(r.returnQty) || 0), 0) === 0) { alert("Total return quantity cannot be zero."); return; }
    console.log("PR Payload (GRN Based):", { prNo: PR_NO, type: "grn_based", ...data, grnId: data.grnId?.value, items: grnItems });
    alert(`Purchase Return saved!\nPR No: ${PR_NO}`);
    navigate("/purchase/return");
  };

  const onSubmitDirect = (data) => {
    if (!directItems.some((r) => r.itemId)) { alert("Please add at least one item."); return; }
    console.log("PR Payload (Direct):", { prNo: PR_NO, type: "direct", ...data, supplierId: data.supplierId?.value, warehouse: data.warehouse?.value, items: directItems });
    alert(`Purchase Return saved!\nPR No: ${PR_NO}`);
    navigate("/purchase/return");
  };

  const handleSave = () => {
    if (returnType === "grn_based") grnForm.handleSubmit(onSubmitGRN)();
    else dirForm.handleSubmit(onSubmitDirect)();
  };

  const isSubmitting = returnType === "grn_based" ? grnForm.formState.isSubmitting : dirForm.formState.isSubmitting;

  return (
    <motion.div className="flex flex-col gap-5 pb-6"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Create Purchase Return
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {PR_NO} &nbsp;·&nbsp; New Document &nbsp;·&nbsp; Draft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate("/purchase/return")} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={isSubmitting} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Save Return
          </button>
        </div>
      </div>

      {/* Type Selector */}
      <div className="card">
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Select Return Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {[
            {
              key: "grn_based", icon: RotateCcw,
              title: "GRN Based Return",
              desc: "Return goods against a completed Goods Receive Note. Quantities are validated against the GRN.",
              iconColor: "text-violet-600",
              activeColor: "#7c3aed",
              activeBg: "rgba(124,58,237,0.06)",
            },
            {
              key: "direct", icon: Truck,
              title: "Direct Return",
              desc: "Return goods directly to the supplier without a GRN reference.",
              iconColor: "text-orange-600",
              activeColor: "#f97316",
              activeBg: "rgba(249,115,22,0.06)",
            },
          ].map((opt) => {
            const active = returnType === opt.key;
            return (
              <button key={opt.key} type="button" onClick={() => setReturnType(opt.key)}
                className="text-left p-4 rounded-xl border-2 transition-all"
                style={{ borderColor: active ? opt.activeColor : "var(--border)", background: active ? opt.activeBg : "var(--bg-surface)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <opt.icon className={`w-4 h-4 ${opt.iconColor}`} />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{opt.title}</span>
                  {active && <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: opt.activeColor }} />}
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ GRN-Based Form ══════════════════════════════════════════════════════ */}
      {returnType === "grn_based" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Return Info */}
            <div className="lg:col-span-3 card space-y-4">
              <SectionHead icon={ClipboardList} label="Return Information" iconColor="text-rose-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <ReadonlyField label="PR Number" value={PR_NO} mono />
                <FormDropdown
                  name="grnId" control={grnForm.control}
                  label="GRN Reference *"
                  options={COMPLETED_GRNS.map((g) => ({ label: `${g.label} – ${g.supplierName}`, value: g.value }))}
                  placeholder="Select completed GRN..."
                  onChange={handleGRNSelect}
                />
                {grnForm.formState.errors.grnId && (
                  <p className="text-xs text-red-500 -mt-2 sm:col-span-2">{grnForm.formState.errors.grnId.message}</p>
                )}
                <FormInput name="returnDate" control={grnForm.control} label="Return Date *" type="date" />
                <FormDropdown
                  name="returnReason" control={grnForm.control}
                  label="Primary Return Reason"
                  options={RETURN_REASONS} placeholder="Select reason..."
                />
                <FormDropdown
                  name="shippingMethod" control={grnForm.control}
                  label="Shipping Method"
                  options={SHIPPING_METHODS} placeholder="Select method..."
                />
                <FormInput name="debitNoteNo" control={grnForm.control} label="Debit Note / Ref No." placeholder="e.g. DN-2026-001" />
                <Controller
                  name="warehouse" control={grnForm.control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Return From Warehouse</label>
                      <div className="ctrl-input text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed" }}>
                        {field.value?.label || "Auto-filled from GRN"}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* GRN / Supplier Summary */}
            <div className="lg:col-span-2 card space-y-4">
              <SectionHead icon={Building2} label="Supplier & GRN Details" iconColor="text-violet-600" />
              {selectedGRN ? (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="p-3 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                    <p className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{selectedGRN.label}</p>
                    <div className="space-y-1.5">
                      {[
                        ["Supplier",   supplierInfo.name],
                        ["Phone",      supplierInfo.phone],
                        ["Email",      supplierInfo.email],
                        ["Warehouse",  selectedGRN.warehouse?.label],
                        ["Items",      `${grnItems.length} returnable line(s)`],
                      ].map(([label, val]) => (
                        <div key={label} className="flex gap-2">
                          <span style={{ color: "var(--text-muted)", minWidth: 72 }}>{label}</span>
                          <span className={`font-medium ${label === "Items" ? "text-violet-600" : ""}`} style={{ color: label === "Items" ? undefined : "var(--text-primary)" }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {grnTotalAmt > 0 && (
                    <div className="p-3 rounded-lg" style={{ background: "rgba(225,29,72,0.05)", border: "1px solid rgba(225,29,72,0.15)" }}>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Estimated Return Amount</p>
                      <p className="text-xl font-bold text-rose-600 mt-0.5">৳ {fmt(grnTotalAmt)}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks</label>
                    <Controller name="remarks" control={grnForm.control}
                      render={({ field }) => <StyledTextarea field={field} rows={3} placeholder="Additional remarks..." />}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <RotateCcw className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No GRN Selected</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Select a completed GRN to view supplier details and items to return.</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          {grnItems.length > 0 && (
            <div className="card space-y-4">
              <SectionHead icon={Package} label="Items to Return" iconColor="text-rose-600"
                badge={
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    {grnItems.length} line{grnItems.length !== 1 ? "s" : ""}
                  </span>
                }
              />
              <GRNBasedItems items={grnItems} onChangeRow={handleGRNRowChange} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Return Qty cannot exceed the originally Received Qty.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══ Direct Form ════════════════════════════════════════════════════════ */}
      {returnType === "direct" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Return Info */}
            <div className="lg:col-span-3 card space-y-4">
              <SectionHead icon={ClipboardList} label="Return Information" iconColor="text-rose-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <ReadonlyField label="PR Number" value={PR_NO} mono />
                <FormInput name="returnDate" control={dirForm.control} label="Return Date *" type="date" />
                <FormDropdown
                  name="supplierId" control={dirForm.control}
                  label="Supplier *"
                  options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                  placeholder="Select supplier..."
                />
                {dirForm.formState.errors.supplierId && (
                  <p className="text-xs text-red-500 -mt-2">{dirForm.formState.errors.supplierId.message}</p>
                )}
                <FormDropdown
                  name="warehouse" control={dirForm.control}
                  label="Return From Warehouse *"
                  options={WAREHOUSES} placeholder="Select warehouse..."
                />
                {dirForm.formState.errors.warehouse && (
                  <p className="text-xs text-red-500 -mt-2">{dirForm.formState.errors.warehouse.message}</p>
                )}
                <FormDropdown
                  name="returnReason" control={dirForm.control}
                  label="Primary Return Reason"
                  options={RETURN_REASONS} placeholder="Select reason..."
                />
                <FormDropdown
                  name="shippingMethod" control={dirForm.control}
                  label="Shipping Method"
                  options={SHIPPING_METHODS} placeholder="Select method..."
                />
                <FormInput name="debitNoteNo" control={dirForm.control} label="Debit Note / Ref No." placeholder="e.g. DN-2026-001" />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2 card space-y-4">
              <SectionHead icon={Calculator} label="Return Summary" iconColor="text-rose-600" />
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-secondary)" }}>Line Items</span>
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{directItems.filter((r) => r.itemId).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-secondary)" }}>Total Return Qty</span>
                      <span className="font-semibold text-rose-600">{fmt(directItems.reduce((s, r) => s + (Number(r.returnQty) || 0), 0))}</span>
                    </div>
                    <div className="border-t pt-2 mt-2" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between">
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total Return Amount</span>
                        <span className="text-lg font-bold text-rose-600">৳ {fmt(directTotalAmt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks</label>
                  <Controller name="remarks" control={dirForm.control}
                    render={({ field }) => <StyledTextarea field={field} rows={5} placeholder="Return reasons, condition of goods, packing instructions..." />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card space-y-4">
            <SectionHead icon={Package} label="Return Items" iconColor="text-rose-600"
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

      {/* Footer */}
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Fields marked with * are required.
          {returnType === "grn_based"
            ? " Return Qty cannot exceed the originally Received Qty."
            : " Enter items to return with quantities and unit prices."}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate("/purchase/return")} className="btn-outline text-sm flex items-center gap-1.5">
            <X className="w-4 h-4" /> Discard
          </button>
          <button type="button" onClick={handleSave} disabled={isSubmitting} className="btn-primary text-sm flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Return
          </button>
        </div>
      </div>
    </motion.div>
  );
}
