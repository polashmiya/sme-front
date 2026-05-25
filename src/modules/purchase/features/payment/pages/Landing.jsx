import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../common/components/Button";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import { PDelete, PEdit, PPrint, PView } from "../../../../../common/components/Icons";
import Input from "../../../../../common/components/Input";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";

// ─── Static Data ──────────────────────────────────────────────────────────────
const STATUSES       = ["Draft", "Approved", "Paid"];
const PAYMENT_TYPES  = ["Invoice Settlement", "Advance Payment"];
const PAY_METHODS    = ["Cash", "Bank Transfer", "Cheque / DD", "Online / NEFT"];
const SUPPLIERS      = [
  "Alpha Tech Supplies",
  "Beta Trading Co. Ltd.",
  "Gamma Electronics Ltd.",
  "Delta Logistics Inc.",
  "Epsilon Office Solutions",
];

const ALL_ROWS = Object.freeze(
  Array.from({ length: 280 }, (_, i) => {
    const isSettlement = i % 4 !== 3;
    return {
      id:           i + 1,
      pvNo:         "PV-" + String(4000 + i),
      paymentType:  isSettlement ? "Invoice Settlement" : "Advance Payment",
      poRef:        isSettlement ? "PO-" + String(1000 + (i % 50)) : "—",
      supplier:     SUPPLIERS[i % SUPPLIERS.length],
      paymentDate:  new Date(2025, i % 12, (i % 28) + 1),
      paymentMethod:PAY_METHODS[i % PAY_METHODS.length],
      amount:       5000 + ((i * 7919) % 95000),
      status:       STATUSES[i % STATUSES.length],
      createdBy:    "User " + ((i % 5) + 1),
      createdDate:  new Date(2025, i % 12, (i % 28) + 1, 14, i % 55),
    };
  })
);

// ─── Method Badge ─────────────────────────────────────────────────────────────
const METHOD_STYLES = {
  "Cash":          "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Bank Transfer": "bg-blue-50 text-blue-700 border-blue-200",
  "Cheque / DD":   "bg-violet-50 text-violet-700 border-violet-200",
  "Online / NEFT": "bg-cyan-50 text-cyan-700 border-cyan-200",
};
function MethodBadge({ method }) {
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${METHOD_STYLES[method] || METHOD_STYLES["Cash"]}`}>
      {method}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const styles = {
    "Invoice Settlement": "bg-blue-50 text-blue-700 border-blue-200",
    "Advance Payment":    "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${styles[type] || styles["Invoice Settlement"]}`}>
      {type}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PurchasePaymentLanding() {
  const navigate = useNavigate();

  const [search,      setSearch]      = useState("");
  const [supplier,    setSupplier]    = useState("");
  const [status,      setStatus]      = useState("");
  const [payType,     setPayType]     = useState("");
  const [payMethod,   setPayMethod]   = useState("");
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(20);

  const filtered = useMemo(() => {
    const sl = search.toLowerCase();
    return ALL_ROWS.filter((r) => {
      if (sl && !r.pvNo.toLowerCase().includes(sl) && !r.poRef.toLowerCase().includes(sl) && !r.supplier.toLowerCase().includes(sl)) return false;
      if (supplier  && r.supplier      !== supplier)  return false;
      if (status    && r.status        !== status)    return false;
      if (payType   && r.paymentType   !== payType)   return false;
      if (payMethod && r.paymentMethod !== payMethod) return false;
      if (fromDate  && r.paymentDate < new Date(fromDate)) return false;
      if (toDate    && r.paymentDate > new Date(toDate))   return false;
      return true;
    });
  }, [search, supplier, status, payType, payMethod, fromDate, toDate]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSupplier(""); setStatus(""); setPayType(""); setPayMethod("");
    setFromDate(""); setToDate(""); setPage(1);
  };

  const FilterSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
      <Dropdown
        label="Supplier"
        options={[{ label: "All", value: "" }, ...SUPPLIERS.map((s) => ({ label: s, value: s }))]}
        value={supplier ? { label: supplier, value: supplier } : { label: "All", value: "" }}
        onChange={(opt) => { setSupplier(opt.value); setPage(1); }}
        placeholder="All Suppliers"
        searchable
      />
      <Dropdown
        label="Status"
        options={[{ label: "All", value: "" }, ...STATUSES.map((s) => ({ label: s, value: s }))]}
        value={status ? { label: status, value: status } : { label: "All", value: "" }}
        onChange={(opt) => { setStatus(opt.value); setPage(1); }}
        placeholder="All Statuses"
      />
      <Dropdown
        label="Payment Type"
        options={[{ label: "All Types", value: "" }, ...PAYMENT_TYPES.map((t) => ({ label: t, value: t }))]}
        value={payType ? { label: payType, value: payType } : { label: "All Types", value: "" }}
        onChange={(opt) => { setPayType(opt.value); setPage(1); }}
        placeholder="All Types"
      />
      <Dropdown
        label="Pay Method"
        options={[{ label: "All Methods", value: "" }, ...PAY_METHODS.map((m) => ({ label: m, value: m }))]}
        value={payMethod ? { label: payMethod, value: payMethod } : { label: "All Methods", value: "" }}
        onChange={(opt) => { setPayMethod(opt.value); setPage(1); }}
        placeholder="All Methods"
      />
      <Input type="date" label="From Date" value={fromDate}
        onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
      <Input type="date" label="To Date" value={toDate}
        onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
      <div className="flex flex-col justify-end">
        <Button variant="outline" className="text-xs w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );

  const tableColumns = [
    {
      title: "SL", dataIndex: "sl", textAlign: "center",
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    {
      title: "PV No", dataIndex: "pvNo",
      render: (v) => <span className="font-semibold font-mono text-blue-600">{v}</span>,
    },
    {
      title: "Type", dataIndex: "paymentType", textAlign: "center",
      render: (v) => <TypeBadge type={v} />,
    },
    {
      title: "PO Reference", dataIndex: "poRef",
      render: (v) => v === "—"
        ? <span style={{ color: "var(--text-muted)" }}>—</span>
        : <span className="font-mono text-emerald-600">{v}</span>,
    },
    { title: "Supplier",      dataIndex: "supplier" },
    { title: "Payment Date",  dataIndex: "paymentDate", render: (d) => formatDate(d) },
    {
      title: "Method", dataIndex: "paymentMethod", textAlign: "center",
      render: (v) => <MethodBadge method={v} />,
    },
    {
      title: "Amount", dataIndex: "amount", textAlign: "right",
      render: (amt) => (
        <span className="font-semibold tabular-nums text-blue-600">
          {"৳ " + Number(amt).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status", dataIndex: "status", textAlign: "center",
      render: (s) => <StatusBadge status={s} />,
    },
    { title: "Created By",   dataIndex: "createdBy" },
    { title: "Created Date", dataIndex: "createdDate", render: (d) => formatDateTime(d) },
    {
      title: "Actions", dataIndex: "actions", textAlign: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <PView   onClick={() => navigate(`/purchase/payment/${row.id}`)} />
          <PEdit   onClick={() => navigate(`/purchase/payment/edit/${row.id}`)} />
          <PPrint  onClick={() => {}} />
          <PDelete onClick={() => {}} />
        </div>
      ),
    },
  ];

  const headerButtons = [
    {
      label: "Create Payment Voucher",
      variant: "primary",
      className: "text-sm",
      onClick: () => navigate("/purchase/payment/create"),
    },
  ];

  return (
    <CommonLandingLayout
      title="Purchase Payments"
      headerButtons={headerButtons}
      showSearch
      onSearch={(val) => { setSearch(val); setPage(1); }}
      searchPlaceholder="Search PV No, PO or supplier…"
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={{
        current: page, total: filtered.length, pageSize,
        onChange: (p) => setPage(p),
        onPageSizeChange: (s) => { setPageSize(s); setPage(1); },
        showTotal: true,
        pageSizeOptions: [10, 20, 50, 100],
      }}
    />
  );
}
