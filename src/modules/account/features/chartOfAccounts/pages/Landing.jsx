import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import Dropdown from "../../../../../common/components/Dropdown";
import { useTranslation } from "react-i18next";

const TYPES = ["Asset", "Liability", "Equity", "Income", "Expense"];
const rows = Array.from({ length: 200 }).map((_, i) => {
  const type = TYPES[i % TYPES.length];
  const code = String(1000 + i);
  const name = `${type} ${i}`;
  const balance = Math.floor(Math.random() * 500000) + 10000;
  return { id: i + 1, code, name, type, balance };
});

export default function ChartOfAccountsLanding() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.code.toLowerCase().includes(search.toLowerCase()) &&
        !r.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (type && r.type !== type) return false;
      return true;
    });
  }, [search, type]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const headerButtons = [
    {
      variant: "primary",
      className: "flex items-center gap-1 text-sm",
      children: (
        <>
          <Plus size={14} /> {t("account.coa.create", "New Ledger")}
        </>
      ),
      onClick: () => {},
    },
  ];

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Dropdown
          label={t("account.coa.type", "Type")}
          options={[
            { label: t("common.all", "All"), value: "" },
            ...TYPES.map((s) => ({ label: s, value: s })),
          ]}
          value={type ? { label: type, value: type } : { label: t("common.all", "All"), value: "" }}
          onChange={(opt) => {
            setType(opt.value);
            setPage(1);
          }}
          className="w-full"
        />
      </div>
    </div>
  );

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("account.coa.code", "Code"), dataIndex: "code" },
    { title: t("account.coa.name", "Name"), dataIndex: "name" },
    { title: t("account.coa.type", "Type"), dataIndex: "type" },
    { title: t("account.coa.balance", "Balance"), dataIndex: "balance", render: (v)=>`৳ ${v.toLocaleString()}`, textAlign: "right" },
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
      title={t("account.coa", "Chart Of Accounts")}
      headerButtons={headerButtons}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search code or name")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
