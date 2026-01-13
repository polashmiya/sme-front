import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const REASONS = ["Damaged", "Wrong Item", "Customer Request", "Other"];

export default function SalesReturnCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    returnNo: yup.string().required(t("validation.returnNo", "Return No is required")),
    date: yup.string().required(t("validation.date", "Date is required")),
    customer: yup.string().required(t("validation.customer", "Customer is required")),
    reason: yup.string().required(t("validation.reason", "Reason is required")),
    reference: yup.string().nullable(),
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      returnNo: "",
      date: "",
      customer: "",
      reason: "",
      reference: "",
    },
  });

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
    navigate("/sales/return");
  };

  return (
    <CommonCreateLayout
      title={t("sales.return.create", "Create Sales Return")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      {(() => {
        const fields = [
          { input: { name: "returnNo", label: t("sales.returnNo", "Return No"), placeholder: "RET-0501" } },
          { input: { name: "date", label: t("sales.date", "Date"), type: "date" } },
          { input: { name: "customer", label: t("sales.customer", "Customer"), placeholder: "Customer A" } },
          { ddl: { name: "reason", label: t("sales.reason", "Reason"), options: REASONS.map((r) => ({ label: r, value: r })), placeholder: t("sales.reason", "Reason") } },
          { input: { name: "reference", label: t("sales.reference", "Reference"), placeholder: "Ref-RET-001" } },
        ];
        return <Fields fields={fields} commonProps={{ control }} />;
      })()}
    </CommonCreateLayout>
  );
}
