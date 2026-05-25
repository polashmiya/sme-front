import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Trash2, Package, Building2,
  ClipboardList, Save, X, AlertCircle,
  CheckCircle2, Truck, RotateCcw, Plus,
} from "lucide-react";
import FormInput from "../../../../../common/ant/FormInput";
import FormDropdown from "../../../../../common/ant/FormDropdown";

// ─── Static Reference Data ────────────────────────────────────────────────────
const SUPPLIERS = [
  { label: "Alpha Tech Supplies",      value: "1" },
  { label: "Beta Trading Co. Ltd.",    value: "2" },
  { label: "Gamma Electronics Ltd.",   value: "3" },
  { label: "Delta Logistics Inc.",     value: "4" },
  { label: "Epsilon Office Solutions", value: "5" },
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
  { label: "Road Transport",        value: "road"    },
  { label: "Supplier Pick-up",      value: "pickup"  },
  { label: "Courier (DHL / FedEx)", value: "courier" },
  { label: "Own Vehicle / Fleet",   value: "own"     },
];
const COMPLETED_GRNS = [
  { value: "grn-2000", label: "GRN-2000", supplierName: "Alpha Tech Supplies", warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" } },
  { value: "grn-2003", label: "GRN-2003", supplierName: "Beta Trading Co. Ltd.", warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" } },
  { value: "grn-2007", label: "GRN-2007", supplierName: "Gamma Electronics Ltd.", warehouse: { label: "Distribution Center – Gazipur (WH-03)", value: "wh-03" } },
];
const UOM_OPTIONS = ["Pcs","Kg","Ltr","Box","Set","M","Ft","Roll","Dozen","Bag","Carton","Pair"].map((u) => ({ label: u, value: u }));

const SUPP_NAMES  = ["Alpha Tech Supplies","Beta Trading Co. Ltd.","Gamma Electronics Ltd.","Delta Logistics Inc.","Epsilon Office Solutions"];
const ITEM_NAMES  = ["Desktop Computer (Core i5)","Laptop (Core i7, 16GB RAM)","Executive Office Chair",'Office Table (60"x30")',"A4 Paper (500 Sheets/Ream)","HP Printer Ink Cartridge Set","Network Switch 24-Port (Cisco)","UPS 1000VA (APC)","CAT6 Ethernet Cable (100m)",'Samsung 27" Monitor',"Wireless Keyboard & Mouse Combo","External Hard Drive 1TB"];
const ITEM_PRICES = [45000,85000,8500,12000,350,2200,12000,9500,1800,28000,1800,5500];
const WH_NAMES    = ["Main Warehouse – Dhaka (WH-01)","Secondary Warehouse – Chittagong (WH-02)","Distribution Center – Gazipur (WH-03)"];
const REASON_VALS = ["damaged","wrong_item","quality","over_qty","expired","price","other"];

// ─── Mock Form Data Generator ─────────────────────────────────────────────────
function getMockFormData(id) {
  const n          = Number(id) || 1;
  const isGRN      = n % 3 !== 2;
  const suppIdx    = n % SUPP_NAMES.length;
  const itemCount  = 2 + (n % 3);
  const d          = new Date(2025, n % 12, (n % 28) + 1);
  const dateStr    = d.toISOString().split("T")[0];
  const grnRef     = COMPLETED_GRNS[n % COMPLETED_GRNS.length];

  const items = Array.from({ length: itemCount }, (_, i) => {
    const idx       = (n + i) % ITEM_NAMES.length;
    const recvQty   = isGRN ? 5 + ((n + i) % 10) : null;
    const retQty    = isGRN ? 1 + ((n + i) % Math.max(1, recvQty - 1)) : 2 + ((n + i) % 8);
    return {
      _id:          String(i + 1),
      itemId:       String(idx + 1),
      itemName:     ITEM_NAMES[idx],
      description:  isGRN ? null : ITEM_NAMES[idx],
      uom:          ITEMS_CATALOG[idx]?.uom || "Pcs",
      receivedQty:  recvQty,
      returnQty:    retQty,
      unitPrice:    ITEM_PRICES[idx],
      returnReason: REASON_VALS[(n + i) % REASON_VALS.length],
      remarks:      "",
    };
  });

  return {
    prNo: `PR-${3000 + n}`,
    returnType: isGRN ? "grn_based" : "direct",
    supplierName: isGRN ? grnRef.supplierName : SUPP_NAMES[suppIdx],
    formData: isGRN
      ? {
          grnId:         { label: `${grnRef.label} – ${grnRef.supplierName}`, value: grnRef.value },
          returnDate:    dateStr,
          warehouse:     grnRef.warehouse,
          returnReason:  { label: RETURN_REASONS[n % RETURN_REASONS.length].label, value: RETURN_REASONS[n % RETURN_REASONS.length].value },
          shippingMethod:{ label: SHIPPING_METHODS[n % SHIPPING_METHODS.length].label, value: SHIPPING_METHODS[n % SHIPPING_METHODS.length].value },
          debitNoteNo:   n % 3 === 0 ? `DN-2025-${String(n).padStart(4, "0")}` : "",
          remarks:       "",
        }
      : {
          supplierId:    { label: SUPP_NAMES[suppIdx], value: String(suppIdx + 1) },
          warehouse:     { label: WH_NAMES[n % WH_NAMES.length], value: ["wh-01","wh-02","wh-03"][n % 3] },
          returnDate:    dateStr,
          returnReason:  { label: RETURN_REASONS[n % RETURN_REASONS.length].label, value: RETURN_REASONS[n % RETURN_REASONS.length].value },
          shippingMethod:{ label: SHIPPING_METHODS[n % SHIPPING_METHODS.length].label, value: SHIPPING_METHODS[n % SHIPPING_METHODS.length].value },
          debitNoteNo:   "",
          remarks:       "",
        },
    items,
  };
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
    <textarea {...field} rows={rows} placeholder={placeholder}
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseReturnEdit() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const mock     = getMockFormData(id);
  const [items, setItems] = useState(mock.items);

  const isGRN   = mock.returnType === "grn_based";
  const schema  = isGRN ? grnBasedSchema : directSchema;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: mock.formData,
  });

  const handleCellChange = (rowId, field, value) =>
    setItems((p) =>
      p.map((r) => {
        if (r._id !== rowId) return r;
        if (field === "__item__") {
          return value
            ? { ...r, itemId: value.value, itemName: value.label, uom: value.uom, unitPrice: value.rate, description: value.label }
            : r;
        }
        if (field === "returnQty" && isGRN) {
          return { ...r, returnQty: Math.min(Number(value), r.receivedQty) };
        }
        return { ...r, [field]: value };
      })
    );

  const totalReturnAmt = items.reduce((s, r) => s + (Number(r.returnQty) || 0) * (Number(r.unitPrice) || 0), 0);
  const totalReturnQty = items.reduce((s, r) => s + (Number(r.returnQty) || 0), 0);

  const onSubmit = (data) => {
    console.log("PR Edit Payload:", { prNo: mock.prNo, type: mock.returnType, ...data, items });
    alert(`Purchase Return ${mock.prNo} updated successfully!`);
    navigate(`/purchase/return/${id}`);
  };

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
              Edit Purchase Return
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              <span className="font-mono">{mock.prNo}</span>
              &nbsp;·&nbsp;
              <span className={isGRN ? "text-violet-600" : "text-orange-600"}>
                {isGRN ? "GRN Based" : "Direct"} Return
              </span>
              &nbsp;·&nbsp; Draft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(`/purchase/return/${id}`)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* Type Indicator */}
      <div className="card">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{
            background: isGRN ? "rgba(124,58,237,0.07)" : "rgba(249,115,22,0.07)",
            border: `1px solid ${isGRN ? "rgba(124,58,237,0.25)" : "rgba(249,115,22,0.25)"}`,
          }}>
          {isGRN ? <RotateCcw className="w-4 h-4 text-violet-600" /> : <Truck className="w-4 h-4 text-orange-600" />}
          <span style={{ color: isGRN ? "#5b21b6" : "#c2410c" }}>
            {isGRN ? "GRN Based Return" : "Direct Return"} — Return type cannot be changed in edit mode.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {/* Return Info + Supplier Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 card space-y-4">
            <SectionHead icon={ClipboardList} label="Return Information" iconColor="text-rose-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <ReadonlyField label="PR Number" value={mock.prNo} mono />
              {isGRN ? (
                <>
                  <FormDropdown name="grnId" control={control} label="GRN Reference *"
                    options={COMPLETED_GRNS.map((g) => ({ label: `${g.label} – ${g.supplierName}`, value: g.value }))}
                    placeholder="Select completed GRN..." />
                  {errors.grnId && <p className="text-xs text-red-500 -mt-2 sm:col-span-2">{errors.grnId.message}</p>}
                </>
              ) : (
                <>
                  <FormDropdown name="supplierId" control={control} label="Supplier *"
                    options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                    placeholder="Select supplier..." />
                  {errors.supplierId && <p className="text-xs text-red-500 -mt-2">{errors.supplierId.message}</p>}
                </>
              )}
              <FormInput name="returnDate" control={control} label="Return Date *" type="date" />
              <FormDropdown name="returnReason" control={control} label="Primary Return Reason" options={RETURN_REASONS} placeholder="Select reason..." />
              <FormDropdown name="shippingMethod" control={control} label="Shipping Method" options={SHIPPING_METHODS} placeholder="Select method..." />
              <FormInput name="debitNoteNo" control={control} label="Debit Note / Ref No." placeholder="e.g. DN-2026-001" />
              {isGRN ? (
                <Controller name="warehouse" control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Return From Warehouse</label>
                      <div className="ctrl-input text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed" }}>
                        {field.value?.label || "Auto-filled from GRN"}
                      </div>
                    </div>
                  )}
                />
              ) : (
                <>
                  <FormDropdown name="warehouse" control={control} label="Return From Warehouse *" options={WAREHOUSES} placeholder="Select warehouse..." />
                  {errors.warehouse && <p className="text-xs text-red-500 -mt-2">{errors.warehouse.message}</p>}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 card space-y-4">
            <SectionHead icon={Building2} label={isGRN ? "Supplier & GRN" : "Summary"} iconColor="text-violet-600" />
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{mock.supplierName}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg text-center" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xl font-bold text-rose-600">{totalReturnQty}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Total Qty</p>
                  </div>
                  <div className="p-2.5 rounded-lg text-center" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{items.length}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Line Items</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Total Return Amount</p>
                  <p className="text-lg font-bold text-rose-600">৳ {fmt(totalReturnAmt)}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks</label>
                <Controller name="remarks" control={control}
                  render={({ field }) => <StyledTextarea field={field} rows={4} placeholder="Additional remarks..." />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="card space-y-4">
          <SectionHead icon={Package} label="Return Items" iconColor="text-rose-600"
            badge={
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {items.length} line{items.length !== 1 ? "s" : ""}
                </span>
                {!isGRN && (
                  <button type="button" className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
                    onClick={() => setItems((p) => [...p, { _id: Math.random().toString(36).slice(2), itemId: "", itemName: "", description: "", uom: "Pcs", returnQty: 1, unitPrice: 0, returnReason: "damaged", remarks: "" }])}>
                    <Plus className="w-3.5 h-3.5" /> Add Line
                  </button>
                )}
              </div>
            }
          />
          <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-xs border-collapse" style={{ minWidth: isGRN ? 820 : 920 }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  {(isGRN
                    ? [
                        {l:"#",a:"center"},{l:"Item",a:"left"},{l:"UOM",a:"center"},
                        {l:"Received Qty",a:"right"},{l:"Return Qty *",a:"right"},
                        {l:"Unit Price",a:"right"},{l:"Return Amount",a:"right"},
                        {l:"Return Reason",a:"left"},{l:"Remarks",a:"left"},
                      ]
                    : [
                        {l:"#",a:"center"},{l:"Item *",a:"left"},{l:"Description",a:"left"},
                        {l:"UOM",a:"center"},{l:"Return Qty *",a:"right"},
                        {l:"Unit Price",a:"right"},{l:"Total Amount",a:"right"},
                        {l:"Return Reason",a:"left"},{l:"Remarks",a:"left"},{l:"",a:"center"},
                      ]
                  ).map((col) => (
                    <th key={col.l} className="px-2.5 py-2.5 font-semibold whitespace-nowrap"
                      style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.a }}>
                      {col.l}
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

                      {isGRN ? (
                        <td className="px-2.5 py-2 font-medium" style={{ color: "var(--text-primary)" }}>{row.itemName}</td>
                      ) : (
                        <td className="px-2 py-1.5">
                          <select className="ctrl-input text-xs" value={row.itemId}
                            onChange={(e) => {
                              const item = ITEMS_CATALOG.find((it) => it.value === e.target.value);
                              handleCellChange(row._id, "__item__", item);
                            }}>
                            <option value="">— Select item —</option>
                            {ITEMS_CATALOG.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
                          </select>
                        </td>
                      )}

                      {!isGRN && (
                        <td className="px-2 py-1.5">
                          <input type="text" className="ctrl-input text-xs" value={row.description || ""}
                            placeholder="Description..." onChange={(e) => handleCellChange(row._id, "description", e.target.value)} />
                        </td>
                      )}

                      {isGRN ? (
                        <td className="px-2.5 py-2 text-center" style={{ color: "var(--text-muted)" }}>{row.uom}</td>
                      ) : (
                        <td className="px-2 py-1.5">
                          <select className="ctrl-input text-xs text-center" value={row.uom} onChange={(e) => handleCellChange(row._id, "uom", e.target.value)}>
                            {UOM_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                          </select>
                        </td>
                      )}

                      {isGRN && (
                        <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{row.receivedQty}</td>
                      )}

                      <td className="px-2 py-1.5">
                        <input type="number" min="0" max={isGRN ? row.receivedQty : undefined} step="0.01"
                          className="ctrl-input text-xs text-right"
                          value={row.returnQty}
                          onChange={(e) => handleCellChange(row._id, "returnQty", e.target.value)} />
                      </td>

                      {isGRN ? (
                        <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>৳ {fmt(row.unitPrice)}</td>
                      ) : (
                        <td className="px-2 py-1.5">
                          <input type="number" min="0" step="0.01" className="ctrl-input text-xs text-right"
                            value={row.unitPrice || 0} onChange={(e) => handleCellChange(row._id, "unitPrice", e.target.value)} />
                        </td>
                      )}

                      <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums text-rose-600">৳ {fmt(lineAmt)}</td>

                      <td className="px-2 py-1.5">
                        <select className="ctrl-input text-xs" value={row.returnReason}
                          onChange={(e) => handleCellChange(row._id, "returnReason", e.target.value)}>
                          {RETURN_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </td>

                      <td className="px-2 py-1.5">
                        <input type="text" className="ctrl-input text-xs" value={row.remarks || ""}
                          placeholder="Optional..." onChange={(e) => handleCellChange(row._id, "remarks", e.target.value)} />
                      </td>

                      {!isGRN && (
                        <td className="px-2 py-1.5 text-center">
                          <button type="button" onClick={() => setItems((p) => p.filter((r) => r._id !== row._id))}
                            disabled={items.length === 1}
                            className="p-1 rounded transition-colors text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-25 disabled:cursor-not-allowed">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
                  <td colSpan={isGRN ? 4 : 4} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Total Return Amount
                  </td>
                  <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-rose-600">{totalReturnQty}</td>
                  {!isGRN && <td />}
                  <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-rose-600">৳ {fmt(totalReturnAmt)}</td>
                  <td colSpan={isGRN ? 2 : 3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Fields marked with * are required. Only Draft returns can be edited.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate(`/purchase/return/${id}`)} className="btn-outline text-sm flex items-center gap-1.5">
              <X className="w-4 h-4" /> Discard Changes
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-sm flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
