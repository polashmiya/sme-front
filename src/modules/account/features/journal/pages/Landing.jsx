import { useMemo, useState } from "react";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../common/utils";
import { useNavigate } from "react-router-dom";

const rows = Array.from({ length: 300 }).map((_, i) => ({
  id: i + 1,
  date: new Date(2025, 0, (i % 28) + 1),
  voucher: `JRN-${1000 + i}`,
  description: ["Adjustment", "Expense Allocation", "Correction"][i % 3],
  debit: Math.floor(Math.random() * 20000),
  credit: Math.floor(Math.random() * 20000),
}));

export default function AccountingJournalLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        search &&
        !r.voucher.toLowerCase().includes(search.toLowerCase()) &&
        !r.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (fromDate && r.date < new Date(fromDate)) return false;
      if (toDate && r.date > new Date(toDate)) return false;
      return true;
    });
  }, [search, fromDate, toDate]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterSection = () => {
    const values = { fromDate, toDate };
    const setValue = (name, value) => {
      if (name === 'fromDate') setFromDate(value || '');
      if (name === 'toDate') setToDate(value || '');
      setPage(1);
    };
    const fields = [
      { input: { name: 'fromDate', label: t('common.fromDate','From Date'), type: 'date' } },
      { input: { name: 'toDate', label: t('common.toDate','To Date'), type: 'date' } },
      { button: { label: t('common.reset','Reset Filters'), variant: 'outline', onClick: ()=>{ setSearch(''); setFromDate(''); setToDate(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

  const tableColumns = [
    { title: t("common.sl", "SL"), render: (_, __, i) => (page - 1) * pageSize + i + 1, textAlign: "center" },
    { title: t("common.date", "Date"), dataIndex: "date", render: (d) => formatDate(d) },
    { title: t("account.journal.voucher", "Voucher"), dataIndex: "voucher" },
    { title: t("common.description", "Description"), dataIndex: "description" },
    { title: t("common.debit", "Debit"), dataIndex: "debit", render: (v)=>`৳ ${v.toLocaleString()}`, textAlign: "right" },
    { title: t("common.credit", "Credit"), dataIndex: "credit", render: (v)=>`৳ ${v.toLocaleString()}`, textAlign: "right" },
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
      title={t("account.journal", "Accounting Journal")}
      headerButtons={[{ label: t('account.journal.create','Add Journal'), type: 'primary', onClick: ()=> navigate('/account/journal/add') }]}
      showSearch={true}
      onSearch={setSearch}
      searchPlaceholder={t("common.search", "Search voucher or description")}
      filters={FilterSection}
      tableColumns={tableColumns}
      tableData={pageRows}
      pagination={pagination}
    />
  );
}
