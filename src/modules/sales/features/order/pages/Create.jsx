import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CommonCreateLayout from "../../../../../components/CommonCreateLayout";
import FormHeader from "../../../../../components/FormHeader";
import Input from "../../../../../common/Input";
import Dropdown from "../../../../../common/Dropdown";
import Button from "../../../../../common/Button";

const CUSTOMERS = ["Customer A", "Customer B", "Customer C", "Customer D"];

export default function SalesOrderCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <CommonCreateLayout>
      <FormHeader
        title={t("sales.order.create", "Create Sales Order")}
        onBack={() => navigate(-1)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Dropdown
          label={t("sales.customer", "Customer")}
          options={CUSTOMERS.map((c) => ({ label: c, value: c }))}
          placeholder={t("sales.customer", "Customer")}
        />
        <Input label={t("sales.date", "Order Date")} type="date" />
        <Input label={t("sales.deliveryEta", "Delivery ETA")} type="date" />
        <Input label={t("sales.reference", "Reference")} placeholder="Ref-001" />
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold mb-2">
          {t("sales.items", "Items")}
        </div>
        <div className="border rounded-md p-3 text-sm">
          <div className="grid md:grid-cols-4 gap-3">
            <Input label={t("sales.item", "Item")} placeholder="Item A" />
            <Input label={t("sales.qty", "Qty")} type="number" defaultValue={10} />
            <Input label={t("sales.price", "Price")} type="number" defaultValue={100} />
            <Input label={t("sales.total", "Total")} value={1000} readOnly />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="primary" onClick={() => navigate("/sales/order")}>{t("common.save", "Save")}</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>{t("common.cancel", "Cancel")}</Button>
      </div>
    </CommonCreateLayout>
  );
}
