import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import StatusBadge from "../../../../../common/components/StatusBadge";
import { formatDate, formatDateTime } from "../../../../../common/utils";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      label: t("inventory.adjustment.create", "Add Stock Adjustment"),
      type: "primary",
      onClick: () => navigate("/inventory/adjustment/add"),
    },
  ];

  const FilterSection = () => {
    const values = { warehouse, status, fromDate, toDate };
    const setValue = (name, value) => {
      switch (name) {
        case 'warehouse': setWarehouse(value?.value || value || ''); break;
        case 'status': setStatus(value?.value || value || ''); break;
        case 'fromDate': setFromDate(value || ''); break;
        case 'toDate': setToDate(value || ''); break;
        default: break;
      }
      setPage(1);
    };
    const fields = [
      { ddl: { name: 'warehouse', label: t('inventory.adjustment.warehouse','Warehouse'), options: [{ label: t('common.all','All'), value: '' }, ...WAREHOUSES.map(s=>({label:s,value:s}))] } },
      { ddl: { name: 'status', label: t('common.status','Status'), options: [{ label: t('common.all','All'), value: '' }, ...STATUSES.map(s=>({label:s,value:s}))] } },
      { input: { name: 'fromDate', label: t('common.fromDate','From Date'), type: 'date', value: fromDate } },
      { input: { name: 'toDate', label: t('common.toDate','To Date'), type: 'date', value: toDate } },
      { button: { label: t('common.reset','Reset Filters'),className:"mt-6", variant: 'outline', onClick: ()=>{ setSearch(''); setWarehouse(''); setStatus(''); setFromDate(''); setToDate(''); setPage(1); } } },
    ];
    // For non-RHF usage, Fields reads from `values` and uses `setValue(name, value)`
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

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
