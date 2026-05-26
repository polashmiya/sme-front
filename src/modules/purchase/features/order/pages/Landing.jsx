import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import { PDelete, PEdit, PPrint, PView } from "../../../../../common/components/Icons";
import Input from "../../../../../common/components/Input";
import StatusBadge from "../../../../../common/components/StatusBadge";
import Button from "../../../../../common/components/Button";
import { formatDate, formatDateTime } from "../../../../../common/utils";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const STATUSES  = ["Draft", "Approved", "Partially Received", "Completed"];
const SUPPLIERS = [
  "Alpha Tech Supplies",
  "Beta Trading Co. Ltd.",
  "Gamma Electronics Ltd.",
  "Delta Logistics Inc.",
  "Epsilon Office Solutions",
  "Zeta Industrial Corp.",
  "Sigma Business Equipment",
  "Omega IT Solutions Ltd.",
  "Prime Hardware & Tools",
  "Vertex Supply Chain Co.",
];
const CREATED_BY = [
  "Md. Rafiqul Islam", "Fatema Begum", "Karim Ahmed",
  "Nasrin Akhter", "Jahanara Sultana", "Rahim Uddin",
  "Salma Khatun", "Anisur Rahman",
];

// Deterministic pseudo-random helper
const hash = (n) => ((n * 2654435761) >>> 0) % 100000;

const ALL_ROWS = Object.freeze(
  Array.from({ length: 120 }, (_, i) => {
    const n   = i + 1;
    // spread dates across Jan 2024 – May 2026
    const daysOffset = Math.floor(hash(n * 3) / 100000 * 880);
    const base = new Date(2024, 0, 1 + daysOffset);
    const exp  = new Date(base.getTime() + (15 + (hash(n) % 45)) * 86400000);
    const amt  = 5000 + Math.floor(hash(n * 7) / 100000 * 495000);
    return {
      id:           n,
      poNo:         "PO-" + String(1000 + i),
      supplier:     SUPPLIERS[i % SUPPLIERS.length],
      poDate:       base,
      expectedDate: exp,
      totalAmount:  n === 1 ? 4_250_000 : amt,   // PO-1000 is the 105-item bulk order
      status:       STATUSES[i % STATUSES.length],
      createdBy:    CREATED_BY[i % CREATED_BY.length],
      createdDate:  new Date(base.getTime() + (hash(n * 11) % 55) * 60000),
    };
  })
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function PurchaseOrderLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ── filter state
  const [search,   setSearch]   = useState("");
  const [supplier, setSupplier] = useState("");
  const [status,   setStatus]   = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [minAmt,   setMinAmt]   = useState("");
  const [maxAmt,   setMaxAmt]   = useState("");

  // ── pagination
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ── deleted ids
  const [deletedIds, setDeletedIds] = useState(new Set());
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Purchase Order?")) {
      setDeletedIds((prev) => new Set([...prev, id]));
    }
  };

  // ── filtered rows
  const filtered = useMemo(() => {
    const sl = search.toLowerCase();
    return ALL_ROWS.filter((r) => {
      if (deletedIds.has(r.id)) return false;
      if (sl && !r.poNo.toLowerCase().includes(sl) && !r.supplier.toLowerCase().includes(sl)) return false;
      if (supplier && r.supplier !== supplier) return false;
      if (status   && r.status   !== status)   return false;
      if (fromDate && r.poDate   < new Date(fromDate)) return false;
      if (toDate   && r.poDate   > new Date(toDate))   return false;
      if (minAmt   && r.totalAmount < Number(minAmt))   return false;
      if (maxAmt   && r.totalAmount > Number(maxAmt))   return false;
      return true;
    });
  }, [search, supplier, status, fromDate, toDate, minAmt, maxAmt, deletedIds]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSupplier(""); setStatus(""); setFromDate("");
    setToDate(""); setMinAmt(""); setMaxAmt("");
    setPage(1);
  };

  // ── Filter section (closure captures state from parent)
  const FilterSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
      <Dropdown
        label={t("purchase.dash.filters.supplier", "Supplier")}
        options={[
          { label: t("common.all", "All"), value: "" },
          ...SUPPLIERS.map((s) => ({ label: s, value: s })),
        ]}
        value={supplier ? { label: supplier, value: supplier } : { label: t("common.all", "All"), value: "" }}
        onChange={(opt) => { setSupplier(opt.value); setPage(1); }}
        placeholder="All Suppliers"
        searchable
      />

      <Dropdown
        label={t("common.status", "Status")}
        options={[
          { label: t("common.all", "All"), value: "" },
          ...STATUSES.map((s) => ({ label: s, value: s })),
        ]}
        value={status ? { label: status, value: status } : { label: t("common.all", "All"), value: "" }}
        onChange={(opt) => { setStatus(opt.value); setPage(1); }}
        placeholder="All Statuses"
      />

      <Input
        type="date"
        label={t("common.fromDate", "From Date")}
        value={fromDate}
        onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
      />

      <Input
        type="date"
        label={t("common.toDate", "To Date")}
        value={toDate}
        onChange={(e) => { setToDate(e.target.value); setPage(1); }}
      />

      <div className="w-full">
        <label className="block mb-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {t("common.minAmount", "Min Amount (৳)")}
        </label>
        <input
          type="number"
          min="0"
          className="ctrl-input"
          placeholder="0"
          value={minAmt}
          onChange={(e) => { setMinAmt(e.target.value); setPage(1); }}
        />
      </div>

      <div className="w-full">
        <label className="block mb-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {t("common.maxAmount", "Max Amount (৳)")}
        </label>
        <input
          type="number"
          min="0"
          className="ctrl-input"
          placeholder="No limit"
          value={maxAmt}
          onChange={(e) => { setMaxAmt(e.target.value); setPage(1); }}
        />
      </div>

      <div className="flex flex-col justify-end">
        <Button variant="outline" className="text-xs w-full" onClick={resetFilters}>
          {t("common.reset", "Reset Filters")}
        </Button>
      </div>
    </div>
  );

  // ── Table columns
  const tableColumns = [
    {
      title: t("common.sl", "SL"),
      dataIndex: "sl",
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
      textAlign: "center",
    },
    {
      title: t("purchase.order", "PO Number"),
      dataIndex: "poNo",
      render: (v) => (
        <span className="font-semibold font-mono text-emerald-600">{v}</span>
      ),
    },
    {
      title: t("purchase.dash.filters.supplier", "Supplier"),
      dataIndex: "supplier",
    },
    {
      title: t("common.poDate", "PO Date"),
      dataIndex: "poDate",
      render: (d) => formatDate(d),
    },
    {
      title: t("common.expectedDate", "Expected Date"),
      dataIndex: "expectedDate",
      render: (d) => formatDate(d),
    },
    {
      title: t("purchase.dash.kpis.totalAmount", "Total Amount"),
      dataIndex: "totalAmount",
      render: (amt) => (
        <span className="font-semibold tabular-nums">
          {"৳ " + Number(amt).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
        </span>
      ),
      textAlign: "right",
    },
    {
      title: t("common.status", "Status"),
      dataIndex: "status",
      render: (s) => <StatusBadge status={s} />,
      textAlign: "center",
    },
    {
      title: t("common.createdBy", "Created By"),
      dataIndex: "createdBy",
    },
    {
      title: t("common.createdDate", "Created Date"),
      dataIndex: "createdDate",
      render: (d) => formatDateTime(d),
    },
    {
      title: t("common.actions", "Actions"),
      dataIndex: "actions",
      textAlign: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <PView  onClick={() => navigate(`/purchase/order/${row.id}`)} />
          <PEdit  onClick={() => navigate(`/purchase/order/edit/${row.id}`)} />
          <PPrint onClick={() => navigate(`/purchase/order/${row.id}?autoprint=1`)} />
          <PDelete onClick={() => handleDelete(row.id)} />
        </div>
      ),
    },
  ];

  // ── Header buttons
  const headerButtons = [
    {
      label: t("purchase.dash.actions.createPO", "Create New Purchase Order"),
      variant: "primary",
      className: "text-sm",
      onClick: () => navigate("/purchase/order/create"),
    },
  ];

  // ── Pagination config
  const pagination = {
    current:         page,
    total:           filtered.length,
    pageSize,
    onChange:        (p) => setPage(p),
    onPageSizeChange:(s) => { setPageSize(s); setPage(1); },
    showTotal:       true,
    pageSizeOptions: [10, 20, 50, 100, 500, 1000],
  };

  return (
    <CommonLandingLayout
      title={t("purchase.order", "Purchase Orders")}
      headerButtons={headerButtons}
      showSearch
      onSearch={(val) => { setSearch(val); setPage(1); }}
      searchPlaceholder={t("common.search", "Search PO no. or supplier…")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
