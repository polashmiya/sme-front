import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  const FilterSection = () => {
    const values = { type };
    const setValue = (name, value) => {
      if (name === 'type') { setType(value?.value || value || ''); setPage(1); }
    };
    const fields = [
      { ddl: { name: 'type', label: t('configuration.offer.type','Type'), options: [{ label: t('common.all','All'), value: '' }, ...TYPES.map(s=>({label:s,value:s}))] } },
      { button: { label: t('common.reset','Reset Filters'),className:"mt-6", variant: 'outline', onClick: ()=>{ setSearch(''); setType(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

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
      headerButtons={[
        {
          label: t("configuration.offerSetup.addOffer", "Add Offer"),
          type: "primary",
          onClick: () => navigate("/configuration/offer-setup/add"),
        },
      ]}
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
