import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";

const TYPES = ["Discount", "BuyXGetY", "Bundle"];
const rows = Array.from({ length: 150 }).map((_, i) => ({
  id: i + 1,
  offerId: `OFF-${1000 + i}`,
  title: `Offer ${i + 1}`,
  type: TYPES[i % TYPES.length],
  active: Boolean(i % 2),
}));

export default function OfferSetupLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.offerId.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && r.type !== type) return false;
      return true;
    });
  }, [search, type]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Dropdown label={t("configuration.offer.type", "Type")} options={[{ label: t("common.all", "All"), value: "" }, ...TYPES.map(s=>({label:s, value:s}))]} value={type ? {label:type,value:type}:{label:t("common.all","All"),value:""}} onChange={(opt)=>{ setType(opt.value); setPage(1); }} />
      </div>
      <div className="flex flex-col justify-end">
        <button type="button" className="btn-outline text-xs" onClick={()=>{ setSearch(""); setType(""); setPage(1); }}>
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i)=> (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("configuration.offer.id", "Offer ID"), dataIndex: "offerId" },
    { title: t("common.title", "Title"), dataIndex: "title" },
    { title: t("configuration.offer.type", "Type"), dataIndex: "type" },
    { title: t("common.active", "Active"), dataIndex: "active", render: (v)=> v ? t("common.yes","Yes") : t("common.no","No"), textAlign: "center" },
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
      title={t("configuration.offerSetup", "Offer Setup")}
      headerButtons={[]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search offer or ID")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
