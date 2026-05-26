import { useParams, useNavigate } from "react-router-dom";
import { usePrint } from "../../../hooks/usePrint";
import { motion } from "framer-motion";
import {
  ArrowLeft, Edit2, Printer, CheckCircle2, XCircle,
  Package, Building2, FileText, ClipboardList, Clock, User,
} from "lucide-react";
import PurchasePrintLayout, { PrintSection, PrintRow, PrintTable, PrintTd } from "../../../components/PrintLayout";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";
import Table from "../../../../../common/components/Table";

// ─── Static Reference Data ────────────────────────────────────────────────────
const SUPPLIERS = [
  "Alpha Tech Supplies", "Beta Trading Co. Ltd.", "Gamma Electronics Ltd.",
  "Delta Logistics Inc.", "Epsilon Office Solutions",
];
const ITEMS_CATALOG = [
  "Desktop Computer (Core i5)", "Laptop (Core i7, 16GB RAM)", "Executive Office Chair",
  'Office Table (60"x30")', "A4 Paper (500 Sheets/Ream)", "HP Printer Ink Cartridge Set",
  "Network Switch 24-Port (Cisco)", "UPS 1000VA (APC)", "CAT6 Ethernet Cable (100m)",
  'Samsung 27" Monitor', "Wireless Keyboard & Mouse Combo", "External Hard Drive 1TB",
];
const WAREHOUSES = ["Main Warehouse – Dhaka (WH-01)", "Secondary Warehouse – Chittagong (WH-02)", "Distribution Center – Gazipur (WH-03)"];
const STATUSES   = ["Draft", "Partially Received", "Completed"];
const USERS      = ["Md. Rafiqul Islam", "Fatema Begum", "Karim Ahmed", "Nasrin Akhter", "Jahanara Sultana"];

// ─── Mock Data Generator ──────────────────────────────────────────────────────
function getMockGRN(id) {
  const n        = Number(id) || 1;
  const isOrder  = n % 3 !== 2;
  const suppIdx  = n % SUPPLIERS.length;
  const statIdx  = n % STATUSES.length;
  const itemCount = 2 + (n % 4);

  const items = Array.from({ length: itemCount }, (_, i) => {
    const itemIdx  = (n + i) % ITEMS_CATALOG.length;
    const poQty    = isOrder ? 5 + ((n + i) % 15) : null;
    const prevRcvd = isOrder ? Math.floor(poQty * 0.3) : null;
    const pendingQ = isOrder ? poQty - prevRcvd : null;
    const rcvQty   = isOrder ? pendingQ : 3 + ((n + i) % 12);
    const unitCost = isOrder ? 0 : 1500 + ((n * 7 + i * 3) % 30000);
    return {
      sl:           i + 1,
      itemName:     ITEMS_CATALOG[itemIdx],
      uom:          ["Pcs", "Box", "Set", "Roll"][i % 4],
      poQty,
      prevReceived: prevRcvd,
      pendingQty:   pendingQ,
      receiveQty:   rcvQty,
      condition:    ["Good", "Acceptable", "Good", "Good"][i % 4],
      unitCost:     isOrder ? null : unitCost,
      totalCost:    isOrder ? null : rcvQty * unitCost,
      batchNo:      isOrder ? null : `BT-${String(n + i).padStart(4, "0")}`,
      remarks:      "",
    };
  });

  const totalQty  = items.reduce((s, r) => s + r.receiveQty, 0);
  const totalCost = isOrder ? null : items.reduce((s, r) => s + (r.totalCost || 0), 0);

  const base = new Date(2025, n % 12, (n % 28) + 1);
  const created = new Date(2025, n % 12, (n % 28) + 1, 9, n % 55);

  return {
    id,
    grnNo:         `GRN-${2000 + n}`,
    receiveType:   isOrder ? "Order Based" : "Direct",
    status:        STATUSES[statIdx],
    poNo:          isOrder ? `PO-${1000 + (n % 50)}` : null,
    supplier:      SUPPLIERS[suppIdx],
    warehouse:     WAREHOUSES[n % WAREHOUSES.length],
    receiveDate:   base,
    vendorInvoice: isOrder ? null : `INV-2026-${String(n).padStart(4, "0")}`,
    receivedBy:    USERS[n % USERS.length],
    vehicleNo:     `DHA-${String(10000 + n).slice(1)}`,
    remarks:       n % 4 === 0 ? "Delivery received in good condition. Some items inspected." : "",
    items,
    totalQty,
    totalCost,
    createdBy:     USERS[(n + 2) % USERS.length],
    createdDate:   created,
    approvedBy:    STATUSES[statIdx] !== "Draft" ? USERS[(n + 3) % USERS.length] : null,
    approvedDate:  STATUSES[statIdx] !== "Draft" ? new Date(created.getTime() + 2 * 3600000) : null,
  };
}

// ─── Status Steps ─────────────────────────────────────────────────────────────
const STEPS = ["Draft", "Partially Received", "Completed"];

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
                  done   ? "bg-emerald-500 text-white" :
                  active ? "bg-emerald-500 text-white ring-4 ring-emerald-100" :
                  "text-gray-400 border-2"
                }`}
                style={!done && !active ? { borderColor: "var(--border-strong)", background: "var(--bg-surface)" } : {}}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-emerald-600" : ""}`}
                style={{ color: active ? undefined : done ? "var(--text-secondary)" : "var(--text-muted)" }}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-0.5 w-14 sm:w-20 mx-1 mb-4"
                style={{ background: i < idx ? "#10b981" : "var(--border-strong)" }}
              />
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, mono, highlight }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span
        className={`text-sm font-medium ${mono ? "font-mono" : ""} ${highlight ? "text-emerald-600" : ""}`}
        style={{ color: highlight ? undefined : "var(--text-primary)" }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const styles = {
    "Order Based": "bg-blue-50 text-blue-700 border-blue-200",
    "Direct":      "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${styles[type] || styles["Direct"]}`}>
      {type}
    </span>
  );
}

const fmt = (n) => Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseReceiveView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const grn      = getMockGRN(id);

  const { printRef, handlePrint } = usePrint(`GRN - ${grn.grnNo}`);

  const isOrderBased = grn.receiveType === "Order Based";

  const timeline = [
    { label: "GRN Created",  user: grn.createdBy,  date: grn.createdDate,  color: "bg-emerald-500", desc: `${grn.grnNo} created as Draft` },
    ...(grn.approvedBy ? [{ label: "Approved",    user: grn.approvedBy, date: grn.approvedDate, color: "bg-blue-500",   desc: "Goods receive note approved" }] : []),
    ...(grn.status === "Completed" ? [{
      label: "Completed",
      user: grn.receivedBy,
      date: new Date(grn.receiveDate.getTime() + 3600000),
      color: "bg-emerald-500",
      desc: `All items received. Total Qty: ${grn.totalQty}`,
    }] : []),
  ];

  return (
    <motion.div
      className="flex flex-col gap-5 pb-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* ══ Header ════════════════════════════════════════════════════════════ */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg transition-colors mt-0.5"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold font-mono tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {grn.grnNo}
                </h1>
                <StatusBadge status={grn.status} />
                <TypeBadge type={grn.receiveType} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {isOrderBased && <span>PO: <span className="font-mono text-blue-600">{grn.poNo}</span></span>}
                <span>·</span>
                <span>{grn.supplier}</span>
                <span>·</span>
                <span>Received: {formatDate(grn.receiveDate)}</span>
                <span>·</span>
                <span>By: {grn.receivedBy}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {grn.status === "Draft" && (
              <button
                type="button"
                onClick={() => navigate(`/purchase/receive/edit/${id}`)}
                className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button
              type="button"
              className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
              onClick={handlePrint}
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            {grn.status === "Draft" && (
              <>
                <button
                  type="button"
                  className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button
                  type="button"
                  className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Stepper */}
        <div className="mt-5 pt-4 border-t flex justify-center" style={{ borderColor: "var(--border)" }}>
          <StatusStepper current={grn.status} />
        </div>
      </div>

      {/* ══ Row 1: GRN Details + Supplier Info ═══════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <SectionCard icon={ClipboardList} label="GRN Details" iconColor="text-emerald-600">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 text-sm">
              <InfoRow label="GRN Number"    value={grn.grnNo}          mono highlight />
              <InfoRow label="Receive Type"  value={grn.receiveType} />
              <InfoRow label="Status"        value={grn.status} />
              {isOrderBased
                ? <InfoRow label="PO Reference" value={grn.poNo} mono />
                : <InfoRow label="Vendor Invoice" value={grn.vendorInvoice} mono />}
              <InfoRow label="Receive Date"  value={formatDate(grn.receiveDate)} />
              <InfoRow label="Warehouse"     value={grn.warehouse} />
              <InfoRow label="Received By"   value={grn.receivedBy} />
              <InfoRow label="Vehicle No."   value={grn.vehicleNo} />
              <InfoRow label="Total Qty"     value={grn.totalQty} />
              {!isOrderBased && grn.totalCost != null && (
                <InfoRow label="Total Cost" value={`৳ ${fmt(grn.totalCost)}`} highlight />
              )}
            </div>
            {grn.remarks && (
              <div className="mt-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Remarks</p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{grn.remarks}</p>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="lg:col-span-2">
          <SectionCard icon={Building2} label="Supplier Information" iconColor="text-blue-600">
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{grn.supplier}</p>
                <div className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <p>Warehouse: {grn.warehouse}</p>
                  {grn.receivedBy && <p>Received By: {grn.receivedBy}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                  <p className="text-2xl font-bold text-emerald-600">{grn.totalQty}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Total Qty Received</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                  <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{grn.items.length}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Line Items</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ══ Items Table ═══════════════════════════════════════════════════════ */}
      <SectionCard icon={Package} label="Received Items" iconColor="text-orange-600">
        <Table
          columns={isOrderBased ? [
            { key: "num",              title: "#",              textAlign: "center", render: (_, r) => r.sl },
            { dataIndex: "itemName",   title: "Item",           render: (v) => <span className="font-medium">{v}</span> },
            { dataIndex: "uom",        title: "UOM",            textAlign: "center" },
            { dataIndex: "poQty",      title: "PO Qty",         textAlign: "right" },
            { dataIndex: "prevReceived",title: "Prev. Received",textAlign: "right",  render: (v) => <span style={{ color: "var(--text-muted)" }}>{v}</span> },
            { dataIndex: "pendingQty", title: "Pending Qty",    textAlign: "right" },
            { dataIndex: "receiveQty", title: "Received Qty",   textAlign: "right",  render: (v) => <span className="font-bold text-emerald-600">{v}</span> },
            { dataIndex: "condition",  title: "Condition",      textAlign: "center", render: (v) => (
              <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${
                v === "Good" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                v === "Acceptable" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-red-50 text-red-700 border-red-200"
              }`}>{v}</span>
            )},
            { dataIndex: "remarks",    title: "Remarks",        render: (v) => v || "—" },
          ] : [
            { key: "num",              title: "#",              textAlign: "center", render: (_, r) => r.sl },
            { dataIndex: "itemName",   title: "Item",           render: (v) => <span className="font-medium">{v}</span> },
            { dataIndex: "uom",        title: "UOM",            textAlign: "center" },
            { dataIndex: "receiveQty", title: "Received Qty",   textAlign: "right",  render: (v) => <span className="font-bold text-emerald-600">{v}</span> },
            { dataIndex: "unitCost",   title: "Unit Cost",      textAlign: "right",  render: (v) => `৳ ${fmt(v)}` },
            { dataIndex: "totalCost",  title: "Total Cost",     textAlign: "right",  render: (v) => <span className="font-semibold">৳ {fmt(v)}</span> },
            { dataIndex: "batchNo",    title: "Batch No.",      render: (v) => <span className="font-mono">{v || "—"}</span> },
            { dataIndex: "remarks",    title: "Remarks",        render: (v) => v || "—" },
          ]}
          data={grn.items}
          rowKey={(r) => r.sl}
          maxHeight="420px"
          footer={isOrderBased ? (
            <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={6} style={{ padding: "5px 8px", textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Total Received</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#059669", border: "1px solid var(--border)" }}>{grn.totalQty}</td>
              <td colSpan={2} style={{ border: "1px solid var(--border)" }} />
            </tr>
          ) : (
            <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={3} style={{ padding: "5px 8px", textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Totals</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#059669", border: "1px solid var(--border)" }}>{grn.totalQty}</td>
              <td style={{ border: "1px solid var(--border)" }} />
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", border: "1px solid var(--border)" }}>৳ {fmt(grn.totalCost)}</td>
              <td colSpan={2} style={{ border: "1px solid var(--border)" }} />
            </tr>
          )}
        />
      </SectionCard>

      {/* ══ Activity & Audit Trail ════════════════════════════════════════════ */}
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
          <PurchasePrintLayout docType="Goods Receipt Note" docNo={grn.grnNo} docDate={grn.receiveDate} status={grn.status}>

            {/* GRN Info + Supplier & Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <PrintSection title="Receipt Details">
                <PrintRow label="GRN Number"    value={grn.grnNo}          mono />
                <PrintRow label="Receive Type"  value={grn.receiveType} />
                {isOrderBased
                  ? <PrintRow label="PO Reference"  value={grn.poNo}          mono />
                  : <PrintRow label="Vendor Invoice" value={grn.vendorInvoice} mono />}
                <PrintRow label="Receive Date"  value={new Date(grn.receiveDate).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })} />
                <PrintRow label="Received By"   value={grn.receivedBy} />
                <PrintRow label="Vehicle No."   value={grn.vehicleNo} />
              </PrintSection>
              <PrintSection title="Supplier & Summary">
                <PrintRow label="Supplier Name" value={grn.supplier} />
                <PrintRow label="Warehouse"     value={grn.warehouse} />
                <PrintRow label="Status"        value={grn.status} />
                <PrintRow label="Total Qty"     value={String(grn.totalQty)} />
                {!isOrderBased && grn.totalCost != null && <PrintRow label="Total Cost" value={`৳ ${fmt(grn.totalCost)}`} accent />}
                <PrintRow label="Created By"    value={grn.createdBy} />
                {grn.approvedBy && <PrintRow label="Approved By" value={grn.approvedBy} />}
                {grn.remarks    && <PrintRow label="Remarks"     value={grn.remarks} />}
              </PrintSection>
            </div>

            {/* Items Table */}
            <PrintSection title="Received Items">
              {isOrderBased ? (
                <PrintTable headers={[
                  { label: "#",              align: "center" },
                  { label: "Item"                            },
                  { label: "UOM",            align: "center" },
                  { label: "PO Qty",         align: "right"  },
                  { label: "Prev. Rcvd",     align: "right"  },
                  { label: "Pending",        align: "right"  },
                  { label: "Rcvd Qty",       align: "right"  },
                  { label: "Condition",      align: "center" },
                  { label: "Remarks"                         },
                ]}>
                  {grn.items.map((row, idx) => (
                    <tr key={row.sl} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <PrintTd align="center" muted>{row.sl}</PrintTd>
                      <PrintTd bold>{row.itemName}</PrintTd>
                      <PrintTd align="center" muted>{row.uom}</PrintTd>
                      <PrintTd align="right" muted>{row.poQty}</PrintTd>
                      <PrintTd align="right" muted>{row.prevReceived}</PrintTd>
                      <PrintTd align="right">{row.pendingQty}</PrintTd>
                      <PrintTd align="right" bold accent>{row.receiveQty}</PrintTd>
                      <PrintTd align="center">{row.condition}</PrintTd>
                      <PrintTd muted>{row.remarks || "—"}</PrintTd>
                    </tr>
                  ))}
                  <tr style={{ background: "#f9fafb" }}>
                    <td colSpan={6} style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 600, fontSize: 10, color: "#374151" }}>Total Received</td>
                    <td style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 700, fontSize: 10, color: "#16a34a" }}>{grn.totalQty}</td>
                    <td colSpan={2} style={{ border: "1px solid #d1d5db" }} />
                  </tr>
                </PrintTable>
              ) : (
                <PrintTable headers={[
                  { label: "#",            align: "center" },
                  { label: "Item"                          },
                  { label: "UOM",          align: "center" },
                  { label: "Rcvd Qty",     align: "right"  },
                  { label: "Unit Cost",    align: "right"  },
                  { label: "Total Cost",   align: "right"  },
                  { label: "Batch No."                     },
                  { label: "Remarks"                       },
                ]}>
                  {grn.items.map((row, idx) => (
                    <tr key={row.sl} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <PrintTd align="center" muted>{row.sl}</PrintTd>
                      <PrintTd bold>{row.itemName}</PrintTd>
                      <PrintTd align="center" muted>{row.uom}</PrintTd>
                      <PrintTd align="right" bold accent>{row.receiveQty}</PrintTd>
                      <PrintTd align="right">৳ {fmt(row.unitCost)}</PrintTd>
                      <PrintTd align="right" bold>৳ {fmt(row.totalCost)}</PrintTd>
                      <PrintTd mono muted>{row.batchNo || "—"}</PrintTd>
                      <PrintTd muted>{row.remarks || "—"}</PrintTd>
                    </tr>
                  ))}
                  <tr style={{ background: "#f9fafb" }}>
                    <td colSpan={3} style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 600, fontSize: 10, color: "#374151" }}>Totals</td>
                    <td style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 700, fontSize: 10, color: "#16a34a" }}>{grn.totalQty}</td>
                    <td style={{ border: "1px solid #d1d5db" }} />
                    <td style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 700, fontSize: 10 }}>৳ {fmt(grn.totalCost)}</td>
                    <td colSpan={2} style={{ border: "1px solid #d1d5db" }} />
                  </tr>
                </PrintTable>
              )}
            </PrintSection>

          </PurchasePrintLayout>
        </div>
      </div>
    </motion.div>
  );
}
