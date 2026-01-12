import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const CUSTOMERS = Array.from({ length: 20 }).map((_, i)=> ({ label: `Customer ${i+1}`, value: `Customer ${i+1}` }));
const SKUS = Array.from({ length: 20 }).map((_, i)=> ({ label: `SKU-${1000 + i}`, value: `SKU-${1000 + i}` }));

const schema = yup.object({
  customer: yup.mixed().required("Customer is required"),
  sku: yup.mixed().required("SKU is required"),
  price: yup.number().typeError("Price must be a number").min(0,"Must be >= 0").required("Price is required"),
  effectiveDate: yup.string().required("Effective Date is required"),
});

export default function CustomerPriceCreate() {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customer: null, sku: null, price: "", effectiveDate: "" }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { ddl: { name: "customer", label: "Customer", options: CUSTOMERS, placeholder: "Select customer" } },
    { ddl: { name: "sku", label: "SKU", options: SKUS, placeholder: "Select SKU" } },
    { input: { name: "price", label: "Price", type: "number", placeholder: "0" } },
    { input: { name: "effectiveDate", label: "Effective Date", type: "date" } },
  ];

  return (
    <CommonCreateLayout title="Create Customer Price" onSubmit={handleSubmit(onSubmit)} submitDisabled={isSubmitting} onCancel={() => reset()}>
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
