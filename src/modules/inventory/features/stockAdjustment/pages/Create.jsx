import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const WAREHOUSES = ["WH1", "WH2", "WH3"].map(w=>({label:w,value:w}));
const REASONS = ["Cycle Count", "Damage", "Shrinkage"].map(r=>({label:r,value:r}));

const schema = yup.object({
  adjNo: yup.string().required("Adjustment No is required"),
  date: yup.string().required("Date is required"),
  warehouse: yup.mixed().required("Warehouse is required"),
  reason: yup.mixed().required("Reason is required"),
  remarks: yup.string().nullable(),
});

export default function StockAdjustmentCreate() {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { adjNo: "", date: "", warehouse: null, reason: null, remarks: "" }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { input: { name: "adjNo", label: t("inventory.adjustment.no","Adjustment No"), placeholder: t("common.enter","Enter...") } },
    { input: { name: "date", label: t("common.date","Date"), type: "date" } },
    { ddl: { name: "warehouse", label: t("inventory.adjustment.warehouse","Warehouse"), options: WAREHOUSES, placeholder: t("common.select","Select...") } },
    { ddl: { name: "reason", label: t("common.reason","Reason"), options: REASONS, placeholder: t("common.select","Select...") } },
    { input: { name: "remarks", label: t("common.remarks","Remarks"), placeholder: t("common.enter","Enter...") } },
  ];

  return (
    <CommonCreateLayout
      title={t("inventory.adjustment.create","Create Stock Adjustment")}
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
