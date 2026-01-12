import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";
const CATEGORIES = ["Retail", "Wholesale", "Corporate"];

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  code: `CUS-${1000 + i}`,
  name: `Customer ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  phone: `018${Math.floor(10000000 + Math.random() * 89999999)}`,
}));

export default function CustomerProfileLanding() {
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
      { ddl: { name: 'category', label: t('configuration.customer.category','Category'), options: [{ label: t('common.all','All'), value: '' }, ...CATEGORIES.map(c=>({label:c,value:c}))] } },
      { button: { label: t('common.reset','Reset Filters'),className:"mt-6", variant: 'outline', onClick: ()=>{ setSearch(''); setCategory(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i)=> (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("configuration.customer.code", "Code"), dataIndex: "code" },
    { title: t("common.name", "Name"), dataIndex: "name" },
    { title: t("configuration.customer.category", "Category"), dataIndex: "category" },
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
      title={t("configuration.customerProfile", "Customer Profile")}
      headerButtons={[
        {
          label: t("configuration.customerProfile.addCustomer", "Add Customer"),
          type: "primary",
          onClick: () => navigate("/configuration/customer-profile/add"),
        },
      ]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search customer or code")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
