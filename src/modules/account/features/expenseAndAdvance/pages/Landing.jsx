import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";

const STATUSES = ["Pending", "Approved", "Paid"];
const EMPLOYEES = ["Alice", "Bob", "Charlie", "David"];
const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: `EXP-${100 + i}`,
  employee: EMPLOYEES[i % EMPLOYEES.length],
  category: ["Travel", "Meals", "Supplies"][i % 3],
  amount: Math.floor(Math.random() * 9000) + 1000,
  status: STATUSES[i % STATUSES.length],
}));

export default function ExpenseAdvanceLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [employee, setEmployee] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.id.toLowerCase().includes(search.toLowerCase()) &&
        !r.employee.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (status && r.status !== status) return false;
      if (employee && r.employee !== employee) return false;
      return true;
    });
  }, [search, status, employee]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const headerButtons = [
    {
      label: t("account.expense.create", "Add Expense"),
      type: "primary",
      onClick: () => navigate("/account/expense/add"),
    },
  ];

  const FilterSection = () => {
    const values = { status, employee };
    const setValue = (name, value) => {
      if (name === 'status') setStatus(value?.value || value || '');
      if (name === 'employee') setEmployee(value?.value || value || '');
      setPage(1);
    };
    const fields = [
      { ddl: { name: 'status', label: t('common.status','Status'), options: [{ label: t('common.all','All'), value: '' }, ...STATUSES.map(s=>({label:s,value:s}))] } },
      { ddl: { name: 'employee', label: t('account.expense.employee','Employee'), options: [{ label: t('common.all','All'), value: '' }, ...EMPLOYEES.map(s=>({label:s,value:s}))] } },
      { button: { label: t('common.reset','Reset Filters'), variant: 'outline', onClick: ()=>{ setSearch(''); setStatus(''); setEmployee(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("common.id", "ID"), dataIndex: "id" },
    { title: t("account.expense.employee", "Employee"), dataIndex: "employee" },
    { title: t("common.category", "Category"), dataIndex: "category" },
    { title: t("common.amount", "Amount"), dataIndex: "amount", render: (v)=>`৳ ${v.toLocaleString()}`, textAlign: "right" },
    { title: t("common.status", "Status"), dataIndex: "status" },
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
      title={t("account.expense", "Expense / Advance")}
      headerButtons={headerButtons}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search ID or employee")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
