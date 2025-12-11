import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import CommonLandingLayout from "../../../../../common/CommonLandingLayout";
import Dropdown from "../../../../../common/Dropdown";
import StatusBadge from "../../../../../common/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";

const STATUSES = ["Draft", "Approved", "Cancelled"];
const WAREHOUSES = ["WH1", "WH2", "WH3"];

const rows = Array.from({ length: 300 }).map((_, i) => ({
  id: i + 1,
  adjNo: `ADJ-${1000 + i}`,
  warehouse: WAREHOUSES[i % WAREHOUSES.length],
  date: new Date(2025, 0, (i % 28) + 1),
  reason: ["Cycle Count", "Damage", "Shrinkage"][i % 3],
  totalQty: Math.floor(Math.random() * 100) + 10,
  totalAmount: Math.floor(Math.random() * 40000) + 5000,
  status: STATUSES[i % STATUSES.length],
  createdBy: `User ${((i % 5) + 1)}`,
  createdDate: new Date(2025, 0, (i % 28) + 1, 10, i % 55),
}));

export default function StockAdjustmentLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.adjNo.toLowerCase().includes(search.toLowerCase()) &&
        !r.reason.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (warehouse && r.warehouse !== warehouse) return false;
      if (status && r.status !== status) return false;
      if (fromDate && r.date < new Date(fromDate)) return false;
      if (toDate && r.date > new Date(toDate)) return false;
      return true;
    });
  }, [search, warehouse, status, fromDate, toDate]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const headerButtons = [
    {
      variant: "primary",
      className: "flex items-center gap-1 text-sm",
      children: (
        <>
          <Plus size={14} /> {t("inventory.adjustment.create", "New Adjustment")}
        </>
      ),
      onClick: () => {},
    },
  ];

  const FilterSection = () => (
    <div className="grid md:grid-cols-5 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("inventory.adjustment.warehouse", "Warehouse")}
          options={[{ label: t("common.all", "All"), value: "" }, ...WAREHOUSES.map((s) => ({ label: s, value: s }))]}
          value={warehouse ? { label: warehouse, value: warehouse } : { label: t("common.all", "All"), value: "" }}
          onChange={(opt) => {
            setWarehouse(opt.value);
            setPage(1);
          }}
          className="w-full"
        />
      </div>
      <div>
        <Dropdown
          label={t("common.status", "Status")}
          options={[{ label: t("common.all", "All"), value: "" }, ...STATUSES.map((s) => ({ label: s, value: s }))]}
          value={status ? { label: status, value: status } : { label: t("common.all", "All"), value: "" }}
          onChange={(opt) => {
            setStatus(opt.value);
            setPage(1);
          }}
          className="w-full"
        />
      </div>
      <div>
        <input
          type="date"
          className="input"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
        />
        <div className="text-xs text-gray-600 mt-1">{t("common.fromDate", "From Date")}</div>
      </div>
      <div>
        <input
          type="date"
          className="input"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
        />
        <div className="text-xs text-gray-600 mt-1">{t("common.toDate", "To Date")}</div>
      </div>
      <div className="flex flex-col justify-end">
        <button
          type="button"
          className="btn-outline text-xs"
          onClick={() => {
            setSearch("");
            setWarehouse("");
            setStatus("");
            setFromDate("");
            setToDate("");
            setPage(1);
          }}
        >
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("inventory.adjustment.no", "Adjustment No"), dataIndex: "adjNo" },
    { title: t("inventory.adjustment.warehouse", "Warehouse"), dataIndex: "warehouse" },
    { title: t("common.date", "Date"), dataIndex: "date", render: (d) => formatDate(d) },
    { title: t("common.reason", "Reason"), dataIndex: "reason" },
    { title: t("inventory.adjustment.totalQty", "Total Qty"), dataIndex: "totalQty", textAlign: "right" },
    { title: t("common.totalAmount", "Total Amount"), dataIndex: "totalAmount", textAlign: "right" },
    { title: t("common.status", "Status"), dataIndex: "status", render: (s) => <StatusBadge status={s} /> },
    { title: t("common.createdBy", "Created By"), dataIndex: "createdBy" },
    { title: t("common.createdDate", "Created Date"), dataIndex: "createdDate", render: (d)=>formatDateTime(d) },
  ];

  const pagination = {
    current: page,
    total: filtered.length,
    pageSize,
    onChange: setPage,
    onPageSizeChange: (size) => {
      setPageSize(size);
      setPage(1);
    },
    showTotal: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  return (
    <CommonLandingLayout
      title={t("inventory.adjustment", "Stock Adjustment")}
      headerButtons={headerButtons}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search adjustment or reason")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
