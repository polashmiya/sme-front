import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import Input from "../../../../../common/components/Input";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate } from "../../../../../common/utils";

const STATUSES = ["Pending", "Partially Collected", "Collected", "Overdue"];
const rows = Array.from({ length: 150 }).map((_, i) => ({
  id: i + 1,
  receiptNo: "RC-" + String(3000 + i),
  customer: `Customer ${String.fromCharCode(65 + (i % 10))}`,
  dueDate: new Date(2025, 1, (i % 28) + 1),
  amountDue: Math.floor(Math.random() * 60000) + 10000,
  status: STATUSES[i % STATUSES.length],
}));

export default function SalesCollectionLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.customer.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (status && r.status !== status) return false;
      return true;
    });
  }, [search, status]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-4 gap-4 text-sm">
      <Dropdown
        label={t("common.status", "Status")}
        options={[
          { label: t("common.all", "All"), value: "" },
          ...STATUSES.map((s) => ({ label: s, value: s })),
        ]}
        value={status ? { label: status, value: status } : { label: t("common.all", "All"), value: "" }}
        onChange={(opt) => { setStatus(opt.value); setPage(1); }}
      />
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), dataIndex: "sl", render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("sales.receiptNo", "Receipt No"), dataIndex: "receiptNo" },
    { title: t("sales.customer", "Customer"), dataIndex: "customer" },
    { title: t("sales.dueDate", "Due Date"), dataIndex: "dueDate", render: (d) => formatDate(d) },
    { title: t("sales.amountDue", "Amount Due"), dataIndex: "amountDue", render: (amt) => `৳ ${amt.toFixed(2).toLocaleString()}`, textAlign: "right" },
    { title: t("common.status", "Status"), dataIndex: "status", render: (s) => <StatusBadge status={s} /> },
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
      title={t("sales.collection", "Sales Collection")}
      headerButtons={[
        {
          label: t("sales.collection.create", "Create Collection"),
          type: "primary",
          onClick: () => navigate("/sales/collection/create"),
        },
      ]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search Customer")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
