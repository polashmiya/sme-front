import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../../../common/Button";
import Dropdown from "../../../../../common/Dropdown";
import { PDelete, PEdit, PPrint, PView } from "../../../../../common/Icons";
import Input from "../../../../../common/Input";
import StatusBadge from "../../../../../common/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";
import CommonLandingLayout from "../../../../../common/CommonLandingLayout";

const STATUSES = ["Draft", "Approved", "Delivered", "Returned"];
const CUSTOMERS = ["Customer A", "Customer B", "Customer C", "Customer D"];
const rows = Array.from({ length: 300 }).map((_, i) => ({
  id: i + 1,
  soNo: "SO-" + String(2000 + i),
  customer: CUSTOMERS[i % CUSTOMERS.length],
  soDate: new Date(2025, 0, (i % 28) + 1),
  deliveryEta: new Date(2025, 1, (i % 28) + 1),
  totalAmount: Math.floor(Math.random() * 50000) + 8000,
  status: STATUSES[i % STATUSES.length],
  createdBy: "User " + ((i % 5) + 1),
  createdDate: new Date(2025, 0, (i % 28) + 1, 11, i % 55),
}));

export default function SalesOrderLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.soNo.toLowerCase().includes(search.toLowerCase()) &&
        !r.customer.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (customer && r.customer !== customer) return false;
      if (status && r.status !== status) return false;
      if (fromDate && r.soDate < new Date(fromDate)) return false;
      if (toDate && r.soDate > new Date(toDate)) return false;
      return true;
    });
  }, [search, customer, status, fromDate, toDate]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const headerButtons = [
    {
      variant: "primary",
      className: "flex items-center gap-1 text-sm",
      children: (
        <>
          <Plus size={14} /> {t("sales.order.create", "Create Sales Order")}
        </>
      ),
      as: Link,
      to: "/sales/order/create",
      onClick: () => navigate("/sales/order/create"),
    },
  ];

  const FilterSection = () => (
    <div className="grid md:grid-cols-5 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("sales.filters.customer", "Customer")}
          options={[
            { label: t("common.all", "All"), value: "" },
            ...CUSTOMERS.map((s) => ({ label: s, value: s })),
          ]}
          value={
            customer
              ? { label: customer, value: customer }
              : { label: t("common.all", "All"), value: "" }
          }
          onChange={(opt) => {
            setCustomer(opt.value);
            setPage(1);
          }}
          placeholder={t("sales.filters.customer", "Customer")}
          className="w-full"
        />
      </div>
      <div>
        <Dropdown
          label={t("common.status", "Status")}
          options={[
            { label: t("common.all", "All"), value: "" },
            ...STATUSES.map((s) => ({ label: s, value: s })),
          ]}
          value={
            status
              ? { label: status, value: status }
              : { label: t("common.all", "All"), value: "" }
          }
          onChange={(opt) => {
            setStatus(opt.value);
            setPage(1);
          }}
          placeholder={t("common.status", "Status")}
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          label={t("sales.filters.dateRange", "From Date")}
        />
      </div>
      <div>
        <Input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          label={t("sales.filters.dateRange", "To Date")}
        />
      </div>
      <div className="flex flex-col justify-end">
        <Button
          variant="outline"
          className="text-xs"
          onClick={() => {
            setSearch("");
            setCustomer("");
            setStatus("");
            setFromDate("");
            setToDate("");
            setPage(1);
          }}
        >
          {t("common.reset", "Reset Filters")}
        </Button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), dataIndex: "sl", render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("sales.order", "SO No"), dataIndex: "soNo" },
    { title: t("sales.customer", "Customer"), dataIndex: "customer" },
    { title: t("sales.date", "SO Date"), dataIndex: "soDate", render: (d) => formatDate(d) },
    { title: t("sales.deliveryEta", "Delivery ETA"), dataIndex: "deliveryEta", render: (d) => formatDate(d) },
    { title: t("sales.totalAmount", "Total Amount"), dataIndex: "totalAmount", render: (amt) => `৳ ${amt.toFixed(2).toLocaleString()}`, textAlign: "right" },
    { title: t("common.status", "Status"), dataIndex: "status", render: (s) => <StatusBadge status={s} /> },
    { title: t("common.createdBy", "Created By"), dataIndex: "createdBy" },
    { title: t("common.createdDate", "Created Date"), dataIndex: "createdDate", render: (d) => formatDateTime(d) },
    { title: t("common.actions", "Actions"), dataIndex: "actions", render: () => (
      <div className="flex gap-2 justify-center">
        <PView />
        <PEdit />
        <PPrint />
        <PDelete />
      </div>
    ), textAlign: "center" },
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
    pageSizeOptions: [10, 20, 50, 100, 500],
  };

  return (
    <CommonLandingLayout
      title={t("sales.order", "Sales Orders")}
      headerButtons={headerButtons}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search SO or Customer")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
