import { useParams, useNavigate } from "react-router-dom";
import { usePrint } from "../../../hooks/usePrint";
import PurchasePrintLayout, { PrintSection, PrintRow, PrintTable, PrintTd } from "../../../components/PrintLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft, Printer, Edit2, CheckCircle2, XCircle,
  Building2, ClipboardList, FileText, Package, Calculator,
  Clock, User, MapPin, Phone, Mail, Hash, ChevronRight,
  AlertTriangle, MoreHorizontal, Download, Send,
} from "lucide-react";
import StatusBadge from "../../../../../common/components/StatusBadge";
import Table from "../../../../../common/components/Table";

// ─── Mock Reference Data ─────────────────────────────────────────────────────
const SUPPLIERS_DATA = [
  { name: "Alpha Tech Supplies",      contact: "Md. Rafiqul Islam",   phone: "+880-1700-000001", email: "procurement@alphatech.com.bd", address: "123 Industrial Area, Dhaka-1216" },
  { name: "Beta Trading Co. Ltd.",    contact: "Fatema Begum",        phone: "+880-1800-000002", email: "order@betatrading.com",        address: "456 Commerce Street, Chittagong-4000" },
  { name: "Gamma Electronics Ltd.",   contact: "Karim Ahmed",         phone: "+880-1911-000003", email: "sales@gammaelec.com",          address: "789 Tech Park, Sylhet-3100" },
  { name: "Delta Logistics Inc.",     contact: "Nasrin Akhter",       phone: "+880-1750-000004", email: "supply@deltalogistics.net",    address: "321 Cargo Zone, Rajshahi-6000" },
  { name: "Epsilon Office Solutions", contact: "Jahanara Sultana",    phone: "+880-1830-000005", email: "info@epsilonoffice.com",       address: "55 Business Hub, Khulna-9100" },
];

const ITEMS_POOL = [
  { name: "Desktop Computer (Core i5)",           uom: "Pcs",  rate: 45000 },
  { name: "Desktop Computer (Core i7)",           uom: "Pcs",  rate: 65000 },
  { name: "Laptop (Core i7, 16GB RAM)",           uom: "Pcs",  rate: 85000 },
  { name: "Laptop (Core i5, 8GB RAM)",            uom: "Pcs",  rate: 55000 },
  { name: "Executive Office Chair",               uom: "Pcs",  rate: 8500  },
  { name: "Task Chair (Mesh Back)",               uom: "Pcs",  rate: 5500  },
  { name: 'Office Table (60"×30")',               uom: "Pcs",  rate: 12000 },
  { name: "Meeting Table (8-Seater)",             uom: "Pcs",  rate: 35000 },
  { name: "A4 Paper 80gsm (500 Sheets/Ream)",     uom: "Box",  rate: 350   },
  { name: "A3 Paper 80gsm (500 Sheets/Ream)",     uom: "Box",  rate: 520   },
  { name: "HP LaserJet Printer (Mono)",           uom: "Pcs",  rate: 18000 },
  { name: "HP Printer Ink Cartridge Set",         uom: "Set",  rate: 2200  },
  { name: "Network Switch 24-Port (Cisco)",       uom: "Pcs",  rate: 12000 },
  { name: "Network Switch 48-Port (Cisco)",       uom: "Pcs",  rate: 22000 },
  { name: "UPS 1000VA (APC)",                     uom: "Pcs",  rate: 9500  },
  { name: "UPS 2000VA (APC)",                     uom: "Pcs",  rate: 18000 },
  { name: "CAT6 Ethernet Cable (100m)",           uom: "Roll", rate: 1800  },
  { name: "CAT6 Ethernet Cable (300m)",           uom: "Roll", rate: 4500  },
  { name: 'Samsung 27" FHD Monitor',              uom: "Pcs",  rate: 28000 },
  { name: 'Dell 24" FHD Monitor',                 uom: "Pcs",  rate: 22000 },
  { name: "Wireless Keyboard & Mouse Combo",      uom: "Set",  rate: 1800  },
  { name: "USB-C Hub 7-Port",                     uom: "Pcs",  rate: 2500  },
  { name: "External Hard Drive 1TB",              uom: "Pcs",  rate: 5500  },
  { name: "External Hard Drive 2TB",              uom: "Pcs",  rate: 8500  },
  { name: "USB Flash Drive 64GB (Pack/10)",       uom: "Pack", rate: 2800  },
  { name: "HDMI Cable 3m (Pack/5)",               uom: "Pack", rate: 750   },
  { name: "Office Stapler + Staples (Pack/10)",   uom: "Pack", rate: 1200  },
  { name: 'Whiteboard 4×3 ft',                    uom: "Pcs",  rate: 3500  },
  { name: "Whiteboard Marker Set (12 Pcs)",       uom: "Set",  rate: 450   },
  { name: "File Cabinet (4-Drawer Steel)",        uom: "Pcs",  rate: 14000 },
  { name: "Bookshelf (5-Shelf Steel)",            uom: "Pcs",  rate: 8500  },
  { name: "Power Strip 8-Outlet (10m)",           uom: "Pcs",  rate: 850   },
  { name: "Network Rack 9U Wall Mount",           uom: "Pcs",  rate: 12000 },
  { name: "Patch Panel 24-Port (Cat6)",           uom: "Pcs",  rate: 4500  },
  { name: "Fiber Optic Cable SC/LC (100m)",       uom: "Roll", rate: 8000  },
  { name: "Server Rack PDU 16A",                  uom: "Pcs",  rate: 15000 },
  { name: "LCD Projector 3500 Lumens",            uom: "Pcs",  rate: 55000 },
  { name: 'Projector Screen 100"',                uom: "Pcs",  rate: 8500  },
  { name: "Video Conferencing Camera (4K)",       uom: "Pcs",  rate: 32000 },
  { name: "Noise-Canceling Headset (USB)",        uom: "Pcs",  rate: 4500  },
  { name: "Mechanical Keyboard (TKL)",            uom: "Pcs",  rate: 3200  },
  { name: "SSD 1TB (Samsung 870 EVO)",            uom: "Pcs",  rate: 7500  },
  { name: "RAM 16GB DDR4 (PC-3200)",              uom: "Pcs",  rate: 4800  },
  { name: "RAM 32GB DDR4 (PC-3200)",              uom: "Pcs",  rate: 9200  },
  { name: "LED Desk Lamp (USB Charging)",         uom: "Pcs",  rate: 1200  },
  { name: "Extension Cord 10m (3-Pin)",           uom: "Pcs",  rate: 650   },
  { name: "Cable Management Tray (Under Desk)",   uom: "Pcs",  rate: 1500  },
  { name: "Thermal Receipt Printer (80mm)",       uom: "Pcs",  rate: 8500  },
  { name: "Barcode Scanner (USB, 2D)",            uom: "Pcs",  rate: 6500  },
  { name: "IP Camera (2MP Indoor)",               uom: "Pcs",  rate: 3500  },
  { name: "Unmanaged PoE Switch 8-Port",          uom: "Pcs",  rate: 7200  },
];

const STATUSES   = ["Draft", "Approved", "Partially Received", "Completed"];
const PRIORITIES = ["Normal", "High", "Urgent"];
const WAREHOUSES = [
  "Main Warehouse – Dhaka (WH-01)",
  "Secondary Warehouse – Chittagong (WH-02)",
  "Distribution Center – Gazipur (WH-03)",
];
const PAYMENT_TERMS   = ["Net 30 Days", "Net 45 Days", "Cash on Delivery", "Advance Payment (100%)"];
const SHIPPING_METHODS = ["Road Transport", "Air Freight", "Express Courier (DHL)"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtAmt = (n) =>
  Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" });

const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-BD", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

// ─── Mock PO Generator ───────────────────────────────────────────────────────
const getMockPO = (id) => {
  const n      = Math.max(1, parseInt(id) || 1);
  const supp   = SUPPLIERS_DATA[(n - 1) % 5];
  const status = STATUSES[(n - 1) % 4];
  const base   = new Date(2025, (n % 12), (n % 28) + 1);

  // n=1 → 105 items (bulk order for testing); every 15th → 20–35; rest → 3–10
  const itemCount = n === 1 ? 105
    : n % 15 === 0 ? 20 + (n % 16)
    : 3 + (n % 8);
  const items = Array.from({ length: itemCount }, (_, i) => {
    const itm       = ITEMS_POOL[(n + i) % ITEMS_POOL.length];
    const qty       = 1 + ((n + i) % 5);
    const discPct   = (n + i) % 3 === 0 ? 5 : 0;
    const taxPct    = (n + i) % 2 === 0 ? 15 : 0;
    const lineAmt   = qty * itm.rate;
    const discAmt   = lineAmt * discPct / 100;
    const afterDisc = lineAmt - discAmt;
    const taxAmt    = afterDisc * taxPct / 100;
    return { id: i + 1, name: itm.name, uom: itm.uom, qty, unitPrice: itm.rate, discPct, taxPct, lineAmt, discAmt, afterDisc, taxAmt, total: afterDisc + taxAmt };
  });

  const subtotal      = items.reduce((s, r) => s + r.lineAmt, 0);
  const totalDiscount = items.reduce((s, r) => s + r.discAmt, 0);
  const totalTax      = items.reduce((s, r) => s + r.taxAmt, 0);
  const shipping      = n % 3 === 0 ? 500 : 0;
  const grandTotal    = subtotal - totalDiscount + totalTax + shipping;

  // Timeline events
  const timeline = [
    { label: "Purchase Order Created",   by: "User " + ((n % 5) + 1),        date: base,                          color: "emerald", icon: "created" },
  ];
  if (status !== "Draft") {
    timeline.push({ label: "Submitted for Approval", by: "User " + ((n % 5) + 1), date: new Date(base.getTime() + 86400000),     color: "blue",    icon: "sent" });
    timeline.push({ label: "Purchase Order Approved",by: "Manager " + ((n % 3) + 1), date: new Date(base.getTime() + 2 * 86400000), color: "green",  icon: "approved" });
  }
  if (status === "Partially Received" || status === "Completed") {
    timeline.push({ label: "Partial Receipt Recorded", by: "Warehouse Team", date: new Date(base.getTime() + 5 * 86400000), color: "orange", icon: "received" });
  }
  if (status === "Completed") {
    timeline.push({ label: "Fully Received · PO Completed", by: "Warehouse Team", date: new Date(base.getTime() + 9 * 86400000), color: "green", icon: "done" });
  }

  return {
    id: n,
    poNo:         "PO-" + String(1000 + n - 1),
    status,
    supplier:     supp,
    poDate:       base,
    expectedDate: new Date(base.getFullYear(), base.getMonth() + 1, base.getDate()),
    priority:     PRIORITIES[(n - 1) % 3],
    currency:     "BDT",
    warehouse:    WAREHOUSES[(n - 1) % 3],
    paymentTerms: PAYMENT_TERMS[(n - 1) % 4],
    shippingMethod: SHIPPING_METHODS[(n - 1) % 3],
    referenceNo:  n % 3 === 0 ? `PQ-2025-${String(n).padStart(3, "0")}` : "",
    buyerRef:     n % 2 === 0 ? `PR-2025-${String(n).padStart(3, "0")}` : "",
    internalNotes:  n % 4 === 0 ? "Expedite delivery – required for project deadline." : "",
    supplierNotes:  n % 5 === 0 ? "Please include material safety data sheets with each shipment." : "",
    items, subtotal, totalDiscount, totalTax,
    shippingCost: shipping,
    grandTotal,
    createdBy:    "User " + ((n % 5) + 1),
    createdDate:  base,
    timeline,
  };
};

// ─── Status Stepper ───────────────────────────────────────────────────────────
const STEPS = ["Draft", "Approved", "Partially Received", "Completed"];

function StatusStepper({ status }) {
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done    = i < currentIdx;
        const active  = i === currentIdx;
        const future  = i > currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all flex-shrink-0
                  ${done   ? "bg-emerald-500 border-emerald-500 text-white"        : ""}
                  ${active ? "bg-white border-emerald-500 text-emerald-600"        : ""}
                  ${future ? "border-gray-300 text-gray-400"                       : ""}
                `}
                style={future ? { background: "var(--bg-elevated)" } : {}}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap text-center
                  ${done || active ? "text-emerald-600" : ""}
                `}
                style={future ? { color: "var(--text-muted)" } : {}}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 mb-4"
                style={{ background: i < currentIdx ? "rgb(16 185 129)" : "var(--border-strong)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
      {Icon && <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />}
      <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
        <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)", minWidth: 120 }}>{label}</span>
        <span className="text-xs font-medium text-right" style={{ color: "var(--text-primary)" }}>{value}</span>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ icon: Icon, label, iconColor, children, className = "" }) {
  return (
    <div className={`card space-y-3 ${className}`}>
      <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Timeline Icon ────────────────────────────────────────────────────────────
const TIMELINE_COLORS = {
  emerald: { dot: "bg-emerald-500", ring: "ring-emerald-200 dark:ring-emerald-800", text: "text-emerald-600" },
  blue:    { dot: "bg-blue-500",    ring: "ring-blue-200",    text: "text-blue-600"    },
  green:   { dot: "bg-green-500",   ring: "ring-green-200",   text: "text-green-600"   },
  orange:  { dot: "bg-orange-500",  ring: "ring-orange-200",  text: "text-orange-600"  },
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PRIORITY_BADGE = {
  Normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
  High:   "bg-amber-50 text-amber-700 border-amber-200",
  Urgent: "bg-red-50 text-red-700 border-red-200",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PurchaseOrderView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const po = getMockPO(id);

  const { printRef, handlePrint } = usePrint(`Purchase Order - ${po.poNo}`);

  const canEdit     = po.status === "Draft";
  const canApprove  = po.status === "Draft";
  const canReceive  = po.status === "Approved" || po.status === "Partially Received";

  return (
    <motion.div
      className="flex flex-col gap-5 pb-8"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* ══ Page Header ════════════════════════════════════════════════════ */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left: identity */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg mt-0.5 transition-colors flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {po.poNo}
                </h1>
                <StatusBadge status={po.status} />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_BADGE[po.priority] || PRIORITY_BADGE.Normal}`}>
                  {po.priority} Priority
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Building2 className="w-3 h-3" />{po.supplier.name}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock className="w-3 h-3" />PO Date: {fmtDate(po.poDate)}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <User className="w-3 h-3" />Created by {po.createdBy}
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            {canEdit && (
              <button
                className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
                onClick={() => navigate(`/purchase/order/edit/${po.id}`)}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            {canApprove && (
              <button className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </button>
            )}
            {canReceive && (
              <button className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Create Receipt
              </button>
            )}
            {canApprove && (
              <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5 text-red-600 hover:bg-red-50">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            )}
          </div>
        </div>

        {/* Status Stepper */}
        <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <StatusStepper status={po.status} />
        </div>
      </div>

      {/* ══ Row 1: Order Info + Supplier Info ════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <SectionCard icon={ClipboardList} label="Order Information" iconColor="text-emerald-600" className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="PO Number"       value={po.poNo} icon={Hash} />
              <InfoRow label="PO Date"          value={fmtDate(po.poDate)} icon={Clock} />
              <InfoRow label="Expected Delivery" value={fmtDate(po.expectedDate)} icon={Clock} />
            </div>
            <div>
              <InfoRow label="Priority"         value={po.priority} />
              <InfoRow label="Currency"         value={po.currency} />
              <InfoRow label="Warehouse"        value={po.warehouse} icon={MapPin} />
            </div>
          </div>
          {po.referenceNo && <InfoRow label="Supplier Ref / PQ No." value={po.referenceNo} icon={Hash} />}
          {po.buyerRef    && <InfoRow label="Internal Ref / PR No." value={po.buyerRef}    icon={Hash} />}
        </SectionCard>

        <SectionCard icon={Building2} label="Supplier Information" iconColor="text-blue-600" className="lg:col-span-2">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{po.supplier.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Contact Person: {po.supplier.contact}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                {po.supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                {po.supplier.email}
              </div>
              <div className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                {po.supplier.address}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ══ Row 2: Purchase Terms ═════════════════════════════════════════ */}
      <SectionCard icon={FileText} label="Purchase Terms" iconColor="text-violet-600">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {[
            { label: "Payment Terms",    value: po.paymentTerms    },
            { label: "Shipping Method",  value: po.shippingMethod  },
            { label: "Supplier Ref",     value: po.referenceNo || "—" },
            { label: "Buyer Ref",        value: po.buyerRef || "—"    },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg p-3" style={{ background: "var(--bg-elevated)" }}>
              <p className="font-medium mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ══ Row 3: Items Table ════════════════════════════════════════════ */}
      <SectionCard
        icon={Package}
        label="Order Items"
        iconColor="text-orange-600"
      >
        <Table
          columns={[
            { key: "num",            title: "#",            textAlign: "center", render: (_, __, i) => i + 1 },
            { dataIndex: "name",     title: "Item",         render: (v) => <span className="font-medium">{v}</span> },
            { dataIndex: "uom",      title: "UOM",          textAlign: "center" },
            { dataIndex: "qty",      title: "Qty",          textAlign: "right",  render: (v) => v.toLocaleString() },
            { dataIndex: "unitPrice",title: "Unit Price (৳)",textAlign: "right",  render: (v) => fmtAmt(v) },
            { dataIndex: "discPct",  title: "Disc %",       textAlign: "right",  render: (v) => v > 0 ? <span className="text-red-500">{v}%</span> : <span style={{ color: "var(--text-muted)" }}>—</span> },
            { dataIndex: "taxPct",   title: "Tax %",        textAlign: "right",  render: (v) => v > 0 ? <span className="text-blue-600">{v}%</span> : <span style={{ color: "var(--text-muted)" }}>—</span> },
            { dataIndex: "lineAmt",  title: "Line Amt (৳)", textAlign: "right",  render: (v) => fmtAmt(v) },
            { dataIndex: "discAmt",  title: "Discount (৳)", textAlign: "right",  render: (v) => v > 0 ? <span className="text-red-500">({fmtAmt(v)})</span> : <span style={{ color: "var(--text-muted)" }}>—</span> },
            { dataIndex: "taxAmt",   title: "Tax Amt (৳)",  textAlign: "right",  render: (v) => v > 0 ? <span className="text-blue-600">{fmtAmt(v)}</span> : <span style={{ color: "var(--text-muted)" }}>—</span> },
            { dataIndex: "total",    title: "Total (৳)",    textAlign: "right",  render: (v) => <span className="font-semibold">{fmtAmt(v)}</span> },
          ]}
          data={po.items}
          rowKey={(r) => r.id}
          maxHeight="420px"
          footer={
            <tr style={{ background: "var(--bg-elevated)", borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={7} style={{ padding: "5px 8px", textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Items Subtotal</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", border: "1px solid var(--border)" }}>{fmtAmt(po.subtotal)}</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#ef4444",              border: "1px solid var(--border)" }}>{po.totalDiscount > 0 ? `(${fmtAmt(po.totalDiscount)})` : "—"}</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#2563eb",              border: "1px solid var(--border)" }}>{po.totalTax > 0 ? fmtAmt(po.totalTax) : "—"}</td>
              <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", border: "1px solid var(--border)" }}>{fmtAmt(po.grandTotal - po.shippingCost)}</td>
            </tr>
          }
        />
      </SectionCard>

      {/* ══ Row 4: Notes + Summary ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Notes */}
        <SectionCard icon={FileText} label="Notes & Terms" iconColor="text-slate-500" className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                Internal Notes
                <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>(not visible to supplier)</span>
              </p>
              <div
                className="rounded-lg p-3 text-xs leading-relaxed min-h-[72px]"
                style={{ background: "var(--bg-elevated)", color: po.internalNotes ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                {po.internalNotes || "No internal notes."}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                Supplier Notes / Terms &amp; Conditions
              </p>
              <div
                className="rounded-lg p-3 text-xs leading-relaxed min-h-[72px]"
                style={{ background: "var(--bg-elevated)", color: po.supplierNotes ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                {po.supplierNotes || "No supplier notes."}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Summary */}
        <SectionCard icon={Calculator} label="Order Summary" iconColor="text-emerald-600" className="lg:col-span-2">
          <div className="space-y-1">
            {[
              { label: "Sub Total",      value: fmtAmt(po.subtotal),      cls: "" },
              { label: "Total Discount", value: `(${fmtAmt(po.totalDiscount)})`, cls: "text-red-500" },
              { label: "Total Tax / VAT",value: `+ ${fmtAmt(po.totalTax)}`, cls: "" },
              { label: "Shipping Cost",  value: fmtAmt(po.shippingCost),  cls: "" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span className={`text-sm font-medium tabular-nums ${cls}`} style={!cls ? { color: "var(--text-primary)" } : {}}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-3 rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(22,163,74,0.03) 100%)",
              border: "1px solid rgba(22,163,74,0.2)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Grand Total</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{po.currency}</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600 tabular-nums">{fmtAmt(po.grandTotal)}</p>
            </div>
            <div className="mt-2 pt-2 flex justify-between text-xs border-t" style={{ borderColor: "rgba(22,163,74,0.2)", color: "var(--text-muted)" }}>
              <span>{po.items.length} line item{po.items.length !== 1 ? "s" : ""}</span>
              <span>Disc: {fmtAmt(po.totalDiscount)} · Tax: {fmtAmt(po.totalTax)}</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ══ Row 5: Activity Timeline ══════════════════════════════════════ */}
      <SectionCard icon={Clock} label="Activity &amp; Audit Trail" iconColor="text-slate-500">
        <div className="relative pl-4">
          {/* vertical line */}
          <div
            className="absolute left-4 top-2 bottom-2 w-px"
            style={{ background: "var(--border-strong)", transform: "translateX(-50%)" }}
          />
          <div className="space-y-5">
            {po.timeline.map((evt, i) => {
              const c = TIMELINE_COLORS[evt.color] || TIMELINE_COLORS.emerald;
              return (
                <div key={i} className="relative flex items-start gap-3 pl-5">
                  <div className={`absolute left-0 w-3 h-3 rounded-full ring-4 ring-white flex-shrink-0 mt-0.5 ${c.dot} ${c.ring}`}
                    style={{ left: -5, top: 4 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-semibold ${c.text}`}>{evt.label}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>by {evt.by}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {fmtDateTime(evt.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* ══ Footer ══════════════════════════════════════════════════════════ */}
      <div className="card flex flex-wrap items-center justify-between gap-3" style={{ padding: "12px 20px" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Created on {fmtDateTime(po.createdDate)} by {po.createdBy}
        </p>
        <div className="flex items-center gap-2">
          <button className="btn-outline text-sm flex items-center gap-1.5" onClick={() => navigate("/purchase/order")}>
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          {canEdit && (
            <button className="btn-primary text-sm flex items-center gap-1.5">
              <Edit2 className="w-4 h-4" /> Edit PO
            </button>
          )}
        </div>
      </div>

      {/* ══ Hidden Print Content ══════════════════════════════════════════ */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "-9999px", pointerEvents: "none" }}>
        <div ref={printRef} style={{ background: "#fff", width: "210mm" }}>
          <PurchasePrintLayout docType="Purchase Order" docNo={po.poNo} docDate={po.poDate} status={po.status}>

            {/* Order Info + Supplier & Terms */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <PrintSection title="Order Details">
                <PrintRow label="PO Number"         value={po.poNo}                  mono />
                <PrintRow label="PO Date"            value={fmtDate(po.poDate)} />
                <PrintRow label="Expected Delivery"  value={fmtDate(po.expectedDate)} />
                <PrintRow label="Priority"           value={po.priority} />
                <PrintRow label="Currency"           value={po.currency} />
                <PrintRow label="Warehouse"          value={po.warehouse} />
                <PrintRow label="Created By"         value={po.createdBy} />
                <PrintRow label="Created Date"       value={fmtDateTime(po.createdDate)} />
              </PrintSection>
              <PrintSection title="Supplier & Terms">
                <PrintRow label="Supplier Name"  value={po.supplier.name} />
                <PrintRow label="Contact Person" value={po.supplier.contact} />
                <PrintRow label="Phone"          value={po.supplier.phone} />
                <PrintRow label="Email"          value={po.supplier.email} />
                <PrintRow label="Address"        value={po.supplier.address} />
                <PrintRow label="Payment Terms"  value={po.paymentTerms} />
                <PrintRow label="Shipping Method" value={po.shippingMethod} />
                {po.referenceNo && <PrintRow label="Supplier Ref" value={po.referenceNo} mono />}
                {po.buyerRef    && <PrintRow label="Internal Ref" value={po.buyerRef}    mono />}
              </PrintSection>
            </div>

            {/* Items Table */}
            <PrintSection title="Order Items">
              <PrintTable headers={[
                { label: "#",              align: "center" },
                { label: "Item Description" },
                { label: "UOM",            align: "center" },
                { label: "Qty",            align: "right"  },
                { label: "Unit Price (৳)", align: "right"  },
                { label: "Disc %",         align: "right"  },
                { label: "Tax %",          align: "right"  },
                { label: "Disc Amt",       align: "right"  },
                { label: "Tax Amt",        align: "right"  },
                { label: "Total (৳)",      align: "right"  },
              ]}>
                {po.items.map((row, idx) => (
                  <tr key={row.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                    <PrintTd align="center" muted>{idx + 1}</PrintTd>
                    <PrintTd bold>{row.name}</PrintTd>
                    <PrintTd align="center" muted>{row.uom}</PrintTd>
                    <PrintTd align="right">{row.qty}</PrintTd>
                    <PrintTd align="right">{fmtAmt(row.unitPrice)}</PrintTd>
                    <PrintTd align="right" style={{ color: row.discPct > 0 ? "#dc2626" : "#6b7280" }}>{row.discPct > 0 ? `${row.discPct}%` : "—"}</PrintTd>
                    <PrintTd align="right" style={{ color: row.taxPct  > 0 ? "#2563eb" : "#6b7280" }}>{row.taxPct  > 0 ? `${row.taxPct}%`  : "—"}</PrintTd>
                    <PrintTd align="right" style={{ color: row.discAmt > 0 ? "#dc2626" : "#6b7280" }}>{row.discAmt > 0 ? `(${fmtAmt(row.discAmt)})` : "—"}</PrintTd>
                    <PrintTd align="right" style={{ color: row.taxAmt  > 0 ? "#2563eb" : "#6b7280" }}>{row.taxAmt  > 0 ? fmtAmt(row.taxAmt) : "—"}</PrintTd>
                    <PrintTd align="right" bold>{fmtAmt(row.total)}</PrintTd>
                  </tr>
                ))}
                {/* Subtotal row */}
                <tr style={{ background: "#f9fafb" }}>
                  <td colSpan={9} style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 600, fontSize: 10, color: "#374151" }}>Items Subtotal</td>
                  <td style={{ padding: "5px 6px", border: "1px solid #d1d5db", textAlign: "right", fontWeight: 700, fontSize: 10 }}>{fmtAmt(po.subtotal)}</td>
                </tr>
              </PrintTable>
            </PrintSection>

            {/* Summary + Notes side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
              {(po.internalNotes || po.supplierNotes) && (
                <PrintSection title="Notes & Terms">
                  {po.internalNotes && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>Internal Notes (not visible to supplier)</div>
                      <div style={{ fontSize: 11, color: "#374151", background: "#f9fafb", padding: "6px 8px", borderRadius: 4, border: "1px solid #e5e7eb" }}>{po.internalNotes}</div>
                    </div>
                  )}
                  {po.supplierNotes && (
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>Supplier Notes / Terms & Conditions</div>
                      <div style={{ fontSize: 11, color: "#374151", background: "#f9fafb", padding: "6px 8px", borderRadius: 4, border: "1px solid #e5e7eb" }}>{po.supplierNotes}</div>
                    </div>
                  )}
                </PrintSection>
              )}
              <div style={{ minWidth: 240 }}>
                <PrintSection title="Order Summary">
                  <PrintRow label="Sub Total"         value={`৳ ${fmtAmt(po.subtotal)}`} />
                  {po.totalDiscount > 0 && <PrintRow label="Total Discount" value={`(৳ ${fmtAmt(po.totalDiscount)})`} />}
                  {po.totalTax > 0      && <PrintRow label="Total Tax / VAT" value={`+ ৳ ${fmtAmt(po.totalTax)}`} />}
                  {po.shippingCost > 0  && <PrintRow label="Shipping Cost"  value={`৳ ${fmtAmt(po.shippingCost)}`} />}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 2px", fontSize: 12, borderTop: "2px solid #16a34a", marginTop: 4 }}>
                    <span style={{ fontWeight: 700, color: "#374151" }}>Grand Total ({po.currency})</span>
                    <span style={{ fontWeight: 700, color: "#16a34a" }}>৳ {fmtAmt(po.grandTotal)}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, textAlign: "right" }}>
                    {po.items.length} line item{po.items.length !== 1 ? "s" : ""}
                  </div>
                </PrintSection>
              </div>
            </div>

          </PurchasePrintLayout>
        </div>
      </div>
    </motion.div>
  );
}
