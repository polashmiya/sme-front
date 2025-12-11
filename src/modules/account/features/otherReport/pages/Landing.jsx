import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import { formatDate } from "../../../../../common/utils";

const REPORT_TYPES = ["Aging Receivables", "Aging Payables", "Budget Utilization"];

const rows = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  reportType: REPORT_TYPES[i % REPORT_TYPES.length],
  periodFrom: new Date(2025, (i % 6), 1),
  periodTo: new Date(2025, (i % 6), 28),
  metric1: Math.floor(Math.random() * 100000),
  metric2: Math.floor(Math.random() * 100000),
}));

export default function OtherReportLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.reportType.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (type && r.reportType !== type) return false;
      return true;
    });
  }, [search, type]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("account.report.type", "Report Type")}
          options={[
            { label: t("common.all", "All"), value: "" },
            ...REPORT_TYPES.map((s) => ({ label: s, value: s })),
          ]}
          value={type ? { label: type, value: type } : { label: t("common.all", "All"), value: "" }}
          onChange={(opt) => {
            setType(opt.value);
            setPage(1);
          }}
          className="w-full"
        />
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("account.report.type", "Report Type"), dataIndex: "reportType" },
    { title: t("account.report.periodFrom", "Period From"), dataIndex: "periodFrom", render: (d) => formatDate(d) },
    { title: t("account.report.periodTo", "Period To"), dataIndex: "periodTo", render: (d) => formatDate(d) },
    { title: t("account.report.metric1", "Metric 1"), dataIndex: "metric1", textAlign: "right" },
    { title: t("account.report.metric2", "Metric 2"), dataIndex: "metric2", textAlign: "right" },
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
      title={t("account.other", "Other Report")}
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
