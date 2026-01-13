import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const DELIVERY_METHODS = ["Own Fleet", "Courier", "Third Party"];

export default function SalesDeliveryCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    soNo: yup.string().required(t("validation.soNo", "SO No is required")),
    deliveryDate: yup.string().required(t("validation.deliveryDate", "Delivery Date is required")),
    method: yup.string().required(t("validation.method", "Delivery Method is required")),
    reference: yup.string().nullable(),
    address: yup.string().nullable(),
    contact: yup.string().nullable(),
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      soNo: "",
      deliveryDate: "",
      method: "",
      reference: "",
      address: "",
      contact: "",
    },
  });

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
    navigate("/sales/delivery");
  };

  return (
    <CommonCreateLayout
      title={t("sales.delivery.create", "Create Delivery")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      {(() => {
        const fields = [
          { input: { name: "soNo", label: t("sales.order", "SO No"), placeholder: "SO-2501" } },
          { input: { name: "deliveryDate", label: t("sales.delivery.date", "Delivery Date"), type: "date" } },
          { ddl: { name: "method", label: t("sales.delivery.method", "Delivery Method"), options: DELIVERY_METHODS.map((m) => ({ label: m, value: m })), placeholder: t("sales.delivery.method", "Delivery Method") } },
          { input: { name: "reference", label: t("sales.reference", "Reference"), placeholder: "Ref-DEL-001" } },
          { input: { name: "address", label: t("sales.address", "Delivery Address"), placeholder: "Street, City" } },
          { input: { name: "contact", label: t("sales.contact", "Contact Person"), placeholder: "Name" } },
        ];
        return <Fields fields={fields} commonProps={{ control }} />;
      })()}
    </CommonCreateLayout>
  );
}
