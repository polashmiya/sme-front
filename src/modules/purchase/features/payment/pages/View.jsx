import { useParams, useNavigate } from "react-router-dom";
import { usePrint } from "../../../hooks/usePrint";
import { motion } from "framer-motion";
import {
  ArrowLeft, Edit2, Printer, CheckCircle2, XCircle,
  Building2, FileText, ClipboardList, Clock, User,
  CreditCard, Banknote, Landmark, Wallet,
} from "lucide-react";
import PurchasePrintLayout, { PrintSection, PrintRow, PrintTable, PrintTd } from "../../../components/PrintLayout";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";
import Table from "../../../../../common/components/Table";

// ─── Static Reference Data ────────────────────────────────────────────────────
const SUPPLIERS    = ["Alpha Tech Supplies","Beta Trading Co. Ltd.","Gamma Electronics Ltd.","Delta Logistics Inc.","Epsilon Office Solutions"];
const CONTACTS     = ["Md. Rafiqul Islam","Fatema Begum","Karim Ahmed","Nasrin Akhter","Jahanara Sultana"];
const WAREHOUSES   = ["Main Warehouse – Dhaka (WH-01)","Secondary Warehouse – Chittagong (WH-02)","Distribution Center – Gazipur (WH-03)"];
const STATUSES     = ["Draft","Approved","Paid"];
const USERS        = ["Md. Rafiqul Islam","Fatema Begum","Karim Ahmed","Nasrin Akhter","Jahanara Sultana"];
const PAY_METHODS  = ["cash","bank","cheque","online"];
const PAY_LABELS   = ["Cash","Bank Transfer","Cheque / DD","Online / NEFT"];
const BANK_NAMES   = ["Sonali Bank – A/C 0100123456","Dutch-Bangla Bank – A/C 1005009876","BRAC Bank – A/C 1501023456"];
const PO_POOL      = ["PO-1000","PO-1003","PO-1007","PO-1010","PO-1014","PO-1021","PO-1030"];

// ─── Mock Data Generator ──────────────────────────────────────────────────────
function getMockPayment(id) {
  const n          = Number(id) || 1;
  const isAdv      = n % 4 === 3;
  const suppIdx    = n % SUPPLIERS.length;
  const statIdx    = n % STATUSES.length;
  const methIdx    = n % PAY_METHODS.length;
  const invoiceCount = isAdv ? 0 : 1 + (n % 3);

  const invoices = isAdv ? [] : Array.from({ length: invoiceCount }, (_, i) => {
    const invAmt  = 20000 + ((n + i * 3) * 7919 % 180000);
    const prevPaid = Math.floor(invAmt * (i === 0 ? 0 : 0.4));
    const outstanding = invAmt - prevPaid;
    const payAmt = Math.min(outstanding, 15000 + ((n + i) * 4567 % (outstanding - 1000 + 1)));
    return {
      sl:        i + 1,
      poNo:      PO_POOL[(n + i) % PO_POOL.length],
      invoiceDate: new Date(2025, (n + i) % 12, ((n + i) % 28) + 1),
      invoiceAmt: invAmt,
      prevPaid,
      outstanding,
      paymentAmt: payAmt,
    };
  });

  const totalPaid    = isAdv ? 10000 + ((n * 9001) % 90000) : invoices.reduce((s, r) => s + r.paymentAmt, 0);
  const base         = new Date(2025, n % 12, (n % 28) + 1);
  const created      = new Date(2025, n % 12, (n % 28) + 1, 14, n % 55);
  const methVal      = PAY_METHODS[methIdx];

  return {
    id,
    pvNo:          `PV-${4000 + n}`,
    paymentType:   isAdv ? "Advance Payment" : "Invoice Settlement",
    status:        STATUSES[statIdx],
    supplier:      SUPPLIERS[suppIdx],
    contact:       CONTACTS[suppIdx],
    paymentDate:   base,
    paymentMethod: PAY_LABELS[methIdx],
    methodValue:   methVal,
    bankAccount:   methVal !== "cash" ? BANK_NAMES[n % BANK_NAMES.length] : null,
    transactionRef:methVal === "bank" || methVal === "online" ? `TXN${String(n * 7 + 10000).padStart(10, "0")}` : null,
    chequeNo:      methVal === "cheque" ? `00${String(n).padStart(8, "0")}` : null,
    chequeDate:    methVal === "cheque" ? new Date(base.getTime() - 86400000 * 2) : null,
    purpose:       isAdv ? `Advance for ${PO_POOL[n % PO_POOL.length]}` : null,
    invoices,
    totalPaid,
    remarks:       n % 5 === 0 ? "Payment processed and confirmed by accounts." : "",
    createdBy:     USERS[(n + 2) % USERS.length],
    createdDate:   created,
    approvedBy:    STATUSES[statIdx] !== "Draft" ? USERS[(n + 3) % USERS.length] : null,
    approvedDate:  STATUSES[statIdx] !== "Draft" ? new Date(created.getTime() + 3600000) : null,
    paidBy:        STATUSES[statIdx] === "Paid" ? USERS[(n + 1) % USERS.length] : null,
    paidDate:      STATUSES[statIdx] === "Paid" ? new Date(created.getTime() + 2 * 3600000) : null,
  };
}

// ─── Status Steps ─────────────────────────────────────────────────────────────
const STEPS = ["Draft", "Approved", "Paid"];

function StatusStepper({ current }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? "bg-blue-500 text-white" :
                active ? "bg-blue-500 text-white ring-4 ring-blue-100" :
                "text-gray-400 border-2"
              }`} style={!done && !active ? { borderColor: "var(--border-strong)", background: "var(--bg-surface)" } : {}}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-blue-600" : ""}`}
                style={{ color: active ? undefined : done ? "var(--text-secondary)" : "var(--text-muted)" }}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-0.5 w-14 sm:w-20 mx-1 mb-4"
                style={{ background: i < idx ? "#3b82f6" : "var(--border-strong)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionCard({ icon: Icon, label, iconColor, children }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono, highlight, highlightColor }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono" : ""}`}
        style={{ color: highlight ? (highlightColor || "#2563eb") : "var(--text-primary)" }}>
        {value || "—"}
      </span>
    </div>
  );
}

const METHOD_ICON = { cash: Banknote, bank: Landmark, cheque: FileText, online: CreditCard };
const METHOD_COLOR = {
  cash:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  bank:   "bg-blue-50 text-blue-700 border-blue-200",
  cheque: "bg-violet-50 text-violet-700 border-violet-200",
  online: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

function MethodBadge({ method, label }) {
  const Icon = METHOD_ICON[method] || Banknote;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border font-medium ${METHOD_COLOR[method] || METHOD_COLOR.cash}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

const fmt = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchasePaymentView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const pv       = getMockPayment(id);

  const { printRef, handlePrint } = usePrint(`Payment Voucher - ${pv.pvNo}`);
  const isAdv    = pv.paymentType === "Advance Payment";

  const timeline = [
    { label: "Voucher Created", user: pv.createdBy,  date: pv.createdDate,  color: "bg-blue-500",    desc: `${pv.pvNo} created as Draft` },
    ...(pv.approvedBy ? [{ label: "Approved",    user: pv.approvedBy, date: pv.approvedDate, color: "bg-emerald-500", desc: "Payment voucher approved" }] : []),
    ...(pv.paidBy     ? [{ label: "Paid",         user: pv.paidBy,     date: pv.paidDate,    color: "bg-blue-500",    desc: `Payment of ৳ ${fmt(pv.totalPaid)} processed` }] : []),
  ];

  return (
    <motion.div className="flex flex-col gap-5 pb-6"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      {/* Header */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg transition-colors mt-0.5"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold font-mono tracking-tight" style={{ color: "var(--text-primary)" }}>{pv.pvNo}</h1>
                <StatusBadge status={pv.status} />
                <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${isAdv ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                  {pv.paymentType}
                </span>
                <MethodBadge method={pv.methodValue} label={pv.paymentMethod} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{pv.supplier}</span>
                <span>·</span>
                <span>Date: {formatDate(pv.paymentDate)}</span>
                <span>·</span>
                <span className="font-semibold text-blue-600">৳ {fmt(pv.totalPaid)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pv.status === "Draft" && (
              <button type="button" onClick={() => navigate(`/purchase/payment/edit/${id}`)}
                className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button type="button" className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            {pv.status === "Draft" && (
              <>
                <button type="button" className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5 text-red-500 border-red-200 hover:bg-red-50">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button type="button" className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Pay
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 pt-4 border-t flex justify-center" style={{ borderColor: "var(--border)" }}>
          <StatusStepper current={pv.status} />
        </div>
      </div>

      {/* Row 1: PV Details + Supplier */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <SectionCard icon={ClipboardList} label="Payment Details" iconColor="text-blue-600">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 text-sm">
              <InfoRow label="PV Number"      value={pv.pvNo}          mono highlight />
              <InfoRow label="Payment Type"   value={pv.paymentType} />
              <InfoRow label="Status"         value={pv.status} />
              <InfoRow label="Payment Date"   value={formatDate(pv.paymentDate)} />
              <InfoRow label="Payment Method" value={pv.paymentMethod} />
              {pv.bankAccount   && <InfoRow label="Bank Account"    value={pv.bankAccount} />}
              {pv.transactionRef && <InfoRow label="Transaction Ref" value={pv.transactionRef} mono />}
              {pv.chequeNo      && <InfoRow label="Cheque No."       value={pv.chequeNo}    mono />}
              {pv.chequeDate    && <InfoRow label="Cheque Date"      value={formatDate(pv.chequeDate)} />}
              {pv.purpose       && <InfoRow label="Purpose"          value={pv.purpose} />}
              <InfoRow label="Total Amount"   value={`৳ ${fmt(pv.totalPaid)}`} highlight />
            </div>
            {pv.remarks && (
              <div className="mt-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Remarks</p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{pv.remarks}</p>
              </div>
            )}
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard icon={Building2} label="Supplier Information" iconColor="text-emerald-600">
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{pv.supplier}</p>
                {pv.contact && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Contact: {pv.contact}</p>}
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)" }}>
                <p className="text-[11px] mb-0.5" style={{ color: "var(--text-muted)" }}>
                  {isAdv ? "Advance Amount" : "Total Payment"}
                </p>
                <p className="text-2xl font-bold text-blue-600">৳ {fmt(pv.totalPaid)}</p>
                {!isAdv && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    across {pv.invoices.length} invoice{pv.invoices.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Invoice Allocation Table (settlement only) */}
      {!isAdv && pv.invoices.length > 0 && (
        <SectionCard icon={FileText} label="Invoice Allocation" iconColor="text-blue-600">
          <Table
            columns={[
              { key: "num",             title: "#",                textAlign: "center", render: (_, r) => r.sl },
              { dataIndex: "poNo",      title: "PO No.",           render: (v) => <span className="font-mono font-semibold text-emerald-600">{v}</span> },
              { dataIndex: "invoiceDate",title: "Invoice Date",    render: (v) => v.toLocaleDateString("en-BD") },
              { dataIndex: "invoiceAmt",title: "Invoice Amount",   textAlign: "right", render: (v) => `৳ ${fmt(v)}` },
              { dataIndex: "prevPaid",  title: "Previously Paid",  textAlign: "right", render: (v) => <span style={{ color: "var(--text-muted)" }}>৳ {fmt(v)}</span> },
              { dataIndex: "outstanding",title: "Outstanding",     textAlign: "right", render: (v) => <span className="font-semibold">৳ {fmt(v)}</span> },
              { dataIndex: "paymentAmt",title: "Payment Amount",   textAlign: "right", render: (v) => <span className="font-bold text-blue-600">৳ {fmt(v)}</span> },
            ]}
            data={pv.invoices}
            rowKey={(r) => r.sl}
            maxHeight="380px"
            footer={
              <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
                <td colSpan={3} style={{ padding: "5px 8px", textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Totals</td>
                <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", border: "1px solid var(--border)" }}>৳ {fmt(pv.invoices.reduce((s,r)=>s+r.invoiceAmt,0))}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text-muted)",   border: "1px solid var(--border)" }}>৳ {fmt(pv.invoices.reduce((s,r)=>s+r.prevPaid,0))}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", border: "1px solid var(--border)" }}>৳ {fmt(pv.invoices.reduce((s,r)=>s+r.outstanding,0))}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#2563eb",              border: "1px solid var(--border)" }}>৳ {fmt(pv.totalPaid)}</td>
              </tr>
            }
          />
        </SectionCard>
      )}

      {/* Advance details card */}
      {isAdv && (
        <SectionCard icon={Wallet} label="Advance Payment Details" iconColor="text-amber-600">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 text-sm">
            <InfoRow label="Advance Amount"  value={`৳ ${fmt(pv.totalPaid)}`} highlight highlightColor="#d97706" />
            <InfoRow label="Purpose"         value={pv.purpose} />
            <InfoRow label="Payment Method"  value={pv.paymentMethod} />
            {pv.bankAccount    && <InfoRow label="Bank Account"    value={pv.bankAccount} />}
            {pv.transactionRef && <InfoRow label="Transaction Ref" value={pv.transactionRef} mono />}
          </div>
          <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", color: "var(--text-secondary)" }}>
            This advance will be adjusted against future invoices from {pv.supplier}.
          </div>
        </SectionCard>
      )}

      {/* Activity Trail */}
      <SectionCard icon={Clock} label="Activity & Audit Trail" iconColor="text-violet-600">
        <div className="flex flex-col gap-0">
          {timeline.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${event.color}`} />
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: "var(--border-strong)" }} />}
              </div>
              <div className="pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{event.label}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>·</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDateTime(event.date)}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{event.desc}</p>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{event.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ══ Hidden Print Content ══════════════════════════════════════════ */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "-9999px", pointerEvents: "none" }}>
        <div ref={printRef} style={{ background: "#fff", width: "210mm" }}>
          <PurchasePrintLayout docType="Payment Voucher" docNo={pv.pvNo} docDate={pv.paymentDate} status={pv.status}>

            {/* PV Info + Payee & Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <PrintSection title="Payment Details">
                <PrintRow label="PV Number"       value={pv.pvNo}            mono />
                <PrintRow label="Payment Type"    value={pv.paymentType} />
                <PrintRow label="Payment Date"    value={new Date(pv.paymentDate).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })} />
                <PrintRow label="Payment Method"  value={pv.paymentMethod} />
                {pv.bankAccount    && <PrintRow label="Bank Account"    value={pv.bankAccount} />}
                {pv.transactionRef && <PrintRow label="Transaction Ref" value={pv.transactionRef} mono />}
                {pv.chequeNo       && <PrintRow label="Cheque No."      value={pv.chequeNo}      mono />}
              </PrintSection>
              <PrintSection title="Payee & Summary">
                <PrintRow label="Supplier Name"   value={pv.supplier} />
                <PrintRow label="Contact Person"  value={pv.contact} />
                <PrintRow label="Status"          value={pv.status} />
                <PrintRow label="Total Amount"    value={`৳ ${fmt(pv.totalPaid)}`} accent />
                {pv.purpose    && <PrintRow label="Purpose"     value={pv.purpose} />}
                <PrintRow label="Created By"      value={pv.createdBy} />
                {pv.approvedBy && <PrintRow label="Approved By" value={pv.approvedBy} />}
                {pv.paidBy     && <PrintRow label="Paid By"     value={pv.paidBy} />}
                {pv.remarks    && <PrintRow label="Remarks"     value={pv.remarks} />}
              </PrintSection>
            </div>

            {/* Invoice Allocation Table (only for Invoice Settlement) */}
            {!isAdv && pv.invoices.length > 0 && (
              <PrintSection title="Invoice Allocation">
                <PrintTable headers={[
                  { label: "#",            align: "center" },
                  { label: "PO No.",       align: "left"   },
                  { label: "Invoice Date", align: "left"   },
                  { label: "Invoice Amt",  align: "right"  },
                  { label: "Prev. Paid",   align: "right"  },
                  { label: "Outstanding",  align: "right"  },
                  { label: "Pay Amount",   align: "right"  },
                ]}>
                  {pv.invoices.map((row, idx) => (
                    <tr key={row.sl} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <PrintTd align="center" muted>{row.sl}</PrintTd>
                      <PrintTd mono bold>{row.poNo}</PrintTd>
                      <PrintTd>{new Date(row.invoiceDate).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })}</PrintTd>
                      <PrintTd align="right">৳ {fmt(row.invoiceAmt)}</PrintTd>
                      <PrintTd align="right" muted>৳ {fmt(row.prevPaid)}</PrintTd>
                      <PrintTd align="right">৳ {fmt(row.outstanding)}</PrintTd>
                      <PrintTd align="right" bold accent>৳ {fmt(row.paymentAmt)}</PrintTd>
                    </tr>
                  ))}
                  <tr style={{ background: "#f9fafb" }}>
                    <td colSpan={6} style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 600, fontSize: 10, color: "#374151" }}>Total Payment</td>
                    <td style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 700, fontSize: 10, color: "#16a34a" }}>৳ {fmt(pv.totalPaid)}</td>
                  </tr>
                </PrintTable>
              </PrintSection>
            )}

            {/* Advance summary */}
            {isAdv && (
              <PrintSection title="Advance Payment Summary">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <PrintRow label="Advance Amount" value={`৳ ${fmt(pv.totalPaid)}`} accent />
                  <PrintRow label="Purpose"        value={pv.purpose || "—"} />
                  <PrintRow label="Payment Method" value={pv.paymentMethod} />
                  {pv.bankAccount && <PrintRow label="Bank Account" value={pv.bankAccount} />}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: "#6b7280", background: "#fef9c3", padding: "6px 8px", borderRadius: 4, border: "1px solid #fde047" }}>
                  This advance will be adjusted against future invoices from {pv.supplier}.
                </div>
              </PrintSection>
            )}

          </PurchasePrintLayout>
        </div>
      </div>
    </motion.div>
  );
}
