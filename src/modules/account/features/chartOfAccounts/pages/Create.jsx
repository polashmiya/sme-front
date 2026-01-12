import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const TYPES = ["Asset","Liability","Equity","Income","Expense"].map(t=>({label:t,value:t}));

const schema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  type: yup.mixed().required("Type is required"),
  openingBalance: yup.number().typeError("Opening Balance must be a number").min(0,"Must be >= 0").required("Opening Balance is required"),
  active: yup.boolean(),
});

export default function ChartOfAccountsCreate() {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { code: "", name: "", type: null, openingBalance: "", active: true }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { input: { name: "code", label: t("account.coa.code","Code"), placeholder: t("common.enter","Enter...") } },
    { input: { name: "name", label: t("account.coa.name","Name"), placeholder: t("common.enter","Enter...") } },
    { ddl: { name: "type", label: t("account.coa.type","Type"), options: TYPES, placeholder: t("common.select","Select...") } },
    { input: { name: "openingBalance", label: t("account.coa.openingBalance","Opening Balance"), type: "number", placeholder: "0" } },
    { checkbox: { name: "active", label: t("common.active","Active") } },
  ];

  return (
    <CommonCreateLayout
      title={t("account.coa.create","Create Ledger")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
