import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";
const CATEGORIES = ["Local", "Import", "Distributor"];

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  code: `SUP-${1000 + i}`,
  name: `Supplier ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  phone: `019${Math.floor(10000000 + Math.random() * 89999999)}`,
}));

export default function SupplierProfileLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && r.category !== category) return false;
      return true;
    });
  }, [search, category]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => {
    const values = { category };
    const setValue = (name, value) => {
      if (name === 'category') { setCategory(value?.value || value || ''); setPage(1); }
    };
    const fields = [
      { ddl: { name: 'category', label: t('configuration.supplier.category','Category'), options: [{ label: t('common.all','All'), value: '' }, ...CATEGORIES.map(c=>({label:c,value:c}))] } },
      { button: { label: t('common.reset','Reset Filters'),className:"mt-6", variant: 'outline', onClick: ()=>{ setSearch(''); setCategory(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i)=> (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("configuration.supplier.code", "Code"), dataIndex: "code" },
    { title: t("common.name", "Name"), dataIndex: "name" },
    { title: t("configuration.supplier.category", "Category"), dataIndex: "category" },
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
      title={t("configuration.supplierProfile", "Supplier Profile")}
      headerButtons={[
        {
          label: t("configuration.supplierProfile.addSupplier", "Add Supplier"),
          type: "primary",
          onClick: () => navigate("/configuration/supplier-profile/add"),
        },
      ]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search supplier or code")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
