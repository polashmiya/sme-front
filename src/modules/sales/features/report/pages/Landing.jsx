import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import Dropdown from "../../../../../common/components/Dropdown";
import Input from "../../../../../common/components/Input";
import { formatDate } from "../../../../../common/utils";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";

const REPORT_TYPES = ["Summary", "By Customer", "By Item"];
const rows = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  report: REPORT_TYPES[i % REPORT_TYPES.length],
  periodStart: new Date(2025, 0, 1),
  periodEnd: new Date(2025, 2, 31),
  totalSales: Math.floor(Math.random() * 200000) + 50000,
}));

export default function SalesReportLanding() {
  const { t } = useTranslation();
  const [type, setType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (type && r.report !== type) return false;
      if (dateFrom && r.periodStart < new Date(dateFrom)) return false;
      if (dateTo && r.periodEnd > new Date(dateTo)) return false;
      return true;
    });
  }, [type, dateFrom, dateTo]);

  const FilterSection = () => (
    <div className="grid md:grid-cols-4 gap-4 text-sm">
      <Dropdown
        label={t("sales.report.type", "Report Type")}
        options={[
          { label: t("common.all", "All"), value: "" },
          ...REPORT_TYPES.map((s) => ({ label: s, value: s })),
        ]}
        value={type ? { label: type, value: type } : { label: t("common.all", "All"), value: "" }}
        onChange={(opt) => setType(opt.value)}
      />
      <Input label={t("sales.filters.dateRange", "From Date")} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      <Input label={t("sales.filters.dateRange", "To Date")} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
    </div>
  );

  const tableColumns = [
    { title: t("sales.report.type", "Report"), dataIndex: "report" },
    { title: t("sales.periodStart", "Start"), dataIndex: "periodStart", render: (d) => formatDate(d) },
    { title: t("sales.periodEnd", "End"), dataIndex: "periodEnd", render: (d) => formatDate(d) },
    { title: t("sales.totalSales", "Total Sales"), dataIndex: "totalSales", render: (amt) => `৳ ${amt.toFixed(2).toLocaleString()}`, textAlign: "right" },
  ];

  return (
    <CommonLandingLayout
      title={t("sales.report", "Sales Reports")}
      showSearch={false}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={filtered}
    />
  );
}
