import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const CATEGORIES = ["Raw", "Finished", "Consumables", "Packaging", "Spare Parts"].map(c=>({label:c,value:c}));

const schema = yup.object({
  sku: yup.string().required("SKU is required"),
  name: yup.string().required("Item Name is required"),
  category: yup.mixed().required("Category is required"),
  unit: yup.string().required("Unit is required"),
  standardPrice: yup.number().typeError("Standard Price must be a number").min(0, "Must be >= 0").required("Standard Price is required"),
  active: yup.boolean(),
});

export default function ItemProfileCreate() {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { sku: "", name: "", category: null, unit: "", standardPrice: "", active: true }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { input: { name: "sku", label: "SKU", placeholder: "Enter SKU" } },
    { input: { name: "name", label: "Item Name", placeholder: "Enter item name" } },
    { ddl: { name: "category", label: "Category", options: CATEGORIES, placeholder: "Select category" } },
    { input: { name: "unit", label: "Unit", placeholder: "e.g. PCS" } },
    { input: { name: "standardPrice", label: "Standard Price", type: "number", placeholder: "0" } },
    { checkbox: { name: "active", label: "Active" } },
  ];

  return (
    <CommonCreateLayout title="Create Item" onSubmit={handleSubmit(onSubmit)} submitDisabled={isSubmitting} onCancel={() => reset()}>
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
