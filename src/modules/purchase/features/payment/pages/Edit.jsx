import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
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
const PAY_METHODS_LIST = [
  { label: "Cash",          value: "cash",   icon: Banknote   },
  { label: "Bank Transfer", value: "bank",   icon: Landmark   },
  { label: "Cheque / DD",   value: "cheque", icon: FileText   },
  { label: "Online / NEFT", value: "online", icon: CreditCard },
];
const BANK_ACCOUNTS = [
  { label: "Sonali Bank – Current A/C 0100123456 (Main)",      value: "ba-01" },
  { label: "Dutch-Bangla Bank – A/C 1005009876 (Operations)",  value: "ba-02" },
  { label: "Islami Bank – A/C 2050019001 (Payroll)",           value: "ba-03" },
  { label: "BRAC Bank – A/C 1501023456 (Projects)",            value: "ba-04" },
];
const PO_POOL      = ["PO-1000","PO-1003","PO-1007","PO-1010","PO-1014","PO-1021","PO-1030"];
const SUPP_NAMES   = ["Alpha Tech Supplies","Beta Trading Co. Ltd.","Gamma Electronics Ltd.","Delta Logistics Inc.","Epsilon Office Solutions"];
const BANK_NAMES   = ["Sonali Bank – A/C 0100123456","Dutch-Bangla Bank – A/C 1005009876","BRAC Bank – A/C 1501023456"];
const METH_LABELS  = ["Cash","Bank Transfer","Cheque / DD","Online / NEFT"];
const METH_VALS    = ["cash","bank","cheque","online"];
const BANK_VALS    = ["ba-01","ba-02","ba-03"];

// ─── Mock Form Data Generator ─────────────────────────────────────────────────
function getMockFormData(id) {
  const n         = Number(id) || 1;
  const isAdv     = n % 4 === 3;
  const suppIdx   = n % SUPP_NAMES.length;
  const methIdx   = n % METH_VALS.length;
  const d         = new Date(2025, n % 12, (n % 28) + 1);
  const dateStr   = d.toISOString().split("T")[0];
  const methVal   = METH_VALS[methIdx];
  const invoiceCount = isAdv ? 0 : 1 + (n % 3);

  const invoices = isAdv ? [] : Array.from({ length: invoiceCount }, (_, i) => {
    const invAmt      = 20000 + ((n + i * 3) * 7919 % 180000);
    const prevPaid    = Math.floor(invAmt * (i === 0 ? 0 : 0.4));
    const outstanding = invAmt - prevPaid;
    const payAmt      = Math.min(outstanding, 15000 + ((n + i) * 4567 % (outstanding - 1000 + 1)));
    return {
      invoiceId:   `inv-${n}-${i}`,
      sl:          i + 1,
      poNo:        PO_POOL[(n + i) % PO_POOL.length],
      invoiceDate: new Date(2025, (n + i) % 12, ((n + i) % 28) + 1),
      invoiceAmt: invAmt,
      prevPaid,
      outstanding,
      paymentAmt:  payAmt,
    };
  });

  return {
    pvNo:        `PV-${4000 + n}`,
    paymentType: isAdv ? "advance" : "settlement",
    supplierName: SUPP_NAMES[suppIdx],
    supplierContact: SUPPLIERS[suppIdx],
    invoices,
    totalPaid: isAdv ? 10000 + ((n * 9001) % 90000) : invoices.reduce((s, r) => s + r.paymentAmt, 0),
    formData: isAdv
      ? {
          supplierId:    { label: SUPP_NAMES[suppIdx], value: String(suppIdx + 1) },
          paymentDate:   dateStr,
          paymentMethod: { label: METH_LABELS[methIdx], value: methVal },
          advanceAmount: 10000 + ((n * 9001) % 90000),
          bankAccount:   methVal !== "cash" ? { label: BANK_NAMES[n % BANK_NAMES.length], value: BANK_VALS[n % BANK_VALS.length] } : null,
          transactionRef:methVal === "bank" || methVal === "online" ? `TXN${String(n * 7 + 10000).padStart(10, "0")}` : "",
          chequeNo:      methVal === "cheque" ? `00${String(n).padStart(8, "0")}` : "",
          chequeDate:    methVal === "cheque" ? new Date(d.getTime() - 86400000 * 2).toISOString().split("T")[0] : "",
          purpose:       `Advance for ${PO_POOL[n % PO_POOL.length]}`,
          remarks:       "",
        }
      : {
          supplierId:    { label: SUPP_NAMES[suppIdx], value: String(suppIdx + 1) },
          paymentDate:   dateStr,
          paymentMethod: { label: METH_LABELS[methIdx], value: methVal },
          bankAccount:   methVal !== "cash" ? { label: BANK_NAMES[n % BANK_NAMES.length], value: BANK_VALS[n % BANK_VALS.length] } : null,
          transactionRef:methVal === "bank" || methVal === "online" ? `TXN${String(n * 7 + 10000).padStart(10, "0")}` : "",
          chequeNo:      methVal === "cheque" ? `00${String(n).padStart(8, "0")}` : "",
          chequeDate:    methVal === "cheque" ? new Date(d.getTime() - 86400000 * 2).toISOString().split("T")[0] : "",
          remarks:       "",
        },
  };
}

// ─── Yup Schemas ─────────────────────────────────────────────────────────────
const settlementSchema = yup.object({
  supplierId:    yup.mixed().test("req", "Supplier is required", (v) => v && v.value),
  paymentDate:   yup.string().required("Payment Date is required"),
  paymentMethod: yup.mixed().test("req", "Payment Method is required", (v) => v && v.value),
  bankAccount:   yup.mixed().nullable(),
  transactionRef:yup.string(),
  chequeNo:      yup.string(),
  chequeDate:    yup.string(),
  remarks:       yup.string(),
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

function PayMethodSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Payment Method *</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PAY_METHODS_LIST.map((m) => {
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

function BankChequeFields({ method, control }) {
  if (!method || method === "cash") return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-1">
      {(method === "bank" || method === "online" || method === "cheque") && (
        <FormDropdown name="bankAccount" control={control} label="Bank Account" options={BANK_ACCOUNTS} placeholder="Select bank account..." />
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
export default function PurchasePaymentEdit() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const mock     = getMockFormData(id);

  const [invoices, setInvoices] = useState(mock.invoices);

  const isAdv    = mock.paymentType === "advance";
  const schema   = isAdv ? advanceSchema : settlementSchema;

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: mock.formData,
  });
  const method = watch("paymentMethod")?.value;

  const totalAllocated = invoices.reduce((s, r) => s + (Number(r.paymentAmt) || 0), 0);

  const handleAllocChange = (invoiceId, value) =>
    setInvoices((p) => p.map((r) => r.invoiceId !== invoiceId ? r : { ...r, paymentAmt: Math.min(Number(value), r.outstanding) }));

  const onSubmit = (data) => {
    console.log("PV Edit Payload:", { pvNo: mock.pvNo, type: mock.paymentType, ...data, paymentMethod: data.paymentMethod?.value, invoices });
    alert(`Payment Voucher ${mock.pvNo} updated successfully!`);
    navigate(`/purchase/payment/${id}`);
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
              Edit Payment Voucher
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              <span className="font-mono">{mock.pvNo}</span>
              &nbsp;·&nbsp;
              <span className={isAdv ? "text-amber-600" : "text-blue-600"}>
                {isAdv ? "Advance Payment" : "Invoice Settlement"}
              </span>
              &nbsp;·&nbsp; Draft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(`/purchase/payment/${id}`)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
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
            background: isAdv ? "rgba(217,119,6,0.07)" : "rgba(37,99,235,0.07)",
            border: `1px solid ${isAdv ? "rgba(217,119,6,0.25)" : "rgba(37,99,235,0.25)"}`,
          }}>
          {isAdv ? <Wallet className="w-4 h-4 text-amber-600" /> : <ClipboardList className="w-4 h-4 text-blue-600" />}
          <span style={{ color: isAdv ? "#92400e" : "#1e40af" }}>
            {isAdv ? "Advance Payment" : "Invoice Settlement"} — Payment type cannot be changed in edit mode.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Payment Info */}
          <div className="lg:col-span-3 card space-y-5">
            <SectionHead icon={ClipboardList} label="Payment Information" iconColor={isAdv ? "text-amber-600" : "text-blue-600"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <ReadonlyField label="PV Number" value={mock.pvNo} mono />
              <FormInput name="paymentDate" control={control} label="Payment Date *" type="date" />
              <div className="sm:col-span-2">
                <FormDropdown name="supplierId" control={control} label="Supplier *"
                  options={SUPPLIERS.map((s) => ({ label: s.label, value: s.value }))}
                  placeholder="Select supplier..."
                />
                {errors.supplierId && <p className="text-xs text-red-500 mt-1">{errors.supplierId.message}</p>}
              </div>
              {isAdv && (
                <>
                  <FormInput name="purpose" control={control} label="Purpose / Description" placeholder="e.g. Advance for PO-2026-001" />
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Advance Amount (৳) *</label>
                    <Controller name="advanceAmount" control={control}
                      render={({ field }) => (
                        <input {...field} type="number" min="0.01" step="0.01"
                          className="ctrl-input text-sm font-semibold text-right"
                          style={{ color: "var(--text-primary)" }}
                        />
                      )}
                    />
                    {errors.advanceAmount && <p className="text-xs text-red-500 mt-1">{errors.advanceAmount.message}</p>}
                  </div>
                </>
              )}
            </div>
            <div>
              <Controller name="paymentMethod" control={control}
                render={({ field }) => <PayMethodSelector value={field.value} onChange={field.onChange} />}
              />
              {errors.paymentMethod && <p className="text-xs text-red-500 mt-1">{errors.paymentMethod.message}</p>}
            </div>
            <BankChequeFields method={method} control={control} />
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Remarks</label>
              <Controller name="remarks" control={control}
                render={({ field }) => <StyledTextarea field={field} rows={2} placeholder="Payment remarks or notes..." />}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 card space-y-4">
            <SectionHead icon={Building2} label="Supplier & Summary" iconColor="text-emerald-600" />
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{mock.supplierName}</p>
                {mock.supplierContact && (
                  <div className="text-xs space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                    <p>Contact: {mock.supplierContact.contact}</p>
                    <p>Phone: {mock.supplierContact.phone}</p>
                  </div>
                )}
              </div>
              <div className="p-4 rounded-xl text-center" style={{
                background: isAdv ? "rgba(217,119,6,0.06)" : "rgba(37,99,235,0.06)",
                border: `1px solid ${isAdv ? "rgba(217,119,6,0.18)" : "rgba(37,99,235,0.15)"}`,
              }}>
                <p className="text-[11px] mb-0.5" style={{ color: "var(--text-muted)" }}>
                  {isAdv ? "Advance Amount" : "Total Allocated"}
                </p>
                <p className={`text-2xl font-bold ${isAdv ? "text-amber-600" : "text-blue-600"}`}>
                  ৳ {fmt(isAdv ? (watch("advanceAmount") || 0) : totalAllocated)}
                </p>
                {!isAdv && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    across {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Allocation Table (settlement only) */}
        {!isAdv && invoices.length > 0 && (
          <div className="card space-y-4">
            <SectionHead icon={FileText} label="Invoice Allocation" iconColor="text-blue-600"
              badge={
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
                </span>
              }
            />
            <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-xs border-collapse" style={{ minWidth: 680 }}>
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    {["#","PO No.","Invoice Date","Invoice Amount","Previously Paid","Outstanding","Payment Amount"].map((col, ci) => (
                      <th key={col} className="px-3 py-2.5 font-semibold whitespace-nowrap"
                        style={{ color: "var(--text-secondary)", borderBottom: "2px solid var(--border-strong)", textAlign: ci === 0 ? "center" : ci >= 3 ? "right" : "left" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((row, idx) => (
                    <tr key={row.invoiceId} style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td className="px-3 py-2 text-center" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-emerald-600">{row.poNo}</td>
                      <td className="px-3 py-2" style={{ color: "var(--text-secondary)" }}>{row.invoiceDate.toLocaleDateString("en-BD")}</td>
                      <td className="px-3 py-2 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>৳ {fmt(row.invoiceAmt)}</td>
                      <td className="px-3 py-2 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>৳ {fmt(row.prevPaid)}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums" style={{ color: row.outstanding === 0 ? "#16a34a" : "var(--text-primary)" }}>
                        ৳ {fmt(row.outstanding)}
                      </td>
                      <td className="px-2.5 py-1.5">
                        <input type="number" min="0" max={row.outstanding} step="0.01"
                          className="ctrl-input text-xs text-right"
                          value={row.paymentAmt}
                          onChange={(e) => handleAllocChange(row.invoiceId, e.target.value)}
                          style={{ background: Number(row.paymentAmt) > row.outstanding ? "#fee2e2" : undefined }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
                    <td colSpan={3} className="px-3 py-2.5 text-right text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Totals</td>
                    <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>৳ {fmt(invoices.reduce((s,r)=>s+r.invoiceAmt,0))}</td>
                    <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums" style={{ color: "var(--text-muted)" }}>৳ {fmt(invoices.reduce((s,r)=>s+r.prevPaid,0))}</td>
                    <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums text-blue-600">৳ {fmt(invoices.reduce((s,r)=>s+r.outstanding,0))}</td>
                    <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums text-blue-600">৳ {fmt(totalAllocated)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Payment Amount per invoice cannot exceed the Outstanding balance.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Fields marked with * are required. Only Draft vouchers can be edited.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate(`/purchase/payment/${id}`)} className="btn-outline text-sm flex items-center gap-1.5">
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
