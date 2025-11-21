import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Printer, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../../../common/Header";
import SearchInput from "../../../common/SearchInput";
import Dropdown from "../../../common/Dropdown";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import Table from "../../../common/Table";
import Pagination from "../../../common/Pagination";
import Card from "../../../common/Card";

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
  const pageSize = 10;

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

  // const totalPages = Math.ceil(filtered.length / pageSize)
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <Header
        title={t("purchase.order")}
        right={
          <div className="flex gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder={t("common.search", "Search PO or Supplier")}
            />{" "}
            <Link to="/purchase/order/create">
              <Button
                variant="primary"
                className="flex items-center gap-1 text-sm"
              >
                <Plus size={14} />{" "}
                {t(
                  "purchase.dash.actions.createPO",
                  "Create New Purchase Order"
                )}
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-1">
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
      </Card>

      <Table
        columns={[
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
            title: t(
              "purchase.dash.filters.dateRange",
              "Expected Delivery Date"
            ),
            dataIndex: "expectedDate",
            render: (d) => formatDate(d),
          },
          {
            title: t("purchase.dash.kpis.totalAmount", "Total Amount"),
            dataIndex: "totalAmount",
            render: (amt) => `৳ ${amt.toFixed(2).toLocaleString()}`,
            textAlign:"right"
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
            render: (_, row) => (
              <div className="flex gap-2 justify-center">
                <Link
                  to={`/purchase/order/${row.poNo}`}
                  className="icon-btn"
                  title={t("common.view", "View")}
                >
                  <Eye size={16} />
                </Link>
                <Link
                  to={`/purchase/order/${row.poNo}/edit`}
                  className="icon-btn"
                  title={t("common.edit", "Edit")}
                >
                  <Pencil size={16} />
                </Link>
                <button className="icon-btn" title={t("common.print", "Print")}>
                  <Printer size={16} />
                </button>
                <button
                  className="icon-btn text-red-600"
                  title={t("common.delete", "Delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ),
            textAlign:"center"
          },
        ]}
        data={pageRows}
        emptyText={t(
          "purchase.dash.lists.recentPOs",
          "No purchase orders found."
        )}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2 text-sm">
        <span className="text-gray-600">
          {t("common.showing", "Showing")} {(page - 1) * pageSize + 1} -{" "}
          {Math.min(page * pageSize, filtered.length)} {t("common.of", "of")}{" "}
          {filtered.length}
        </span>
        <Pagination
          current={page}
          total={filtered.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}
function formatDateTime(d) {
  return d.toISOString().replace("T", " ").slice(0, 16);
}

function StatusBadge({ status }) {
  const colors = {
    Draft: "bg-gray-100 text-gray-700 border-gray-200",
    Approved: "bg-blue-100 text-blue-700 border-blue-200",
    "Partially Received": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span
      className={`text-[11px] rounded-md border ${colors[status]}`}
      style={{padding:"4px"}}
    >
      {status}
    </span>
  );
}
