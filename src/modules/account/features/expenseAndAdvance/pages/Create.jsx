import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const EMPLOYEES = ["Alice","Bob","Charlie","David"].map(e=>({label:e,value:e}));
const CATEGORIES = ["Travel","Meals","Supplies"].map(c=>({label:c,value:c}));

const schema = yup.object({
  employee: yup.mixed().required("Employee is required"),
  category: yup.mixed().required("Category is required"),
  amount: yup.number().typeError("Amount must be a number").min(0,"Must be >= 0").required("Amount is required"),
  date: yup.string().required("Date is required"),
  remarks: yup.string().nullable(),
});

export default function ExpenseAdvanceCreate() {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { employee: null, category: null, amount: "", date: "", remarks: "" }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { ddl: { name: "employee", label: t("account.expense.employee","Employee"), options: EMPLOYEES, placeholder: t("common.select","Select...") } },
    { ddl: { name: "category", label: t("common.category","Category"), options: CATEGORIES, placeholder: t("common.select","Select...") } },
    { input: { name: "amount", label: t("common.amount","Amount"), type: "number", placeholder: "0" } },
    { input: { name: "date", label: t("common.date","Date"), type: "date" } },
    { input: { name: "remarks", label: t("common.remarks","Remarks"), placeholder: t("common.enter","Enter...") } },
  ];

  return (
    <CommonCreateLayout
      title={t("account.expense.create","Create Expense")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
