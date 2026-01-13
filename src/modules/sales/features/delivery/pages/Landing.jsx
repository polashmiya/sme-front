import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import Input from "../../../../../common/components/Input";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate } from "../../../../../common/utils";

const STATUSES = ["Pending", "Scheduled", "Delivered"];
const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  soNo: "SO-" + String(2500 + i),
  eta: new Date(2025, 1, (i % 28) + 1),
  status: STATUSES[i % STATUSES.length],
  address: `Address ${i + 1}, City`,
}));

export default function SalesDeliveryLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.soNo.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (status && r.status !== status) return false;
      if (date && formatDate(r.eta) !== formatDate(new Date(date))) return false;
      return true;
    });
  }, [search, status, date]);

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
      <Input
        type="date"
        label={t("sales.delivery.date", "Delivery Date")}
        value={date}
        onChange={(e) => { setDate(e.target.value); setPage(1); }}
      />
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), dataIndex: "sl", render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("sales.order", "SO No"), dataIndex: "soNo" },
    { title: t("sales.deliveryEta", "ETA"), dataIndex: "eta", render: (d) => formatDate(d) },
    { title: t("sales.address", "Address"), dataIndex: "address" },
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
      title={t("sales.delivery", "Sales Delivery")}
      headerButtons={[
        {
          label: t("sales.delivery.create", "Create Delivery"),
          type: "primary",
          onClick: () => navigate("/sales/delivery/create"),
        },
      ]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search SO")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
