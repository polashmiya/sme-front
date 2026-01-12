import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";
const DEPARTMENTS = [
  { label: "HR", value: "HR" },
  { label: "IT", value: "IT" },
  { label: "Finance", value: "Finance" },
  { label: "Marketing", value: "Marketing" },
  { label: "Operations", value: "Operations" },
  { label: "Sales", value: "Sales" },
];

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  empId: `EMP-${1000 + i}`,
  name: `Employee ${i + 1}`,
  department: DEPARTMENTS[i % DEPARTMENTS.length]?.label,
  phone: `017${Math.floor(10000000 + Math.random() * 89999999)}`,
}));

export default function EmployeeLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState({ label: t("common.all", "All"), value: "All" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.empId.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (department && department.value !== "All" && r.department !== department.label) return false;
      return true;
    });
  }, [search, department]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => {
    const values = { department };
    const setValue = (name, value) => {
      if (name === "department") {
        setDepartment(value);
        setPage(1);
      }
    };

    const fields = [
      {
        ddl: {
          name: "department",
          label: t("configuration.employee.department", "Department"),
          options: [{ label: t("common.all", "All"), value: "All" }, ...DEPARTMENTS],
        },
      },
      {
        button: {
          label: t("common.reset", "Reset"),
          type: "button",
          onClick: () => {
            setDepartment({ label: t("common.all", "All"), value: "All" });
            setSearch("");
            setPage(1);
          },
          variant: "outline",
          className: "mt-6",
        },
      },
    ];

    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

  const tableColumns = [
    {
      title: t("common.sl", "SL"),
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
      textAlign: "center",
    },
    {
      title: t("configuration.employee.empId", "Employee ID"),
      dataIndex: "empId",
    },
    { title: t("common.name", "Name"), dataIndex: "name" },
    {
      title: t("configuration.employee.department", "Department"),
      dataIndex: "department",
    },
    { title: t("common.phone", "Phone"), dataIndex: "phone" },
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
      title={t("configuration.employee.employee", "Employee")}
      headerButtons={[
        {
          label: t("configuration.employee.addEmployee", "Add Employee"),
          type: "primary",
          onClick: () => {
            navigate("/configuration/employee/add");
          },
        },
      ]}
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
