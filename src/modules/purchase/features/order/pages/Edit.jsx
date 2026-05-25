import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, Package, Building2,
  FileText, ClipboardList, Calculator, Save, X,
  AlertCircle, CheckCircle2,
} from "lucide-react";
import FormInput from "../../../../../common/ant/FormInput";
import FormDropdown from "../../../../../common/ant/FormDropdown";

// ─── Static Reference Data (same as Create) ───────────────────────────────────
const SUPPLIERS = [
  { label: "Alpha Tech Supplies",      value: "1", address: "123 Industrial Area, Dhaka-1216",      phone: "+880-1700-000001", email: "procurement@alphatech.com.bd",  contact: "Md. Rafiqul Islam"  },
  { label: "Beta Trading Co. Ltd.",    value: "2", address: "456 Commerce Street, Chittagong-4000", phone: "+880-1800-000002", email: "order@betatrading.com",          contact: "Fatema Begum"       },
  { label: "Gamma Electronics Ltd.",   value: "3", address: "789 Tech Park, Sylhet-3100",           phone: "+880-1911-000003", email: "sales@gammaelec.com",            contact: "Karim Ahmed"        },
  { label: "Delta Logistics Inc.",     value: "4", address: "321 Cargo Zone, Rajshahi-6000",        phone: "+880-1750-000004", email: "supply@deltalogistics.net",      contact: "Nasrin Akhter"      },
  { label: "Epsilon Office Solutions", value: "5", address: "55 Business Hub, Khulna-9100",         phone: "+880-1830-000005", email: "info@epsilonoffice.com",         contact: "Jahanara Sultana"   },
];

const ITEMS_CATALOG = [
  { value: "1",  label: "Desktop Computer (Core i5)",    uom: "Pcs",  rate: 45000 },
  { value: "2",  label: "Laptop (Core i7, 16GB RAM)",    uom: "Pcs",  rate: 85000 },
  { value: "3",  label: "Executive Office Chair",        uom: "Pcs",  rate: 8500  },
  { value: "4",  label: 'Office Table (60"x30")',        uom: "Pcs",  rate: 12000 },
  { value: "5",  label: "A4 Paper (500 Sheets/Ream)",    uom: "Box",  rate: 350   },
  { value: "6",  label: "HP Printer Ink Cartridge Set",  uom: "Set",  rate: 2200  },
  { value: "7",  label: "Network Switch 24-Port (Cisco)",uom: "Pcs",  rate: 12000 },
  { value: "8",  label: "UPS 1000VA (APC)",              uom: "Pcs",  rate: 9500  },
  { value: "9",  label: "CAT6 Ethernet Cable (100m)",    uom: "Roll", rate: 1800  },
  { value: "10", label: 'Samsung 27" Monitor',           uom: "Pcs",  rate: 28000 },
  { value: "11", label: "Wireless Keyboard & Mouse Combo",uom: "Set", rate: 1800  },
  { value: "12", label: "External Hard Drive 1TB",       uom: "Pcs",  rate: 5500  },
];

const CURRENCIES = [
  { label: "BDT – Bangladeshi Taka", value: "BDT" },
  { label: "USD – US Dollar",        value: "USD" },
  { label: "EUR – Euro",             value: "EUR" },
  { label: "GBP – British Pound",    value: "GBP" },
  { label: "INR – Indian Rupee",     value: "INR" },
];

const PRIORITIES = [
  { label: "Normal", value: "normal" },
  { label: "High",   value: "high"   },
  { label: "Urgent", value: "urgent" },
];

const WAREHOUSES = [
  { label: "Main Warehouse – Dhaka (WH-01)",              value: "wh-01" },
  { label: "Secondary Warehouse – Chittagong (WH-02)",    value: "wh-02" },
  { label: "Distribution Center – Gazipur (WH-03)",       value: "wh-03" },
  { label: "Regional Depot – Sylhet (WH-04)",             value: "wh-04" },
];

const PAYMENT_TERMS = [
  { label: "Advance Payment (100%)",           value: "advance"   },
  { label: "50% Advance, 50% on Delivery",     value: "advance50" },
  { label: "Cash on Delivery (COD)",           value: "cod"       },
  { label: "Net 15 Days",                      value: "net15"     },
  { label: "Net 30 Days",                      value: "net30"     },
  { label: "Net 45 Days",                      value: "net45"     },
  { label: "Net 60 Days",                      value: "net60"     },
  { label: "Net 90 Days",                      value: "net90"     },
];

const SHIPPING_METHODS = [
  { label: "Road Transport",                value: "road"    },
  { label: "Air Freight",                   value: "air"     },
  { label: "Sea Freight",                   value: "sea"     },
  { label: "Rail Freight",                  value: "rail"    },
  { label: "Express Courier (DHL / FedEx)", value: "express" },
  { label: "Own Vehicle / Fleet",           value: "own"     },
];

const UOM_OPTIONS = [
  "Pcs","Kg","Ltr","Box","Set","M","Ft","Roll","Dozen","Bag","Carton","Pair",
].map((u) => ({ label: u, value: u }));

// ─── Mock data builder – generates pre-filled form data from an id ────────────
const ITEMS_POOL = [
  { catId: "3",  uom: "Pcs",  rate: 8500  },
  { catId: "4",  uom: "Pcs",  rate: 12000 },
  { catId: "5",  uom: "Box",  rate: 350   },
  { catId: "6",  uom: "Set",  rate: 2200  },
  { catId: "1",  uom: "Pcs",  rate: 45000 },
  { catId: "9",  uom: "Roll", rate: 1800  },
  { catId: "8",  uom: "Pcs",  rate: 9500  },
  { catId: "10", uom: "Pcs",  rate: 28000 },
];

function getMockFormData(id) {
  const n     = Math.max(1, parseInt(id) || 1);
  const supp  = SUPPLIERS[(n - 1) % 5];
  const base  = new Date(2025, n % 12, (n % 28) + 1);
  const toStr = (d) => d.toISOString().split("T")[0];

  // Form field values (labelInValue objects for dropdowns)
  const formData = {
    supplierId:      { label: supp.label, value: supp.value },
    poDate:          toStr(base),
    expectedDate:    toStr(new Date(base.getFullYear(), base.getMonth() + 1, base.getDate())),
    currency:        CURRENCIES[0],
    priority:        PRIORITIES[(n - 1) % 3],
    warehouse:       WAREHOUSES[(n - 1) % 3],
    paymentTerms:    PAYMENT_TERMS[(n - 1) % 4],
    shippingMethod:  SHIPPING_METHODS[(n - 1) % 3],
    referenceNo:     n % 3 === 0 ? `PQ-2025-${String(n).padStart(3, "0")}` : "",
    buyerRef:        n % 2 === 0 ? `PR-2025-${String(n).padStart(3, "0")}` : "",
    contactPerson:   supp.contact,
    supplierPhone:   supp.phone,
    supplierEmail:   supp.email,
    deliveryAddress: supp.address,
    internalNotes:   n % 4 === 0 ? "Expedite delivery – required for project deadline." : "",
    supplierNotes:   n % 5 === 0 ? "Please include material safety data sheets with each shipment." : "",
    shippingCost:    n % 3 === 0 ? 500 : 0,
  };

  // Line items
  const itemCount = 2 + (n % 4);
  const items = Array.from({ length: itemCount }, (_, i) => {
    const pool = ITEMS_POOL[(n + i) % 8];
    return {
      _id:         `existing-${n}-${i}`,
      itemId:      pool.catId,
      description: ITEMS_CATALOG.find((c) => c.value === pool.catId)?.label || "",
      uom:         pool.uom,
      qty:         1 + ((n + i) % 5),
      unitPrice:   pool.rate,
      discountPct: (n + i) % 3 === 0 ? 5 : 0,
      taxPct:      (n + i) % 2 === 0 ? 15 : 0,
    };
  });

  return { formData, items, poNo: "PO-" + String(1000 + n - 1) };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcLine = (row) => {
  const lineAmt   = (Number(row.qty) || 0) * (Number(row.unitPrice) || 0);
  const discAmt   = lineAmt * ((Number(row.discountPct) || 0) / 100);
  const afterDisc = lineAmt - discAmt;
  const taxAmt    = afterDisc * ((Number(row.taxPct) || 0) / 100);
  return { lineAmt, discAmt, afterDisc, taxAmt, total: afterDisc + taxAmt };
};

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Yup Schema (same as Create) ─────────────────────────────────────────────
const schema = yup.object({
  supplierId:     yup.mixed().test("required", "Supplier is required", (v) => v && v.value),
  poDate:         yup.string().required("PO Date is required"),
  expectedDate:   yup.string().required("Expected Delivery Date is required"),
  currency:       yup.mixed().nullable(),
  priority:       yup.mixed().nullable(),
  warehouse:      yup.mixed().nullable(),
  paymentTerms:   yup.mixed().nullable(),
  shippingMethod: yup.mixed().nullable(),
  referenceNo:    yup.string(),
  buyerRef:       yup.string(),
  contactPerson:  yup.string(),
  supplierPhone:  yup.string(),
  supplierEmail:  yup.string(),
  deliveryAddress:yup.string(),
  internalNotes:  yup.string(),
  supplierNotes:  yup.string(),
  shippingCost:   yup.number().min(0).typeError("Must be a number").default(0),
}).required();

// ─── Priority badge config ────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  normal: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  high:   { bg: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
  urgent: { bg: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500"     },
};

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

function StyledTextarea({ field, rows = 4, placeholder }) {
  return (
    <textarea
      {...field}
      rows={rows}
      placeholder={placeholder}
      style={{
        background: "var(--bg-surface)", color: "var(--text-primary)",
        border: "1px solid var(--border-strong)", borderRadius: 6,
        padding: "7px 10px", width: "100%", fontSize: 13,
        lineHeight: 1.5, resize: "vertical", outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(22,163,74,0.2)"; e.currentTarget.style.borderColor = "rgb(22 163 74)"; }}
      onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseOrderEdit() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // Pre-fill from mock data
  const { formData, items: initialItems, poNo } = useMemo(() => getMockFormData(id), [id]);

  const [items, setItems] = useState(initialItems);

  const {
    control, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  // Supplier auto-fill
  const handleSupplierChange = (val) => {
    const supp = SUPPLIERS.find((s) => s.value === val?.value);
    if (supp) {
      setValue("contactPerson",   supp.contact);
      setValue("supplierPhone",   supp.phone);
      setValue("supplierEmail",   supp.email);
      setValue("deliveryAddress", supp.address);
    }
  };

  // Items management
  const handleAddLine    = () => setItems((p) => [...p, { _id: Math.random().toString(36).slice(2), itemId: "", description: "", uom: "Pcs", qty: 1, unitPrice: 0, discountPct: 0, taxPct: 0 }]);
  const handleRemoveLine = (id_) => setItems((p) => p.filter((r) => r._id !== id_));
  const handleCellChange = (id_, field, value) =>
    setItems((prev) =>
      prev.map((row) => {
        if (row._id !== id_) return row;
        if (field === "itemId") {
          const item = ITEMS_CATALOG.find((it) => it.value === value);
          return { ...row, itemId: value, uom: item?.uom || "Pcs", unitPrice: item?.rate || 0, description: item?.label || "" };
        }
        return { ...row, [field]: value };
      })
    );

  // Totals
  const shippingCost    = Number(watch("shippingCost") || 0);
  const watchedPriority = watch("priority")?.value || "normal";
  const priorityStyle   = PRIORITY_STYLE[watchedPriority] || PRIORITY_STYLE.normal;

  const summary = useMemo(() => {
    let subtotal = 0, totalDiscount = 0, totalTax = 0;
    for (const row of items) {
      const { lineAmt, discAmt, taxAmt } = calcLine(row);
      subtotal      += lineAmt;
      totalDiscount += discAmt;
      totalTax      += taxAmt;
    }
    return { subtotal, totalDiscount, totalTax, grandTotal: subtotal - totalDiscount + totalTax + shippingCost };
  }, [items, shippingCost]);

  const onSubmit = (data) => {
    const hasItems = items.some((r) => r.itemId);
    if (!hasItems) { alert("Please add at least one item."); return; }
    alert(`Purchase Order ${poNo} updated successfully!`);
    navigate(`/purchase/order/${id}`);
  };

  return (
    <motion.div
      className="flex flex-col gap-5 pb-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* ══ Page Header ══════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Edit Purchase Order
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {poNo} &nbsp;·&nbsp; Editing Draft
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {watchedPriority.charAt(0).toUpperCase() + watchedPriority.slice(1)} Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button type="button" onClick={handleSubmit((d) => onSubmit(d))} disabled={isSubmitting} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" /> Update PO
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

        {/* ══ Row 1: Order Info + Supplier Info ════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Order Information */}
          <div className="lg:col-span-3 card space-y-4">
            <SectionHead icon={ClipboardList} label="Order Information" iconColor="text-emerald-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>PO Number</label>
                <input readOnly value={poNo} className="ctrl-input font-mono text-xs"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed" }} />
              </div>
              <FormDropdown name="priority"  control={control} label="Priority"            options={PRIORITIES}  placeholder="Select priority"  />
              <FormInput    name="poDate"     control={control} label="PO Date *"           type="date" />
              <FormInput    name="expectedDate" control={control} label="Expected Delivery Date *" type="date" />
              <FormDropdown name="currency"  control={control} label="Currency"            options={CURRENCIES}  placeholder="Select currency"  />
              <FormDropdown name="warehouse" control={control} label="Delivery Warehouse"  options={WAREHOUSES}  placeholder="Select warehouse" />
            </div>
          </div>

          {/* Supplier Information */}
          <div className="lg:col-span-2 card space-y-4">
            <SectionHead icon={Building2} label="Supplier Information" iconColor="text-blue-600" />
            <div className="flex flex-col gap-3 text-sm">
              <FormDropdown
                name="supplierId" control={control} label="Supplier *"
                options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                placeholder="Search & select supplier…"
                onChange={handleSupplierChange}
              />
              {errors.supplierId && <p className="text-xs text-red-500 -mt-2">{errors.supplierId.message}</p>}
              <FormInput name="contactPerson"   control={control} label="Contact Person"  placeholder="Contact person name" />
              <div className="grid grid-cols-2 gap-3">
                <FormInput name="supplierPhone" control={control} label="Phone"           placeholder="+880-XXXX-XXXXXX" />
                <FormInput name="supplierEmail" control={control} label="Email" type="email" placeholder="supplier@email.com" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Delivery Address</label>
                <Controller name="deliveryAddress" control={control}
                  render={({ field }) => <StyledTextarea field={field} rows={2} placeholder="Delivery address…" />} />
              </div>
            </div>
          </div>
        </div>

        {/* ══ Row 2: Purchase Terms ═════════════════════════════════════════ */}
        <div className="card space-y-4">
          <SectionHead icon={FileText} label="Purchase Terms & References" iconColor="text-violet-600" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 text-sm">
            <FormDropdown name="paymentTerms"  control={control} label="Payment Terms"           options={PAYMENT_TERMS}   placeholder="Select payment terms"  />
            <FormDropdown name="shippingMethod" control={control} label="Shipping Method"        options={SHIPPING_METHODS} placeholder="Select shipping method" />
            <FormInput    name="referenceNo"   control={control} label="Supplier Reference / PQ No." placeholder="e.g. PQ-2026-001" />
            <FormInput    name="buyerRef"      control={control} label="Internal Reference No."  placeholder="Internal ref / PR No." />
          </div>
        </div>

        {/* ══ Row 3: Order Items ════════════════════════════════════════════ */}
        <div className="card space-y-4">
          <SectionHead
            icon={Package} label="Order Items" iconColor="text-orange-600"
            badge={
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {items.length} line{items.length !== 1 ? "s" : ""}
                </span>
                <button type="button" onClick={handleAddLine} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Line
                </button>
              </div>
            }
          />
          <div className="overflow-x-auto rounded-lg -mx-1" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-xs border-collapse" style={{ minWidth: 920 }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  {[
                    { label: "#",           w: 36,  align: "center" },
                    { label: "Item *",      w: 200, align: "left"   },
                    { label: "Description", w: null,align: "left"   },
                    { label: "UOM",         w: 80,  align: "center" },
                    { label: "Qty *",       w: 72,  align: "right"  },
                    { label: "Unit Price",  w: 110, align: "right"  },
                    { label: "Disc %",      w: 72,  align: "right"  },
                    { label: "Tax %",       w: 72,  align: "right"  },
                    { label: "Amount",      w: 110, align: "right"  },
                    { label: "",            w: 40,  align: "center" },
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
                  const { total } = calcLine(row);
                  return (
                    <tr key={row._id} className="transition-colors"
                      style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-2.5 py-1.5 text-center font-medium" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                      <td className="px-2 py-1.5">
                        <select className="ctrl-input text-xs" value={row.itemId}
                          onChange={(e) => handleCellChange(row._id, "itemId", e.target.value)}>
                          <option value="">— Select item —</option>
                          {ITEMS_CATALOG.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="text" className="ctrl-input text-xs" value={row.description} placeholder="Add description…"
                          onChange={(e) => handleCellChange(row._id, "description", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <select className="ctrl-input text-xs text-center" value={row.uom}
                          onChange={(e) => handleCellChange(row._id, "uom", e.target.value)}>
                          {UOM_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="number" min="0.01" step="0.01" className="ctrl-input text-xs text-right" value={row.qty}
                          onChange={(e) => handleCellChange(row._id, "qty", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="number" min="0" step="0.01" className="ctrl-input text-xs text-right" value={row.unitPrice}
                          onChange={(e) => handleCellChange(row._id, "unitPrice", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="number" min="0" max="100" step="0.01" className="ctrl-input text-xs text-right" value={row.discountPct}
                          onChange={(e) => handleCellChange(row._id, "discountPct", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="number" min="0" max="100" step="0.01" className="ctrl-input text-xs text-right" value={row.taxPct}
                          onChange={(e) => handleCellChange(row._id, "taxPct", e.target.value)} />
                      </td>
                      <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>{fmt(total)}</td>
                      <td className="px-2 py-1.5 text-center">
                        <button type="button" onClick={() => handleRemoveLine(row._id)} disabled={items.length === 1}
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
                  <td colSpan={8} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Items Subtotal</td>
                  <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{fmt(summary.subtotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tip: Selecting an item auto-fills Unit Price and UOM from the catalog.</p>
        </div>

        {/* ══ Row 4: Notes + Summary ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Notes */}
          <div className="lg:col-span-3 card space-y-4">
            <SectionHead icon={FileText} label="Notes & Terms" iconColor="text-slate-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Internal Notes <span className="font-normal" style={{ color: "var(--text-muted)" }}>(not visible to supplier)</span>
                </label>
                <Controller name="internalNotes" control={control}
                  render={({ field }) => <StyledTextarea field={field} rows={5} placeholder="Add internal notes…" />} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Supplier Notes / Terms &amp; Conditions</label>
                <Controller name="supplierNotes" control={control}
                  render={({ field }) => <StyledTextarea field={field} rows={5} placeholder="Notes visible to supplier…" />} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 card flex flex-col">
            <SectionHead icon={Calculator} label="Order Summary" iconColor="text-emerald-600" />
            <div className="flex-1 flex flex-col justify-between mt-1">
              <div className="space-y-0.5">
                {[
                  { label: "Sub Total",       value: fmt(summary.subtotal),      cls: "" },
                  { label: "Total Discount",  value: `(${fmt(summary.totalDiscount)})`, cls: "text-red-500" },
                  { label: "Total Tax / VAT", value: `+ ${fmt(summary.totalTax)}`, cls: "" },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span className={`text-sm font-medium tabular-nums ${cls}`} style={!cls ? { color: "var(--text-primary)" } : {}}>{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Shipping / Freight Cost</span>
                  <Controller name="shippingCost" control={control}
                    render={({ field }) => (
                      <input {...field} type="number" min="0" step="0.01" className="ctrl-input text-right text-xs tabular-nums" style={{ width: 110 }} />
                    )} />
                </div>
                {errors.shippingCost && <p className="text-xs text-red-500 text-right">{errors.shippingCost.message}</p>}
              </div>
              <div className="mt-4 rounded-lg p-4"
                style={{ background: "linear-gradient(135deg,rgba(22,163,74,0.08) 0%,rgba(22,163,74,0.04) 100%)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Grand Total</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{watch("currency")?.value || "BDT"}</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 tabular-nums">{fmt(summary.grandTotal)}</p>
                </div>
                <div className="mt-2 pt-2 flex items-center justify-between text-xs border-t" style={{ borderColor: "rgba(22,163,74,0.2)", color: "var(--text-muted)" }}>
                  <span>{items.length} line item{items.length !== 1 ? "s" : ""}</span>
                  <span>Disc: {fmt(summary.totalDiscount)} · Tax: {fmt(summary.totalTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Footer Actions ════════════════════════════════════════════════ */}
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Fields marked with * are required.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-outline text-sm flex items-center gap-1.5">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-sm flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Update Purchase Order
            </button>
          </div>
        </div>

      </form>
    </motion.div>
  );
}
