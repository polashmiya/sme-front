import { HeaderWithOutCard } from "../../../../../common/components/Header";
import Table from "../../../../../common/Table";
import Pagination from "../../../../../common/Pagination";

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "balance", label: "Balance" },
];

const rows = [
  { code: "1000", name: "Cash", type: "Asset", balance: "৳ 250,000" },
  { code: "1100", name: "Accounts Receivable", type: "Asset", balance: "৳ 120,000" },
  { code: "2000", name: "Accounts Payable", type: "Liability", balance: "৳ 95,000" },
  { code: "3000", name: "Equity", type: "Equity", balance: "৳ 500,000" },
  { code: "4000", name: "Sales Revenue", type: "Income", balance: "৳ 1,200,000" },
  { code: "5000", name: "Utilities Expense", type: "Expense", balance: "৳ 50,000" },
];

export default function ChartOfAccountsLanding() {
  return (
    <div className="space-y-4">
      <HeaderWithOutCard title="Chart Of Accounts" />
      <div className="card">
        <Table columns={columns} rows={rows} />
        <div className="mt-3">
          <Pagination total={rows.length} pageSize={10} currentPage={1} />
        </div>
      </div>
    </div>
  );
}
