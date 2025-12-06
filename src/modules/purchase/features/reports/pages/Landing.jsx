import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/CommonLandingLayout";
import Dropdown from "../../../../../common/Dropdown";
import Input from "../../../../../common/Input";
import { formatDate } from "../../../../../common/utils";

const REPORT_TYPES = ["Order Summary", "Receive Summary", "Return Summary", "Payment Summary"];

const rows = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  reportType: REPORT_TYPES[i % REPORT_TYPES.length],
  periodFrom: new Date(2025, (i % 6), 1),
  periodTo: new Date(2025, (i % 6), 28),
  totalRecords: Math.floor(Math.random() * 1000),
  totalAmount: Math.floor(Math.random() * 100000) + 10000,
}));

export default function PurchaseReportsLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.reportType.toLowerCase().includes(search.toLowerCase())) return false;
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
          label={t("purchase.report.type", "Report Type")}
          options={[{ label: t("common.all", "All"), value: "" }, ...REPORT_TYPES.map((s) => ({ label: s, value: s }))]}
          value={type ? { label: type, value: type } : { label: t("common.all", "All"), value: "" }}
          onChange={(opt) => { setType(opt.value); setPage(1); }}
          className="w-full"
        />
      </div>
      <div>
        <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} label={t("purchase.dash.filters.dateRange", "From Date")} />
      </div>
      <div>
        <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} label={t("purchase.dash.filters.dateRange", "To Date")} />
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
    { title: t("purchase.report.type", "Report Type"), dataIndex: "reportType" },
    { title: t("purchase.report.periodFrom", "Period From"), dataIndex: "periodFrom", render: (d) => formatDate(d) },
    { title: t("purchase.report.periodTo", "Period To"), dataIndex: "periodTo", render: (d) => formatDate(d) },
    { title: t("purchase.dash.kpis.totalAmount", "Total Amount"), dataIndex: "totalAmount", textAlign: "right" },
    { title: t("purchase.report.totalRecords", "Total Records"), dataIndex: "totalRecords", textAlign: "right" },
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
      title={t("purchase.report", "Purchase Reports")}
      headerButtons={[]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search Report")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
