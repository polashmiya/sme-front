import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const METHODS = ["Cash", "Bank Transfer", "Card", "Mobile Wallet"];

export default function SalesCollectionCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    receiptNo: yup.string().required(t("validation.receiptNo", "Receipt No is required")),
    date: yup.string().required(t("validation.date", "Date is required")),
    customer: yup.string().required(t("validation.customer", "Customer is required")),
    amount: yup.number().typeError(t("validation.amount", "Amount must be a number")).required(t("validation.amount", "Amount is required")),
    method: yup.string().required(t("validation.method", "Method is required")),
    reference: yup.string().nullable(),
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      receiptNo: "",
      date: "",
      customer: "",
      amount: "",
      method: "",
      reference: "",
    },
  });

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
    navigate("/sales/collection");
  };

  return (
    <CommonCreateLayout
      title={t("sales.collection.create", "Create Collection")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      {(() => {
        const fields = [
          { input: { name: "receiptNo", label: t("sales.receiptNo", "Receipt No"), placeholder: "RC-3001" } },
          { input: { name: "date", label: t("sales.date", "Date"), type: "date" } },
          { input: { name: "customer", label: t("sales.customer", "Customer"), placeholder: "Customer A" } },
          { input: { name: "amount", label: t("sales.amount", "Amount"), type: "number", placeholder: "1000" } },
          { ddl: { name: "method", label: t("sales.method", "Method"), options: METHODS.map((m) => ({ label: m, value: m })), placeholder: t("sales.method", "Method") } },
          { input: { name: "reference", label: t("sales.reference", "Reference"), placeholder: "Ref-RC-001" } },
        ];
        return <Fields fields={fields} commonProps={{ control }} />;
      })()}
    </CommonCreateLayout>
  );
}
