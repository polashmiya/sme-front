import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Input from "../../../../../common/components/Input";

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  customer: `Customer ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  price: Math.floor(Math.random() * 900) + 100,
}));

export default function CustomerPriceLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.customer.toLowerCase().includes(search.toLowerCase()) && !r.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (customer && r.customer !== customer) return false;
      return true;
    });
  }, [search, customer]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Input label={t("configuration.customerPrice.customer", "Customer")} value={customer} onChange={(e)=>{ setCustomer(e.target.value); setPage(1); }} />
      </div>
      <div className="flex flex-col justify-end">
        <button type="button" className="btn-outline text-xs" onClick={()=>{ setSearch(""); setCustomer(""); setPage(1); }}>
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i)=> (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("common.customer", "Customer"), dataIndex: "customer" },
    { title: t("configuration.item.sku", "SKU"), dataIndex: "sku" },
    { title: t("common.price", "Price"), dataIndex: "price", textAlign: "right" },
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
      title={t("configuration.customerPrice", "Customer Price")}
      headerButtons={[]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search customer or SKU")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
