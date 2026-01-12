import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const schema = yup.object({
  date: yup.string().required("Date is required"),
  voucher: yup.string().required("Voucher is required"),
  description: yup.string().required("Description is required"),
});

export default function AccountingJournalCreate() {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { date: "", voucher: "", description: "" }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { input: { name: "date", label: t("common.date","Date"), type: "date" } },
    { input: { name: "voucher", label: t("account.journal.voucher","Voucher"), placeholder: t("common.enter","Enter...") } },
    { input: { name: "description", label: t("common.description","Description"), placeholder: t("common.enter","Enter...") } },
  ];

  return (
    <CommonCreateLayout
      title={t("account.journal.create","Create Journal")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
