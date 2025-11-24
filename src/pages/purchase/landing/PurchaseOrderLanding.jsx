import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "../../../common/Button";
import CommonLandingLayout from "../../../common/CommonLandingLayout";
import Dropdown from "../../../common/Dropdown";
import {
  PDelete,
  PEdit,
  PPrint,
  PView
} from "../../../common/Icons";
import Input from "../../../common/Input";
import StatusBadge from "../../../common/StatusBadge";
import { formatDate, formatDateTime } from "../../../common/utils";

// Dummy Data
const STATUSES = ["Draft", "Approved", "Partially Received", "Completed"];
const SUPPLIERS = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"];
const rows = Array.from({ length: 1000 }).map((_, i) => ({
  id: i + 1,
  poNo: "PO-" + String(1000 + i),
  supplier: SUPPLIERS[i % SUPPLIERS.length],
  poDate: new Date(2025, 0, (i % 28) + 1),
  expectedDate: new Date(2025, 1, (i % 28) + 1),
  totalAmount: Math.floor(Math.random() * 40000) + 5000,
  status: STATUSES[i % STATUSES.length],
  createdBy: "User " + ((i % 5) + 1),
  createdDate: new Date(2025, 0, (i % 28) + 1, 10, i % 55),
}));

export default function PurchaseOrderLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.poNo.toLowerCase().includes(search.toLowerCase()) &&
        !r.supplier.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (supplier && r.supplier !== supplier) return false;
      if (status && r.status !== status) return false;
      if (fromDate && r.poDate < new Date(fromDate)) return false;
      if (toDate && r.poDate > new Date(toDate)) return false;
      return true;
    });
  }, [search, supplier, status, fromDate, toDate]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const headerButtons = [
    {
      variant: "primary",
      className: "flex items-center gap-1 text-sm",
      children: (
        <>
          <Plus size={14} />{" "}
          {t("purchase.dash.actions.createPO", "Create New Purchase Order")}
        </>
      ),
      as: Link,
      to: "/purchase/order/create",
    },
  ];

  const FilterSection = () => (
    <div className="grid md:grid-cols-5 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("purchase.dash.filters.supplier")}
          options={[
            { label: t("common.all", "All"), value: "" },
            ...SUPPLIERS.map((s) => ({ label: s, value: s })),
          ]}
          value={
            supplier
              ? { label: supplier, value: supplier }
              : { label: t("common.all", "All"), value: "" }
          }
          onChange={(opt) => {
            setSupplier(opt.value);
            setPage(1);
          }}
          placeholder={t("purchase.dash.filters.supplier")}
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
          label={t("purchase.dash.filters.dateRange", "From Date")}
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
          label={t("purchase.dash.filters.dateRange", "To Date")}
        />
      </div>
      <div className="flex flex-col justify-end">
        <Button
          variant="outline"
          className="text-xs"
          onClick={() => {
            setSearch("");
            setSupplier("");
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
    {
      title: t("common.sl", "SL"),
      dataIndex: "sl",
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
      textAlign: "center",
    },
    { title: t("purchase.order", "PO No"), dataIndex: "poNo" },
    {
      title: t("purchase.dash.filters.supplier", "Supplier Name"),
      dataIndex: "supplier",
    },
    {
      title: t("purchase.dash.filters.dateRange", "PO Date"),
      dataIndex: "poDate",
      render: (d) => formatDate(d),
    },
    {
      title: t("purchase.dash.filters.dateRange", "Expected Delivery Date"),
      dataIndex: "expectedDate",
      render: (d) => formatDate(d),
    },
    {
      title: t("purchase.dash.kpis.totalAmount", "Total Amount"),
      dataIndex: "totalAmount",
      render: (amt) => `৳ ${amt.toFixed(2).toLocaleString()}`,
      textAlign: "right",
    },
    {
      title: t("common.status", "Status"),
      dataIndex: "status",
      render: (s) => <StatusBadge status={s} />,
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
      render: () => (
        <div className="flex gap-2 justify-center">
          <PView />
          <PEdit />
          <PPrint />
          <PDelete />
        </div>
      ),
      textAlign: "center",
    },
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
    pageSizeOptions: [10, 20, 50, 100, 500, 1000],
  };

  return (
    <CommonLandingLayout
      title={t("purchase.order")}
      headerButtons={headerButtons}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search PO or Supplier")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
