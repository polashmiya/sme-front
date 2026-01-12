import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  sku: `SKU-${1000 + i}`,
  name: `Item ${i + 1}`,
  standardPrice: Math.floor(Math.random() * 900) + 100,
}));
const SKUS = Array.from({ length: 50 }).map((_, i)=> `SKU-${1000 + i}`);

export default function StandardPriceLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const FilterSection = () => {
    const values = { sku };
    const setValue = (name, value) => {
      if (name === 'sku') { setSku(value?.value || value || ''); setPage(1); }
    };
    const fields = [
      { ddl: { name: 'sku', label: t('configuration.standardPrice.sku','SKU'), options: [{ label: t('common.all','All'), value: '' }, ...SKUS.map(s=>({label:s,value:s}))] } },
      { button: { label: t('common.reset','Reset Filters'),className:"mt-6", variant: 'outline', onClick: ()=>{ setSearch(''); setSku(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

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
      headerButtons={[
        {
          label: t("configuration.standardPrice.addStandardPrice", "Add Standard Price"),
          type: "primary",
          onClick: () => navigate("/configuration/standard-price/add"),
        },
      ]}
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
