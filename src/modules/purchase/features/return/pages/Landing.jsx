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
const STATUSES  = ["Draft", "Approved", "Completed"];
const TYPES     = ["GRN Based", "Direct"];
const SUPPLIERS = [
  "Alpha Tech Supplies",
  "Beta Trading Co. Ltd.",
  "Gamma Electronics Ltd.",
  "Delta Logistics Inc.",
  "Epsilon Office Solutions",
];
const REASONS = ["Damaged", "Wrong Item", "Quality Issue", "Over Delivery", "Expired", "Price Dispute"];

const ALL_ROWS = Object.freeze(
  Array.from({ length: 250 }, (_, i) => {
    const isGRNBased = i % 3 !== 2;
    return {
      id:          i + 1,
      prNo:        "PR-" + String(3000 + i),
      returnType:  isGRNBased ? "GRN Based" : "Direct",
      grnRef:      isGRNBased ? "GRN-" + String(2000 + (i % 50)) : "—",
      supplier:    SUPPLIERS[i % SUPPLIERS.length],
      returnDate:  new Date(2025, i % 12, (i % 28) + 1),
      totalAmount: 2000 + ((i * 6173) % 38000),
      returnReason:REASONS[i % REASONS.length],
      status:      STATUSES[i % STATUSES.length],
      createdBy:   "User " + ((i % 5) + 1),
      createdDate: new Date(2025, i % 12, (i % 28) + 1, 10, i % 55),
    };
  })
);

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const styles = {
    "GRN Based": "bg-violet-50 text-violet-700 border-violet-200",
    "Direct":    "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${styles[type] || styles["Direct"]}`}>
      {type}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PurchaseReturnLanding() {
  const navigate = useNavigate();

  const [search,      setSearch]      = useState("");
  const [supplier,    setSupplier]    = useState("");
  const [status,      setStatus]      = useState("");
  const [returnType,  setReturnType]  = useState("");
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(20);
  const [deletedIds,  setDeletedIds]  = useState(new Set());
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Purchase Return?")) {
      setDeletedIds((prev) => new Set([...prev, id]));
    }
  };

  const filtered = useMemo(() => {
    const sl = search.toLowerCase();
    return ALL_ROWS.filter((r) => {
      if (deletedIds.has(r.id)) return false;
      if (sl && !r.prNo.toLowerCase().includes(sl) && !r.grnRef.toLowerCase().includes(sl) && !r.supplier.toLowerCase().includes(sl)) return false;
      if (supplier   && r.supplier   !== supplier)   return false;
      if (status     && r.status     !== status)     return false;
      if (returnType && r.returnType !== returnType) return false;
      if (fromDate   && r.returnDate < new Date(fromDate)) return false;
      if (toDate     && r.returnDate > new Date(toDate))   return false;
      return true;
    });
  }, [search, supplier, status, returnType, fromDate, toDate, deletedIds]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSupplier(""); setStatus(""); setReturnType("");
    setFromDate(""); setToDate(""); setPage(1);
  };

  const FilterSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
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
        label="Return Type"
        options={[{ label: "All Types", value: "" }, ...TYPES.map((t) => ({ label: t, value: t }))]}
        value={returnType ? { label: returnType, value: returnType } : { label: "All Types", value: "" }}
        onChange={(opt) => { setReturnType(opt.value); setPage(1); }}
        placeholder="All Types"
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
      title: "PR No", dataIndex: "prNo",
      render: (v) => <span className="font-semibold font-mono text-rose-600">{v}</span>,
    },
    {
      title: "Type", dataIndex: "returnType", textAlign: "center",
      render: (v) => <TypeBadge type={v} />,
    },
    {
      title: "GRN Reference", dataIndex: "grnRef",
      render: (v) => v === "—"
        ? <span style={{ color: "var(--text-muted)" }}>—</span>
        : <span className="font-mono text-emerald-600">{v}</span>,
    },
    { title: "Supplier",     dataIndex: "supplier" },
    { title: "Return Date",  dataIndex: "returnDate",  render: (d) => formatDate(d) },
    {
      title: "Total Amount", dataIndex: "totalAmount", textAlign: "right",
      render: (amt) => (
        <span className="font-semibold tabular-nums">
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
          <PView   onClick={() => navigate(`/purchase/return/${row.id}`)} />
          <PEdit   onClick={() => navigate(`/purchase/return/edit/${row.id}`)} />
          <PPrint  onClick={() => navigate(`/purchase/return/${row.id}?autoprint=1`)} />
          <PDelete onClick={() => handleDelete(row.id)} />
        </div>
      ),
    },
  ];

  const headerButtons = [
    {
      label: "Create Purchase Return",
      variant: "primary",
      className: "text-sm",
      onClick: () => navigate("/purchase/return/create"),
    },
  ];

  return (
    <CommonLandingLayout
      title="Purchase Returns"
      headerButtons={headerButtons}
      showSearch
      onSearch={(val) => { setSearch(val); setPage(1); }}
      searchPlaceholder="Search PR No, GRN or supplier…"
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
