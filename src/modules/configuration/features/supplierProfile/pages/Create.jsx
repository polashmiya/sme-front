import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const CATEGORIES = ["Local", "Import", "Distributor"].map(c=>({label:c,value:c}));

const schema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Supplier Name is required"),
  category: yup.mixed().required("Category is required"),
  phone: yup.string().matches(/^\d{10}$/,"Phone must be 10 digits").required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().required("Address is required"),
  active: yup.boolean(),
});

export default function SupplierProfileCreate() {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { code: "", name: "", category: null, phone: "", email: "", address: "", active: true }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { input: { name: "code", label: "Code", placeholder: "Enter code" } },
    { input: { name: "name", label: "Supplier Name", placeholder: "Enter name" } },
    { ddl: { name: "category", label: "Category", options: CATEGORIES, placeholder: "Select category" } },
    { input: { name: "phone", label: "Phone", placeholder: "Enter phone", maxLength: 10 } },
    { input: { name: "email", label: "Email", type: "email", placeholder: "Enter email" } },
    { input: { name: "address", label: "Address", placeholder: "Enter address" } },
    { checkbox: { name: "active", label: "Active" } },
  ];

  return (
    <CommonCreateLayout title="Create Supplier" onSubmit={handleSubmit(onSubmit)} submitDisabled={isSubmitting} onCancel={() => reset()}>
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
