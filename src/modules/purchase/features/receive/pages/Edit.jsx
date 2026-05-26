import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Trash2, Package, Building2,
  FileText, ClipboardList, Save, X,
  AlertCircle, CheckCircle2, Truck, ShoppingCart,
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
  { label: "Good", value: "good" }, { label: "Acceptable", value: "acceptable" },
  { label: "Damaged", value: "damaged" }, { label: "Partial Defect", value: "partial" },
];
const APPROVED_POS = [
  { value: "po-1000", label: "PO-1000", supplierId: "1", supplierName: "Alpha Tech Supplies", warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" } },
  { value: "po-1003", label: "PO-1003", supplierId: "2", supplierName: "Beta Trading Co. Ltd.", warehouse: { label: "Main Warehouse – Dhaka (WH-01)", value: "wh-01" } },
  { value: "po-1007", label: "PO-1007", supplierId: "3", supplierName: "Gamma Electronics Ltd.", warehouse: { label: "Distribution Center – Gazipur (WH-03)", value: "wh-03" } },
];
const UOM_OPTIONS = ["Pcs","Kg","Ltr","Box","Set","M","Ft","Roll","Dozen","Bag","Carton","Pair"].map((u) => ({ label: u, value: u }));
const SUPP_NAMES  = ["Alpha Tech Supplies","Beta Trading Co. Ltd.","Gamma Electronics Ltd.","Delta Logistics Inc.","Epsilon Office Solutions"];
const ITEM_NAMES  = ["Desktop Computer (Core i5)","Laptop (Core i7, 16GB RAM)","Executive Office Chair",'Office Table (60"x30")','A4 Paper (500 Sheets/Ream)',"HP Printer Ink Cartridge Set","Network Switch 24-Port (Cisco)","UPS 1000VA (APC)","CAT6 Ethernet Cable (100m)",'Samsung 27" Monitor',"Wireless Keyboard & Mouse Combo","External Hard Drive 1TB"];
const WH_NAMES    = ["Main Warehouse – Dhaka (WH-01)","Secondary Warehouse – Chittagong (WH-02)","Distribution Center – Gazipur (WH-03)"];

// ─── Mock Form Data Generator ─────────────────────────────────────────────────
function getMockFormData(id) {
  const n         = Number(id) || 1;
  const isOrder   = n % 3 !== 2;
  const suppIdx   = n % SUPP_NAMES.length;
  const itemCount = 2 + (n % 3);
  const d         = new Date(2025, n % 12, (n % 28) + 1);
  const dateStr   = d.toISOString().split("T")[0];

  const items = Array.from({ length: itemCount }, (_, i) => {
    const itemIdx   = (n + i) % ITEM_NAMES.length;
    const catItem   = ITEMS_CATALOG[itemIdx];
    if (isOrder) {
      const poQty   = 5 + ((n + i) % 15);
      const prevRcvd= Math.floor(poQty * 0.3);
      return {
        _id:          String(i + 1),
        itemId:       String(itemIdx + 1),
        itemName:     ITEM_NAMES[itemIdx],
        uom:          ["Pcs","Box","Set","Roll"][i % 4],
        poQty,
        prevReceived: prevRcvd,
        pendingQty:   poQty - prevRcvd,
        receiveQty:   poQty - prevRcvd,
        condition:    "good",
        remarks:      "",
      };
    } else {
      const rcvQty = 3 + ((n + i) % 12);
      return {
        _id:         String(i + 1),
        itemId:      String(itemIdx + 1),
        itemName:    ITEM_NAMES[itemIdx],
        description: ITEM_NAMES[itemIdx],
        uom:         catItem?.uom || "Pcs",
        receiveQty:  rcvQty,
        unitCost:    catItem?.rate || 1000,
        batchNo:     `BT-${String(n + i).padStart(4, "0")}`,
        remarks:     "",
      };
    }
  });

  const poRef = APPROVED_POS[n % APPROVED_POS.length];

  return {
    grnNo: `GRN-${2000 + n}`,
    receiveType: isOrder ? "order_based" : "direct",
    formData: isOrder
      ? {
          poId:        { label: `${poRef.label} – ${poRef.supplierName}`, value: poRef.value },
          receiveDate: dateStr,
          warehouse:   poRef.warehouse,
          receivedBy:  "Karim Ahmed",
          vehicleNo:   `DHA-1${String(n).padStart(4, "0")}`,
          remarks:     "",
        }
      : {
          supplierId:    { label: SUPP_NAMES[suppIdx], value: String(suppIdx + 1) },
          warehouse:     { label: WH_NAMES[n % WH_NAMES.length], value: ["wh-01","wh-02","wh-03"][n % 3] },
          receiveDate:   dateStr,
          vendorInvoice: `INV-2025-${String(n).padStart(4, "0")}`,
          receivedBy:    "Nasrin Akhter",
          vehicleNo:     `CTG-2${String(n).padStart(4, "0")}`,
          remarks:       "",
        },
    items,
    supplierName: isOrder ? poRef.supplierName : SUPP_NAMES[suppIdx],
  };
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
      onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(22,163,74,0.2)"; e.currentTarget.style.borderColor = "rgb(22 163 74)"; }}
      onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseReceiveEdit() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const mock     = getMockFormData(id);

  const [items, setItems] = useState(mock.items);

  const isOrderBased = mock.receiveType === "order_based";

  const schema = isOrderBased ? orderBasedSchema : directSchema;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: mock.formData,
  });

  const handleCellChange = (rowId, field, value) =>
    setItems((p) =>
      p.map((r) => {
        if (r._id !== rowId) return r;
        if (field === "__item__") {
          const item = value;
          return item ? { ...r, itemId: item.value, itemName: item.label, uom: item.uom, unitCost: item.rate, description: item.label } : r;
        }
        if (field === "receiveQty" && isOrderBased) {
          return { ...r, receiveQty: Math.min(Number(value), r.pendingQty) };
        }
        return { ...r, [field]: value };
      })
    );

  const totalQty  = items.reduce((s, r) => s + (Number(r.receiveQty) || 0), 0);
  const totalCost = isOrderBased ? null : items.reduce((s, r) => s + (Number(r.receiveQty) || 0) * (Number(r.unitCost) || 0), 0);

  const onSubmit = (data) => {
    console.log("GRN Edit Payload:", { grnNo: mock.grnNo, type: mock.receiveType, ...data, items });
    alert(`GRN ${mock.grnNo} updated successfully!`);
    navigate(`/purchase/receive/${id}`);
  };

  return (
    <motion.div
      className="flex flex-col gap-5 pb-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* ══ Header ════════════════════════════════════════════════════════════ */}
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
              Edit Goods Receive Note
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              <span className="font-mono">{mock.grnNo}</span>
              &nbsp;·&nbsp;
              <span className={isOrderBased ? "text-blue-600" : "text-orange-600"}>
                {isOrderBased ? "Order Based" : "Direct"} Receive
              </span>
              &nbsp;·&nbsp; Draft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(`/purchase/receive/${id}`)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* ══ Type Indicator ════════════════════════════════════════════════════ */}
      <div className="card">
        <div
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: isOrderBased ? "rgba(59,130,246,0.08)" : "rgba(249,115,22,0.08)", border: `1px solid ${isOrderBased ? "rgba(59,130,246,0.25)" : "rgba(249,115,22,0.25)"}` }}
        >
          {isOrderBased ? <ClipboardList className="w-4 h-4 text-blue-600" /> : <Truck className="w-4 h-4 text-orange-600" />}
          <span style={{ color: isOrderBased ? "#1d4ed8" : "#c2410c" }}>
            {isOrderBased ? "Order Based Receive" : "Direct Receive"} — Receive type cannot be changed in edit mode.
          </span>
        </div>
      </div>

      {/* ══ Form ══════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {/* GRN Info + Supplier/PO Details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 card space-y-4">
            <SectionHead icon={ClipboardList} label="GRN Information" iconColor="text-emerald-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <ReadonlyField label="GRN Number" value={mock.grnNo} mono />

              {isOrderBased ? (
                <>
                  <FormDropdown
                    name="poId"
                    control={control}
                    label="Purchase Order *"
                    options={APPROVED_POS.map((p) => ({ label: `${p.label} – ${p.supplierName}`, value: p.value }))}
                    placeholder="Select approved PO..."
                  />
                  {errors.poId && <p className="text-xs text-red-500 -mt-2 sm:col-span-2">{errors.poId.message}</p>}
                </>
              ) : (
                <>
                  <FormDropdown
                    name="supplierId"
                    control={control}
                    label="Supplier *"
                    options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                    placeholder="Select supplier..."
                  />
                  {errors.supplierId && <p className="text-xs text-red-500 -mt-2">{errors.supplierId.message}</p>}
                </>
              )}

              <FormInput name="receiveDate" control={control} label="Receive Date *" type="date" />
              <FormInput name="receivedBy"  control={control} label="Received By"   placeholder="Name of receiver" />
              <FormInput name="vehicleNo"   control={control} label="Vehicle No."   placeholder="e.g. DHA-12345" />

              {isOrderBased ? (
                <Controller
                  name="warehouse"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Delivery Warehouse</label>
                      <div className="ctrl-input text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed" }}>
                        {field.value?.label || "Auto-filled from PO"}
                      </div>
                    </div>
                  )}
                />
              ) : (
                <>
                  <FormDropdown name="warehouse" control={control} label="Warehouse *" options={WAREHOUSES} placeholder="Select warehouse..." />
                  {errors.warehouse && <p className="text-xs text-red-500 -mt-2">{errors.warehouse.message}</p>}
                  <FormInput name="vendorInvoice" control={control} label="Vendor Invoice / Ref No." placeholder="e.g. INV-2026-001" />
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 card space-y-4">
            <SectionHead icon={Building2} label={isOrderBased ? "Supplier & PO Details" : "Summary"} iconColor="text-blue-600" />
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{mock.supplierName}</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-2.5 rounded-lg text-center" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xl font-bold text-emerald-600">{totalQty}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Total Qty</p>
                  </div>
                  <div className="p-2.5 rounded-lg text-center" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{items.length}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Line Items</p>
                  </div>
                </div>
                {!isOrderBased && totalCost != null && (
                  <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Total Cost</p>
                    <p className="text-lg font-bold text-emerald-600">৳ {fmt(totalCost)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks</label>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field }) => <StyledTextarea field={field} rows={4} placeholder="Additional remarks..." />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="card space-y-4">
          <SectionHead
            icon={Package}
            label="Items"
            iconColor="text-orange-600"
            badge={
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {items.length} line{items.length !== 1 ? "s" : ""}
                </span>
                {!isOrderBased && (
                  <button type="button" onClick={() => setItems((p) => [...p, { _id: Math.random().toString(36).slice(2), itemId: "", itemName: "", description: "", uom: "Pcs", receiveQty: 1, unitCost: 0, batchNo: "", remarks: "" }])} className="btn-outline text-xs px-3 py-1.5">
                    + Add Line
                  </button>
                )}
              </div>
            }
          />
          <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-xs border-collapse" style={{ minWidth: isOrderBased ? 800 : 900 }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  {(isOrderBased
                    ? [
                        { label: "#", align: "center" }, { label: "Item", align: "left" }, { label: "UOM", align: "center" },
                        { label: "PO Qty", align: "right" }, { label: "Prev. Received", align: "right" },
                        { label: "Pending Qty", align: "right" }, { label: "Receive Qty *", align: "right" },
                        { label: "Condition", align: "center" }, { label: "Remarks", align: "left" },
                      ]
                    : [
                        { label: "#", align: "center" }, { label: "Item *", align: "left" },
                        { label: "Description", align: "left" }, { label: "UOM", align: "center" },
                        { label: "Receive Qty *", align: "right" }, { label: "Unit Cost", align: "right" },
                        { label: "Total Cost", align: "right" }, { label: "Batch No.", align: "left" },
                        { label: "Remarks", align: "left" }, { label: "", align: "center" },
                      ]
                  ).map((col) => (
                    <th
                      key={col.label}
                      className="px-2.5 py-2.5 font-semibold whitespace-nowrap"
                      style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.align }}
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

                    {isOrderBased ? (
                      <td className="px-2.5 py-2 font-medium" style={{ color: "var(--text-primary)" }}>{row.itemName}</td>
                    ) : (
                      <td className="px-2 py-1.5">
                        <select
                          className="ctrl-input text-xs"
                          value={row.itemId}
                          onChange={(e) => {
                            const item = ITEMS_CATALOG.find((it) => it.value === e.target.value);
                            handleCellChange(row._id, "__item__", item);
                          }}
                        >
                          <option value="">— Select item —</option>
                          {ITEMS_CATALOG.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
                        </select>
                      </td>
                    )}

                    {!isOrderBased && (
                      <td className="px-2 py-1.5">
                        <input type="text" className="ctrl-input text-xs" value={row.description || ""} placeholder="Description..." onChange={(e) => handleCellChange(row._id, "description", e.target.value)} />
                      </td>
                    )}

                    {isOrderBased ? (
                      <td className="px-2.5 py-2 text-center" style={{ color: "var(--text-muted)" }}>{row.uom}</td>
                    ) : (
                      <td className="px-2 py-1.5">
                        <select className="ctrl-input text-xs text-center" value={row.uom} onChange={(e) => handleCellChange(row._id, "uom", e.target.value)}>
                          {UOM_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                      </td>
                    )}

                    {isOrderBased && (
                      <>
                        <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{row.poQty}</td>
                        <td className="px-2.5 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{row.prevReceived}</td>
                        <td className="px-2.5 py-2 text-right font-semibold tabular-nums" style={{ color: "var(--text-secondary)" }}>{row.pendingQty}</td>
                      </>
                    )}

                    <td className="px-2 py-1.5">
                      <input
                        type="number" min="0"
                        max={isOrderBased ? row.pendingQty : undefined}
                        step="0.01"
                        className="ctrl-input text-xs text-right"
                        value={row.receiveQty}
                        onChange={(e) => handleCellChange(row._id, "receiveQty", e.target.value)}
                      />
                    </td>

                    {isOrderBased ? (
                      <>
                        <td className="px-2 py-1.5">
                          <select className="ctrl-input text-xs" value={row.condition} onChange={(e) => handleCellChange(row._id, "condition", e.target.value)}>
                            {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="text" className="ctrl-input text-xs" value={row.remarks || ""} placeholder="Optional..." onChange={(e) => handleCellChange(row._id, "remarks", e.target.value)} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-1.5">
                          <input type="number" min="0" step="0.01" className="ctrl-input text-xs text-right" value={row.unitCost || 0} onChange={(e) => handleCellChange(row._id, "unitCost", e.target.value)} />
                        </td>
                        <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                          {fmt((Number(row.receiveQty) || 0) * (Number(row.unitCost) || 0))}
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="text" className="ctrl-input text-xs" value={row.batchNo || ""} placeholder="Batch / Lot No." onChange={(e) => handleCellChange(row._id, "batchNo", e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="text" className="ctrl-input text-xs" value={row.remarks || ""} placeholder="Optional..." onChange={(e) => handleCellChange(row._id, "remarks", e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <button type="button" onClick={() => setItems((p) => p.filter((r) => r._id !== row._id))} disabled={items.length === 1} className="p-1 rounded transition-colors text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-25 disabled:cursor-not-allowed">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
                  {isOrderBased ? (
                    <>
                      <td colSpan={6} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Total Receive Qty</td>
                      <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-emerald-600">{totalQty}</td>
                      <td colSpan={2} />
                    </>
                  ) : (
                    <>
                      <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Totals</td>
                      <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums text-emerald-600">{fmt(totalQty)}</td>
                      <td />
                      <td className="px-2.5 py-2 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{fmt(totalCost)}</td>
                      <td colSpan={3} />
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Fields marked with * are required. Only Draft GRNs can be edited.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate(`/purchase/receive/${id}`)} className="btn-outline text-sm flex items-center gap-1.5">
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
