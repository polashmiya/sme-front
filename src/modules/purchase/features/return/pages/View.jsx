import { useParams, useNavigate } from "react-router-dom";
import { usePrint } from "../../../hooks/usePrint";
import { motion } from "framer-motion";
import {
  ArrowLeft, Edit2, Printer, CheckCircle2, XCircle,
  Package, Building2, ClipboardList, Clock, User, RotateCcw,
} from "lucide-react";
import PurchasePrintLayout, { PrintSection, PrintRow, PrintTable, PrintTd } from "../../../components/PrintLayout";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";
import Table from "../../../../../common/components/Table";

// ─── Static Reference Data ────────────────────────────────────────────────────
const SUPPLIERS    = ["Alpha Tech Supplies","Beta Trading Co. Ltd.","Gamma Electronics Ltd.","Delta Logistics Inc.","Epsilon Office Solutions"];
const ITEM_NAMES   = ["Desktop Computer (Core i5)","Laptop (Core i7, 16GB RAM)","Executive Office Chair",'Office Table (60"x30")',"A4 Paper (500 Sheets/Ream)","HP Printer Ink Cartridge Set","Network Switch 24-Port (Cisco)","UPS 1000VA (APC)","CAT6 Ethernet Cable (100m)",'Samsung 27" Monitor',"Wireless Keyboard & Mouse Combo","External Hard Drive 1TB"];
const ITEM_PRICES  = [45000,85000,8500,12000,350,2200,12000,9500,1800,28000,1800,5500];
const WAREHOUSES   = ["Main Warehouse – Dhaka (WH-01)","Secondary Warehouse – Chittagong (WH-02)","Distribution Center – Gazipur (WH-03)"];
const STATUSES     = ["Draft","Approved","Completed"];
const USERS        = ["Md. Rafiqul Islam","Fatema Begum","Karim Ahmed","Nasrin Akhter","Jahanara Sultana"];
const REASONS      = ["Damaged / Defective","Wrong Item Received","Quality Issue","Over Delivery","Expired / Near Expiry","Price Dispute","Other"];
const SHIP_METHODS = ["Road Transport","Supplier Pick-up","Courier (DHL / FedEx)","Own Vehicle / Fleet"];

// ─── Mock Data Generator ──────────────────────────────────────────────────────
function getMockReturn(id) {
  const n         = Number(id) || 1;
  const isGRN     = n % 3 !== 2;
  const suppIdx   = n % SUPPLIERS.length;
  const statIdx   = n % STATUSES.length;
  const itemCount = 2 + (n % 3);

  const items = Array.from({ length: itemCount }, (_, i) => {
    const idx       = (n + i) % ITEM_NAMES.length;
    const recvQty   = isGRN ? 5 + ((n + i) % 10) : null;
    const retQty    = isGRN ? 1 + ((n + i) % Math.max(1, recvQty - 1)) : 2 + ((n + i) % 8);
    const unitPrice = ITEM_PRICES[idx];
    return {
      sl:           i + 1,
      itemName:     ITEM_NAMES[idx],
      uom:          ["Pcs","Box","Set","Roll"][i % 4],
      receivedQty:  recvQty,
      returnQty:    retQty,
      unitPrice,
      lineAmount:   retQty * unitPrice,
      returnReason: REASONS[(n + i) % REASONS.length],
      remarks:      "",
    };
  });

  const totalAmount = items.reduce((s, r) => s + r.lineAmount, 0);
  const base    = new Date(2025, n % 12, (n % 28) + 1);
  const created = new Date(2025, n % 12, (n % 28) + 1, 9, n % 55);

  return {
    id,
    prNo:          `PR-${3000 + n}`,
    returnType:    isGRN ? "GRN Based" : "Direct",
    status:        STATUSES[statIdx],
    grnRef:        isGRN ? `GRN-${2000 + (n % 50)}` : null,
    supplier:      SUPPLIERS[suppIdx],
    warehouse:     WAREHOUSES[n % WAREHOUSES.length],
    returnDate:    base,
    returnReason:  REASONS[n % REASONS.length],
    shippingMethod:SHIP_METHODS[n % SHIP_METHODS.length],
    debitNoteNo:   n % 3 === 0 ? `DN-2025-${String(n).padStart(4, "0")}` : null,
    remarks:       n % 4 === 0 ? "All items packed and dispatched to supplier." : "",
    items,
    totalAmount,
    createdBy:     USERS[(n + 2) % USERS.length],
    createdDate:   created,
    approvedBy:    STATUSES[statIdx] !== "Draft" ? USERS[(n + 3) % USERS.length] : null,
    approvedDate:  STATUSES[statIdx] !== "Draft" ? new Date(created.getTime() + 2 * 3600000) : null,
  };
}

// ─── Status Steps ─────────────────────────────────────────────────────────────
const STEPS = ["Draft", "Approved", "Completed"];

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
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done   ? "bg-rose-500 text-white" :
                  active ? "bg-rose-500 text-white ring-4 ring-rose-100" :
                  "text-gray-400 border-2"
                }`}
                style={!done && !active ? { borderColor: "var(--border-strong)", background: "var(--bg-surface)" } : {}}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-rose-600" : ""}`}
                style={{ color: active ? undefined : done ? "var(--text-secondary)" : "var(--text-muted)" }}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-0.5 w-14 sm:w-20 mx-1 mb-4"
                style={{ background: i < idx ? "#f43f5e" : "var(--border-strong)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
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

function InfoRow({ label, value, mono, highlight }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono" : ""} ${highlight ? "text-rose-600" : ""}`}
        style={{ color: highlight ? undefined : "var(--text-primary)" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function TypeBadge({ type }) {
  const styles = {
    "GRN Based": "bg-violet-50 text-violet-700 border-violet-200",
    "Direct":    "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${styles[type] || styles["Direct"]}`}>{type}</span>
  );
}

const fmt = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseReturnView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const pr       = getMockReturn(id);

  const { printRef, handlePrint } = usePrint(`Purchase Return - ${pr.prNo}`);
  const isGRN    = pr.returnType === "GRN Based";

  const timeline = [
    { label: "Return Created", user: pr.createdBy,  date: pr.createdDate,  color: "bg-rose-500",    desc: `${pr.prNo} created as Draft` },
    ...(pr.approvedBy ? [{ label: "Approved",    user: pr.approvedBy, date: pr.approvedDate, color: "bg-blue-500",   desc: "Purchase return approved" }] : []),
    ...(pr.status === "Completed" ? [{ label: "Completed", user: pr.createdBy, date: new Date(pr.returnDate.getTime() + 86400000), color: "bg-rose-500", desc: `Return dispatched. Total Amount: ৳ ${fmt(pr.totalAmount)}` }] : []),
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
                <h1 className="text-xl font-bold font-mono tracking-tight" style={{ color: "var(--text-primary)" }}>{pr.prNo}</h1>
                <StatusBadge status={pr.status} />
                <TypeBadge type={pr.returnType} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {isGRN && <span>GRN: <span className="font-mono text-emerald-600">{pr.grnRef}</span></span>}
                {isGRN && <span>·</span>}
                <span>{pr.supplier}</span>
                <span>·</span>
                <span>Return Date: {formatDate(pr.returnDate)}</span>
                <span>·</span>
                <span className="font-semibold text-rose-600">৳ {fmt(pr.totalAmount)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pr.status === "Draft" && (
              <button type="button" onClick={() => navigate(`/purchase/return/edit/${id}`)}
                className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button type="button" className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            {pr.status === "Draft" && (
              <>
                <button type="button" className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5 text-red-500 border-red-200 hover:bg-red-50">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button type="button" className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 pt-4 border-t flex justify-center" style={{ borderColor: "var(--border)" }}>
          <StatusStepper current={pr.status} />
        </div>
      </div>

      {/* Row 1: Return Details + Supplier Info */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <SectionCard icon={ClipboardList} label="Return Details" iconColor="text-rose-600">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 text-sm">
              <InfoRow label="PR Number"      value={pr.prNo}            mono highlight />
              <InfoRow label="Return Type"    value={pr.returnType} />
              <InfoRow label="Status"         value={pr.status} />
              {isGRN
                ? <InfoRow label="GRN Reference"  value={pr.grnRef}  mono />
                : <InfoRow label="Debit Note"      value={pr.debitNoteNo} mono />
              }
              <InfoRow label="Return Date"    value={formatDate(pr.returnDate)} />
              <InfoRow label="Warehouse"      value={pr.warehouse} />
              <InfoRow label="Return Reason"  value={pr.returnReason} />
              <InfoRow label="Shipping"       value={pr.shippingMethod} />
              <InfoRow label="Total Amount"   value={`৳ ${fmt(pr.totalAmount)}`} highlight />
            </div>
            {pr.remarks && (
              <div className="mt-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Remarks</p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{pr.remarks}</p>
              </div>
            )}
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard icon={Building2} label="Supplier Information" iconColor="text-violet-600">
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{pr.supplier}</p>
                <div className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
                  <p>Warehouse: {pr.warehouse}</p>
                  {pr.shippingMethod && <p>Shipping: {pr.shippingMethod}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                  <p className="text-2xl font-bold text-rose-600">{pr.items.length}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Line Items</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)" }}>
                  <p className="text-lg font-bold text-rose-600">৳ {fmt(pr.totalAmount)}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Total Amount</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Items Table */}
      <SectionCard icon={Package} label="Return Items" iconColor="text-rose-600">
        <Table
          columns={isGRN ? [
            { key: "num",             title: "#",             textAlign: "center", render: (_, r) => r.sl },
            { dataIndex: "itemName",  title: "Item",          render: (v) => <span className="font-medium">{v}</span> },
            { dataIndex: "uom",       title: "UOM",           textAlign: "center" },
            { dataIndex: "receivedQty",title: "Received Qty", textAlign: "right",  render: (v) => <span style={{ color: "var(--text-muted)" }}>{v}</span> },
            { dataIndex: "returnQty", title: "Return Qty",    textAlign: "right",  render: (v) => <span className="font-bold text-rose-600">{v}</span> },
            { dataIndex: "unitPrice", title: "Unit Price",    textAlign: "right",  render: (v) => `৳ ${fmt(v)}` },
            { dataIndex: "lineAmount",title: "Return Amount", textAlign: "right",  render: (v) => <span className="font-semibold text-rose-600">৳ {fmt(v)}</span> },
            { dataIndex: "returnReason",title: "Return Reason", render: (v) => <span className="text-[11px] px-1.5 py-0.5 rounded border font-medium bg-rose-50 text-rose-700 border-rose-200">{v}</span> },
            { dataIndex: "remarks",   title: "Remarks",       render: (v) => v || "—" },
          ] : [
            { key: "num",             title: "#",             textAlign: "center", render: (_, r) => r.sl },
            { dataIndex: "itemName",  title: "Item",          render: (v) => <span className="font-medium">{v}</span> },
            { dataIndex: "uom",       title: "UOM",           textAlign: "center" },
            { dataIndex: "returnQty", title: "Return Qty",    textAlign: "right",  render: (v) => <span className="font-bold text-rose-600">{v}</span> },
            { dataIndex: "unitPrice", title: "Unit Price",    textAlign: "right",  render: (v) => `৳ ${fmt(v)}` },
            { dataIndex: "lineAmount",title: "Total Amount",  textAlign: "right",  render: (v) => <span className="font-semibold text-rose-600">৳ {fmt(v)}</span> },
            { dataIndex: "returnReason",title: "Return Reason", render: (v) => <span className="text-[11px] px-1.5 py-0.5 rounded border font-medium bg-rose-50 text-rose-700 border-rose-200">{v}</span> },
            { dataIndex: "remarks",   title: "Remarks",       render: (v) => v || "—" },
          ]}
          data={pr.items}
          rowKey={(r) => r.sl}
          maxHeight="420px"
          footer={
            <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={isGRN ? 4 : 3} style={{ padding: "5px 8px", textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Total Return</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#f43f5e", border: "1px solid var(--border)" }}>{pr.items.reduce((s, r) => s + r.returnQty, 0)}</td>
              <td style={{ border: "1px solid var(--border)" }} />
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#f43f5e", border: "1px solid var(--border)" }}>৳ {fmt(pr.totalAmount)}</td>
              <td colSpan={2} style={{ border: "1px solid var(--border)" }} />
            </tr>
          }
        />
      </SectionCard>

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
          <PurchasePrintLayout docType="Purchase Return" docNo={pr.prNo} docDate={pr.returnDate} status={pr.status}>

            {/* Return Info + Supplier & Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <PrintSection title="Return Details">
                <PrintRow label="PR Number"       value={pr.prNo}           mono />
                <PrintRow label="Return Type"     value={pr.returnType} />
                {isGRN && <PrintRow label="GRN Reference" value={pr.grnRef} mono />}
                <PrintRow label="Return Date"     value={new Date(pr.returnDate).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })} />
                <PrintRow label="Return Reason"   value={pr.returnReason} />
                <PrintRow label="Shipping Method" value={pr.shippingMethod} />
              </PrintSection>
              <PrintSection title="Supplier & Summary">
                <PrintRow label="Supplier Name"   value={pr.supplier} />
                <PrintRow label="Warehouse"       value={pr.warehouse} />
                <PrintRow label="Status"          value={pr.status} />
                {pr.debitNoteNo && <PrintRow label="Debit Note No." value={pr.debitNoteNo} mono />}
                <PrintRow label="Total Amount"    value={`৳ ${fmt(pr.totalAmount)}`} accent />
                <PrintRow label="Created By"      value={pr.createdBy} />
                {pr.approvedBy && <PrintRow label="Approved By" value={pr.approvedBy} />}
                {pr.remarks    && <PrintRow label="Remarks"     value={pr.remarks} />}
              </PrintSection>
            </div>

            {/* Items Table */}
            <PrintSection title="Return Items">
              <PrintTable headers={[
                { label: "#",             align: "center" },
                { label: "Item"                           },
                { label: "UOM",           align: "center" },
                ...(isGRN ? [{ label: "Rcvd Qty", align: "right" }] : []),
                { label: "Return Qty",    align: "right"  },
                { label: "Unit Price",    align: "right"  },
                { label: "Line Amount",   align: "right"  },
                { label: "Return Reason"                  },
              ]}>
                {pr.items.map((row, idx) => (
                  <tr key={row.sl} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                    <PrintTd align="center" muted>{row.sl}</PrintTd>
                    <PrintTd bold>{row.itemName}</PrintTd>
                    <PrintTd align="center" muted>{row.uom}</PrintTd>
                    {isGRN && <PrintTd align="right" muted>{row.receivedQty}</PrintTd>}
                    <PrintTd align="right" bold style={{ color: "#f43f5e" }}>{row.returnQty}</PrintTd>
                    <PrintTd align="right">৳ {fmt(row.unitPrice)}</PrintTd>
                    <PrintTd align="right" bold>৳ {fmt(row.lineAmount)}</PrintTd>
                    <PrintTd muted>{row.returnReason}</PrintTd>
                  </tr>
                ))}
                <tr style={{ background: "#f9fafb" }}>
                  <td colSpan={isGRN ? 7 : 6} style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 600, fontSize: 10, color: "#374151" }}>Total Return Amount</td>
                  <td style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 700, fontSize: 10, color: "#16a34a" }}>৳ {fmt(pr.totalAmount)}</td>
                  <td style={{ border: "1px solid #d1d5db" }} />
                </tr>
              </PrintTable>
            </PrintSection>

          </PurchasePrintLayout>
        </div>
      </div>
    </motion.div>
  );
}
