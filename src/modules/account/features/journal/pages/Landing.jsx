import { useMemo, useState } from "react";
import CommonLandingLayout from "../../../../../common/CommonLandingLayout";
import Input from "../../../../../common/Input";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../common/utils";

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

  const FilterSection = () => (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          label={t("common.fromDate", "From Date")}
        />
      </div>
      <div>
        <Input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          label={t("common.toDate", "To Date")}
        />
      </div>
      <div className="flex flex-col justify-end">
        <button
          type="button"
          className="btn-outline text-xs"
          onClick={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
            setPage(1);
          }}
        >
          {t("common.reset", "Reset Filters")}
        </button>
      </div>
    </div>
  );

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
      headerButtons={[]}
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
