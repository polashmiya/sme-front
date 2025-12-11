import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/CommonLandingLayout";
import Input from "../../../../../common/Input";

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  code: `CUS-${1000 + i}`,
  name: `Customer ${i + 1}`,
  category: ["Retail", "Wholesale"][i % 2],
  phone: `018${Math.floor(10000000 + Math.random() * 89999999)}`,
}));

export default function CustomerProfileLanding() {
  const { t } = useTranslation();
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

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Input label={t("configuration.customer.category", "Category")} value={category} onChange={(e)=>{ setCategory(e.target.value); setPage(1); }} />
      </div>
      <div className="flex flex-col justify-end">
        <button type="button" className="btn-outline text-xs" onClick={()=>{ setSearch(""); setCategory(""); setPage(1); }}>
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

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
      headerButtons={[]}
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
