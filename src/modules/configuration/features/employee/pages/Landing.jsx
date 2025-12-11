import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Input from "../../../../../common/components/Input";

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  empId: `EMP-${1000 + i}`,
  name: `Employee ${i + 1}`,
  department: ["Sales", "Purchase", "Accounts", "Inventory"][i % 4],
  phone: `017${Math.floor(10000000 + Math.random() * 89999999)}`,
}));

export default function EmployeeLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.empId.toLowerCase().includes(search.toLowerCase())) return false;
      if (department && r.department !== department) return false;
      return true;
    });
  }, [search, department]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Input label={t("configuration.employee.department", "Department")} value={department} onChange={(e)=>{ setDepartment(e.target.value); setPage(1); }} />
      </div>
      <div className="flex flex-col justify-end">
        <button type="button" className="btn-outline text-xs" onClick={()=>{ setSearch(""); setDepartment(""); setPage(1); }}>
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i)=> (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("configuration.employee.empId", "Employee ID"), dataIndex: "empId" },
    { title: t("common.name", "Name"), dataIndex: "name" },
    { title: t("configuration.employee.department", "Department"), dataIndex: "department" },
    { title: t("common.phone", "Phone"), dataIndex: "phone" },
  ];

  const pagination = {
    current: page,
    total: filtered.length,
    pageSize,
    onChange: setPage,
    onPageSizeChange: (size)=> { setPageSize(size); setPage(1); },
    showTotal: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  return (
    <CommonLandingLayout
      title={t("configuration.employee", "Employee")}
      headerButtons={[]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search name or ID")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
