import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const CUSTOMERS = ["Customer A", "Customer B", "Customer C", "Customer D"];

export default function SalesOrderCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    customer: yup.string().required(t("validation.customer", "Customer is required")),
    orderDate: yup.string().required(t("validation.orderDate", "Order Date is required")),
    deliveryEta: yup.string().nullable(),
    reference: yup.string().nullable(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customer: "",
      orderDate: "",
      deliveryEta: "",
      reference: "",
    },
  });

  const onSubmit = (data) => {
    // TODO: replace with real create call
    alert(JSON.stringify(data, null, 2));
    navigate("/sales/order");
  };

  return (
    <CommonCreateLayout
      title={t("sales.order.create", "Create Sales Order")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      {(() => {
        const fields = [
          {
            ddl: {
              name: "customer",
              label: t("sales.customer", "Customer"),
              options: CUSTOMERS.map((c) => ({ label: c, value: c })),
              placeholder: t("sales.customer", "Customer"),
            },
          },
          { input: { name: "orderDate", label: t("sales.date", "Order Date"), type: "date" } },
          { input: { name: "deliveryEta", label: t("sales.deliveryEta", "Delivery ETA"), type: "date" } },
          { input: { name: "reference", label: t("sales.reference", "Reference"), placeholder: "Ref-001" } },
        ];
        return <Fields fields={fields} commonProps={{ control }} />;
      })()}
    </CommonCreateLayout>
  );
}
