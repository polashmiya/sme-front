import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonLandingLayout from "../../../../../common/components/CommonLandingLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";
import { useNavigate } from "react-router-dom";

const rows = Array.from({ length: 200 }).map((_, i) => ({
  id: i + 1,
  customer: `Customer ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  price: Math.floor(Math.random() * 900) + 100,
}));
const CUSTOMERS = Array.from({ length: 20 }).map((_, i)=> `Customer ${i+1}`);
const SKUS = Array.from({ length: 20 }).map((_, i)=> `SKU-${1000 + i}`);

export default function CustomerPriceLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const FilterSection = () => {
    const values = { customer };
    const setValue = (name, value) => {
      if (name === 'customer') { setCustomer(value?.value || value || ''); setPage(1); }
    };
    const fields = [
      { ddl: { name: 'customer', label: t('configuration.customerPrice.customer','Customer'), options: [{ label: t('common.all','All'), value: '' }, ...CUSTOMERS.map(c=>({label:c,value:c}))] } },
      { button: { label: t('common.reset','Reset Filters'),className:"mt-6", variant: 'outline', onClick: ()=>{ setSearch(''); setCustomer(''); setPage(1); } } },
    ];
    return <Fields fields={fields} commonProps={{ values, setValue }} />;
  };

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
      headerButtons={[
        {
          label: t("configuration.customerPrice.addCustomerPrice", "Add Customer Price"),
          type: "primary",
          onClick: () => navigate("/configuration/customer-price/add"),
        },
      ]}
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
