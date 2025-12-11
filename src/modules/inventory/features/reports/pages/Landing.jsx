import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import Input from "../../../../../common/components/Input";
import { formatDate } from "../../../../../common/utils";

const REPORT_TYPES = [
  "Stock Movement",
  "Stock Ledger",
  "Item Valuation",
  "Warehouse Summary",
];

const rows = Array.from({ length: 150 }).map((_, i) => ({
  id: i + 1,
  reportType: REPORT_TYPES[i % REPORT_TYPES.length],
  periodFrom: new Date(2025, (i % 6), 1),
  periodTo: new Date(2025, (i % 6), 28),
  totalRecords: Math.floor(Math.random() * 1000),
  totalQty: Math.floor(Math.random() * 2500) + 100,
}));

export default function InventoryReportsLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.reportType.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (type && r.reportType !== type) return false;
      if (fromDate && r.periodFrom < new Date(fromDate)) return false;
      if (toDate && r.periodTo > new Date(toDate)) return false;
      return true;
    });
  }, [search, type, fromDate, toDate]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-5 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("inventory.report.type", "Report Type")}
          options={[{ label: t("common.all", "All"), value: "" }, ...REPORT_TYPES.map((s) => ({ label: s, value: s }))]}
          value={type ? { label: type, value: type } : { label: t("common.all", "All"), value: "" }}
          onChange={(opt) => {
            setType(opt.value);
            setPage(1);
          }}
          className="w-full"
        />
      </div>
      <div>
        <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} label={t("common.fromDate", "From Date")} />
      </div>
      <div>
        <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} label={t("common.toDate", "To Date")} />
      </div>
      <div className="flex flex-col justify-end">
        <button type="button" className="btn-outline text-xs" onClick={() => { setSearch(""); setType(""); setFromDate(""); setToDate(""); setPage(1); }}>
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("inventory.report.type", "Report Type"), dataIndex: "reportType" },
    { title: t("inventory.report.periodFrom", "Period From"), dataIndex: "periodFrom", render: (d) => formatDate(d) },
    { title: t("inventory.report.periodTo", "Period To"), dataIndex: "periodTo", render: (d) => formatDate(d) },
    { title: t("inventory.report.totalQty", "Total Qty"), dataIndex: "totalQty", textAlign: "right" },
    { title: t("inventory.report.totalRecords", "Total Records"), dataIndex: "totalRecords", textAlign: "right" },
  ];

  const pagination = {
    current: page,
    total: filtered.length,
    pageSize,
    onChange: setPage,
    onPageSizeChange: (size) => { setPageSize(size); setPage(1); },
    showTotal: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  return (
    <CommonLandingLayout
      title={t("inventory.report", "Inventory Reports")}
      headerButtons={[]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search report type")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
