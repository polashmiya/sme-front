import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  sku: `SKU-${1000 + i}`,
  name: `Item ${i + 1}`,
  standardPrice: Math.floor(Math.random() * 900) + 100,
}));
const SKUS = Array.from({ length: 50 }).map((_, i)=> `SKU-${1000 + i}`);

export default function StandardPriceLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sku, setSku] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (sku && r.sku !== sku) return false;
      return true;
    });
  }, [search, sku]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("configuration.standardPrice.sku", "SKU")}
          options={[{ label: t("common.all","All"), value: "" }, ...SKUS.map(s=>({label:s, value:s}))]}
          value={sku ? { label: sku, value: sku } : { label: t("common.all","All"), value: "" }}
          onChange={(opt)=>{ setSku(opt.value); setPage(1); }}
          className="w-full"
        />
      </div>
      <div className="flex flex-col justify-end">
        <button type="button" className="btn-outline text-xs" onClick={()=>{ setSearch(""); setSku(""); setPage(1); }}>
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i)=> (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("configuration.item.sku", "SKU"), dataIndex: "sku" },
    { title: t("common.name", "Name"), dataIndex: "name" },
    { title: t("configuration.standardPrice.price", "Standard Price"), dataIndex: "standardPrice", textAlign: "right" },
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
      title={t("configuration.standardPrice", "Standard Price")}
      headerButtons={[]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search item or SKU")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
