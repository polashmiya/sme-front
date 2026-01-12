import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const SKUS = Array.from({ length: 50 }).map((_, i)=> ({ label: `SKU-${1000 + i}`, value: `SKU-${1000 + i}` }));

const schema = yup.object({
  sku: yup.mixed().required("SKU is required"),
  standardPrice: yup.number().typeError("Standard Price must be a number").min(0,"Must be >= 0").required("Standard Price is required"),
  effectiveDate: yup.string().required("Effective Date is required"),
});

export default function StandardPriceCreate() {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { sku: null, standardPrice: "", effectiveDate: "" }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { ddl: { name: "sku", label: "SKU", options: SKUS, placeholder: "Select SKU" } },
    { input: { name: "standardPrice", label: "Standard Price", type: "number", placeholder: "0" } },
    { input: { name: "effectiveDate", label: "Effective Date", type: "date" } },
  ];

  return (
    <CommonCreateLayout title="Create Standard Price" onSubmit={handleSubmit(onSubmit)} submitDisabled={isSubmitting} onCancel={() => reset()}>
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
