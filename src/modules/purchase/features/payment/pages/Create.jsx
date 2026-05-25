import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, FileText, ClipboardList,
  Save, X, AlertCircle, CheckCircle2,
  CreditCard, Banknote, Landmark, Wallet,
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

const PAY_METHODS = [
  { label: "Cash",          value: "cash",   icon: Banknote  },
  { label: "Bank Transfer", value: "bank",   icon: Landmark  },
  { label: "Cheque / DD",   value: "cheque", icon: FileText  },
  { label: "Online / NEFT", value: "online", icon: CreditCard},
];

const BANK_ACCOUNTS = [
  { label: "Sonali Bank – Current A/C 0100123456 (Main)",      value: "ba-01" },
  { label: "Dutch-Bangla Bank – A/C 1005009876 (Operations)",  value: "ba-02" },
  { label: "Islami Bank – A/C 2050019001 (Payroll)",           value: "ba-03" },
  { label: "BRAC Bank – A/C 1501023456 (Projects)",            value: "ba-04" },
];

// Outstanding invoices per supplier (mock)
const SUPPLIER_INVOICES = {
  "1": [
    { invoiceId: "inv-1", poNo: "PO-1000", invoiceDate: new Date(2025, 2, 5),  invoiceAmt: 450000, prevPaid: 180000 },
    { invoiceId: "inv-2", poNo: "PO-1003", invoiceDate: new Date(2025, 3, 12), invoiceAmt: 85000,  prevPaid: 0      },
  ],
  "2": [
    { invoiceId: "inv-3", poNo: "PO-1007", invoiceDate: new Date(2025, 1, 20), invoiceAmt: 35000,  prevPaid: 10000  },
    { invoiceId: "inv-4", poNo: "PO-1010", invoiceDate: new Date(2025, 3, 1),  invoiceAmt: 220000, prevPaid: 0      },
  ],
  "3": [
    { invoiceId: "inv-5", poNo: "PO-1014", invoiceDate: new Date(2025, 2, 28), invoiceAmt: 144000, prevPaid: 72000  },
  ],
  "4": [
    { invoiceId: "inv-6", poNo: "PO-1021", invoiceDate: new Date(2025, 4, 2),  invoiceAmt: 68000,  prevPaid: 0      },
  ],
  "5": [
    { invoiceId: "inv-7", poNo: "PO-1030", invoiceDate: new Date(2025, 3, 18), invoiceAmt: 92500,  prevPaid: 30000  },
    { invoiceId: "inv-8", poNo: "PO-1033", invoiceDate: new Date(2025, 4, 5),  invoiceAmt: 18000,  prevPaid: 0      },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genPVNo = () => `PV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
const TODAY   = new Date().toISOString().split("T")[0];
const PV_NO   = genPVNo();
const fmt     = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const newAllocationRow = (inv) => ({
  ...inv,
  outstanding: inv.invoiceAmt - inv.prevPaid,
  paymentAmt:  inv.invoiceAmt - inv.prevPaid,
});

// ─── Yup Schemas ─────────────────────────────────────────────────────────────
const settlementSchema = yup.object({
  supplierId:   yup.mixed().test("req", "Supplier is required", (v) => v && v.value),
  paymentDate:  yup.string().required("Payment Date is required"),
  paymentMethod:yup.mixed().test("req", "Payment Method is required", (v) => v && v.value),
  bankAccount:  yup.mixed().nullable(),
  transactionRef:yup.string(),
  chequeNo:     yup.string(),
  chequeDate:   yup.string(),
  remarks:      yup.string(),
}).required();

const advanceSchema = yup.object({
  supplierId:    yup.mixed().test("req", "Supplier is required", (v) => v && v.value),
  paymentDate:   yup.string().required("Payment Date is required"),
  paymentMethod: yup.mixed().test("req", "Payment Method is required", (v) => v && v.value),
  advanceAmount: yup.number().min(0.01, "Amount must be > 0").typeError("Enter a valid amount").required("Amount is required"),
  bankAccount:   yup.mixed().nullable(),
  transactionRef:yup.string(),
  chequeNo:      yup.string(),
  chequeDate:    yup.string(),
  purpose:       yup.string(),
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
    <textarea {...field} rows={rows} placeholder={placeholder}
      style={{
        background: "var(--bg-surface)", color: "var(--text-primary)",
        border: "1px solid var(--border-strong)", borderRadius: 6,
        padding: "7px 10px", width: "100%", fontSize: 13, lineHeight: 1.5,
        resize: "vertical", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(37,99,235,0.18)"; e.currentTarget.style.borderColor = "rgb(37 99 235)"; }}
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

// ─── Payment Method Selector ─────────────────────────────────────────────────
function PayMethodSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        Payment Method *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PAY_METHODS.map((m) => {
          const active = value?.value === m.value;
          return (
            <button key={m.value} type="button" onClick={() => onChange({ label: m.label, value: m.value })}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all text-xs font-medium"
              style={{
                borderColor: active ? "#2563eb" : "var(--border)",
                background:  active ? "rgba(37,99,235,0.06)" : "var(--bg-surface)",
                color:       active ? "#1d4ed8" : "var(--text-secondary)",
              }}>
              <m.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {m.label}
              {active && <CheckCircle2 className="w-3 h-3 ml-auto text-blue-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Invoice Allocation Table ─────────────────────────────────────────────────
function InvoiceAllocationTable({ rows, onChangeAmt, totalPayment }) {
  const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);
  const remaining = totalPayment - rows.reduce((s, r) => s + (Number(r.paymentAmt) || 0), 0);
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-xs border-collapse" style={{ minWidth: 680 }}>
          <thead>
            <tr style={{ background: "var(--bg-elevated)" }}>
              {[
                { l: "#",              a: "center", w: 36  },
                { l: "PO No.",         a: "left",   w: null },
                { l: "Invoice Date",   a: "left",   w: 110 },
                { l: "Invoice Amount", a: "right",  w: 130 },
                { l: "Previously Paid",a: "right",  w: 130 },
                { l: "Outstanding",    a: "right",  w: 120 },
                { l: "Payment Amount", a: "right",  w: 130 },
              ].map((col) => (
                <th key={col.l} className="px-3 py-2.5 font-semibold whitespace-nowrap"
                  style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: col.a, width: col.w || undefined }}>
                  {col.l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.invoiceId} style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="px-3 py-2 text-center" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                <td className="px-3 py-2 font-mono font-semibold text-emerald-600">{row.poNo}</td>
                <td className="px-3 py-2" style={{ color: "var(--text-secondary)" }}>
                  {row.invoiceDate.toLocaleDateString("en-BD")}
                </td>
                <td className="px-3 py-2 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  ৳ {fmt(row.invoiceAmt)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>
                  ৳ {fmt(row.prevPaid)}
                </td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums"
                  style={{ color: row.outstanding === 0 ? "#16a34a" : "var(--text-primary)" }}>
                  ৳ {fmt(row.outstanding)}
                </td>
                <td className="px-2.5 py-1.5">
                  <input type="number" min="0" max={row.outstanding} step="0.01"
                    className="ctrl-input text-xs text-right"
                    value={row.paymentAmt}
                    onChange={(e) => onChangeAmt(row.invoiceId, Math.min(Number(e.target.value), row.outstanding))}
                    style={{ background: Number(row.paymentAmt) > row.outstanding ? "#fee2e2" : undefined }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={3} className="px-3 py-2.5 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Totals</td>
              <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                ৳ {fmt(rows.reduce((s, r) => s + r.invoiceAmt, 0))}
              </td>
              <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-muted)" }}>
                ৳ {fmt(rows.reduce((s, r) => s + r.prevPaid, 0))}
              </td>
              <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums text-blue-600">
                ৳ {fmt(totalOutstanding)}
              </td>
              <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums text-blue-600">
                ৳ {fmt(rows.reduce((s, r) => s + (Number(r.paymentAmt) || 0), 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {remaining !== 0 && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${remaining > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {remaining > 0
            ? `৳ ${fmt(remaining)} of the entered payment amount is unallocated.`
            : `Allocated amount exceeds total by ৳ ${fmt(Math.abs(remaining))}.`}
        </div>
      )}
    </div>
  );
}

// ─── Bank / Cheque Fields ─────────────────────────────────────────────────────
function BankChequeFields({ method, control }) {
  if (!method || method === "cash") return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-1">
      {(method === "bank" || method === "online" || method === "cheque") && (
        <FormDropdown name="bankAccount" control={control} label="Bank Account"
          options={BANK_ACCOUNTS} placeholder="Select bank account..." />
      )}
      {(method === "bank" || method === "online") && (
        <FormInput name="transactionRef" control={control} label="Transaction / UTR Ref No." placeholder="e.g. TXN2026001234" />
      )}
      {method === "cheque" && (
        <>
          <FormInput name="chequeNo"   control={control} label="Cheque No."  placeholder="e.g. 0012345678" />
          <FormInput name="chequeDate" control={control} label="Cheque Date" type="date" />
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchasePaymentCreate() {
  const navigate     = useNavigate();
  const [paymentType, setPaymentType] = useState("settlement");

  // ── Settlement state
  const [selectedSupplier,  setSelectedSupplier]  = useState(null);
  const [allocationRows,    setAllocationRows]    = useState([]);
  const [supplierInfo,      setSupplierInfo]      = useState(null);

  // ── Settlement form
  const sForm = useForm({
    resolver: yupResolver(settlementSchema),
    defaultValues: { supplierId: null, paymentDate: TODAY, paymentMethod: null, bankAccount: null, transactionRef: "", chequeNo: "", chequeDate: "", remarks: "" },
  });
  const sMethod = sForm.watch("paymentMethod")?.value;

  // ── Advance form
  const aForm = useForm({
    resolver: yupResolver(advanceSchema),
    defaultValues: { supplierId: null, paymentDate: TODAY, paymentMethod: null, advanceAmount: "", bankAccount: null, transactionRef: "", chequeNo: "", chequeDate: "", purpose: "", remarks: "" },
  });
  const aMethod = aForm.watch("paymentMethod")?.value;

  const handleSupplierSelect = (opt) => {
    if (!opt?.value) { setSelectedSupplier(null); setAllocationRows([]); setSupplierInfo(null); return; }
    const supp = SUPPLIERS.find((s) => s.value === opt.value);
    setSelectedSupplier(opt);
    setSupplierInfo(supp);
    const invoices = SUPPLIER_INVOICES[opt.value] || [];
    setAllocationRows(invoices.filter((inv) => inv.invoiceAmt - inv.prevPaid > 0).map(newAllocationRow));
  };

  const handleAllocChange = (invoiceId, value) =>
    setAllocationRows((p) => p.map((r) => r.invoiceId !== invoiceId ? r : { ...r, paymentAmt: value }));

  const totalAllocated  = useMemo(() => allocationRows.reduce((s, r) => s + (Number(r.paymentAmt) || 0), 0), [allocationRows]);
  const totalOutstanding = useMemo(() => allocationRows.reduce((s, r) => s + r.outstanding, 0), [allocationRows]);

  const onSubmitSettlement = (data) => {
    if (allocationRows.length === 0) { alert("Please select a supplier with outstanding invoices."); return; }
    if (totalAllocated === 0) { alert("Please enter payment amount for at least one invoice."); return; }
    console.log("PV Payload (Settlement):", { pvNo: PV_NO, type: "settlement", ...data, supplierId: data.supplierId?.value, paymentMethod: data.paymentMethod?.value, bankAccount: data.bankAccount?.value, allocations: allocationRows, totalAllocated });
    alert(`Payment Voucher saved!\nPV No: ${PV_NO}`);
    navigate("/purchase/payment");
  };

  const onSubmitAdvance = (data) => {
    console.log("PV Payload (Advance):", { pvNo: PV_NO, type: "advance", ...data, supplierId: data.supplierId?.value, paymentMethod: data.paymentMethod?.value, bankAccount: data.bankAccount?.value });
    alert(`Advance Payment Voucher saved!\nPV No: ${PV_NO}`);
    navigate("/purchase/payment");
  };

  const handleSave = () => {
    if (paymentType === "settlement") sForm.handleSubmit(onSubmitSettlement)();
    else aForm.handleSubmit(onSubmitAdvance)();
  };

  const isSubmitting = paymentType === "settlement" ? sForm.formState.isSubmitting : aForm.formState.isSubmitting;

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
              Create Payment Voucher
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {PV_NO} &nbsp;·&nbsp; New Document &nbsp;·&nbsp; Draft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate("/purchase/payment")} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={isSubmitting} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Save Payment
          </button>
        </div>
      </div>

      {/* Type Selector */}
      <div className="card">
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Select Payment Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {[
            {
              key: "settlement", icon: ClipboardList,
              title: "Invoice Settlement",
              desc: "Pay against one or more outstanding Purchase Orders / invoices. Allocate amounts per invoice.",
              iconColor: "text-blue-600", activeColor: "#2563eb", activeBg: "rgba(37,99,235,0.06)",
            },
            {
              key: "advance", icon: Wallet,
              title: "Advance Payment",
              desc: "Pay supplier in advance before receiving goods or invoice — for deposits or pre-orders.",
              iconColor: "text-amber-600", activeColor: "#d97706", activeBg: "rgba(217,119,6,0.06)",
            },
          ].map((opt) => {
            const active = paymentType === opt.key;
            return (
              <button key={opt.key} type="button" onClick={() => setPaymentType(opt.key)}
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

      {/* ══ Invoice Settlement Form ══════════════════════════════════════════ */}
      {paymentType === "settlement" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Payment Info */}
            <div className="lg:col-span-3 card space-y-5">
              <SectionHead icon={ClipboardList} label="Payment Information" iconColor="text-blue-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <ReadonlyField label="PV Number" value={PV_NO} mono />
                <FormInput name="paymentDate" control={sForm.control} label="Payment Date *" type="date" />
                <div className="sm:col-span-2">
                  <FormDropdown name="supplierId" control={sForm.control} label="Supplier *"
                    options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                    placeholder="Select supplier to load outstanding invoices..."
                    onChange={handleSupplierSelect}
                  />
                  {sForm.formState.errors.supplierId && (
                    <p className="text-xs text-red-500 mt-1">{sForm.formState.errors.supplierId.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Controller name="paymentMethod" control={sForm.control}
                  render={({ field }) => <PayMethodSelector value={field.value} onChange={field.onChange} />}
                />
                {sForm.formState.errors.paymentMethod && (
                  <p className="text-xs text-red-500 mt-1">{sForm.formState.errors.paymentMethod.message}</p>
                )}
              </div>
              <BankChequeFields method={sMethod} control={sForm.control} />
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks</label>
                <Controller name="remarks" control={sForm.control}
                  render={({ field }) => <StyledTextarea field={field} rows={2} placeholder="Payment remarks or notes..." />}
                />
              </div>
            </div>

            {/* Supplier / Summary Panel */}
            <div className="lg:col-span-2 card space-y-4">
              <SectionHead icon={Building2} label="Supplier & Balance" iconColor="text-emerald-600" />
              {supplierInfo ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{supplierInfo.label}</p>
                    <div className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <p>Contact: {supplierInfo.contact}</p>
                      <p>Phone: {supplierInfo.phone}</p>
                      <p>Email: {supplierInfo.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                      <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{allocationRows.length}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Outstanding Inv.</p>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)" }}>
                      <p className="text-base font-bold text-blue-600">৳ {fmt(totalOutstanding)}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Total Outstanding</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Allocated Amount</span>
                      <span className="text-lg font-bold text-blue-600">৳ {fmt(totalAllocated)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <Landmark className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No Supplier Selected</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Select a supplier to view outstanding invoices for allocation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Allocation */}
          {allocationRows.length > 0 && (
            <div className="card space-y-4">
              <SectionHead icon={FileText} label="Invoice Allocation" iconColor="text-blue-600"
                badge={
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    {allocationRows.length} invoice{allocationRows.length !== 1 ? "s" : ""}
                  </span>
                }
              />
              <InvoiceAllocationTable rows={allocationRows} onChangeAmt={handleAllocChange} totalPayment={totalAllocated} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Payment Amount per invoice cannot exceed the Outstanding balance. Edit amounts as needed.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══ Advance Payment Form ═════════════════════════════════════════════ */}
      {paymentType === "advance" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Payment Info */}
          <div className="lg:col-span-3 card space-y-5">
            <SectionHead icon={ClipboardList} label="Payment Information" iconColor="text-amber-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <ReadonlyField label="PV Number" value={PV_NO} mono />
              <FormInput name="paymentDate" control={aForm.control} label="Payment Date *" type="date" />
              <div className="sm:col-span-2">
                <FormDropdown name="supplierId" control={aForm.control} label="Supplier *"
                  options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                  placeholder="Select supplier..."
                />
                {aForm.formState.errors.supplierId && (
                  <p className="text-xs text-red-500 mt-1">{aForm.formState.errors.supplierId.message}</p>
                )}
              </div>
              <FormInput name="purpose" control={aForm.control} label="Purpose / For PO / Description" placeholder="e.g. Advance for PO-2026-001" />
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Advance Amount (৳) *
                </label>
                <Controller name="advanceAmount" control={aForm.control}
                  render={({ field }) => (
                    <input {...field} type="number" min="0.01" step="0.01" placeholder="0.00"
                      className="ctrl-input text-sm font-semibold text-right"
                      style={{ color: "var(--text-primary)" }}
                    />
                  )}
                />
                {aForm.formState.errors.advanceAmount && (
                  <p className="text-xs text-red-500 mt-1">{aForm.formState.errors.advanceAmount.message}</p>
                )}
              </div>
            </div>
            <div>
              <Controller name="paymentMethod" control={aForm.control}
                render={({ field }) => <PayMethodSelector value={field.value} onChange={field.onChange} />}
              />
              {aForm.formState.errors.paymentMethod && (
                <p className="text-xs text-red-500 mt-1">{aForm.formState.errors.paymentMethod.message}</p>
              )}
            </div>
            <BankChequeFields method={aMethod} control={aForm.control} />
          </div>

          {/* Summary + Remarks */}
          <div className="lg:col-span-2 card space-y-4">
            <SectionHead icon={Wallet} label="Advance Summary" iconColor="text-amber-600" />
            <div className="p-4 rounded-xl" style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.18)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Advance Amount</p>
              <p className="text-2xl font-bold text-amber-600">
                ৳ {fmt(aForm.watch("advanceAmount") || 0)}
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                This payment will be recorded as an advance and can be adjusted against future invoices from this supplier.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks / Notes</label>
              <Controller name="remarks" control={aForm.control}
                render={({ field }) => <StyledTextarea field={field} rows={6} placeholder="Purpose, approval references, conditions for advance..." />}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Fields marked with * are required.
          {paymentType === "settlement"
            ? " Allocate payment amounts against outstanding invoices."
            : " Enter the advance amount to pay to the supplier."}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate("/purchase/payment")} className="btn-outline text-sm flex items-center gap-1.5">
            <X className="w-4 h-4" /> Discard
          </button>
          <button type="button" onClick={handleSave} disabled={isSubmitting} className="btn-primary text-sm flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Payment
          </button>
        </div>
      </div>
    </motion.div>
  );
}
