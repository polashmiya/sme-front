import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const TYPES = ["Discount", "BuyXGetY", "Bundle"].map(c=>({label:c,value:c}));

const schema = yup.object({
  offerId: yup.string().required("Offer ID is required"),
  title: yup.string().required("Title is required"),
  type: yup.mixed().required("Type is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
  active: yup.boolean(),
});

export default function OfferSetupCreate() {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { offerId: "", title: "", type: null, startDate: "", endDate: "", active: true }
  });

  const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); };

  const fields = [
    { input: { name: "offerId", label: "Offer ID", placeholder: "Enter offer ID" } },
    { input: { name: "title", label: "Title", placeholder: "Enter title" } },
    { ddl: { name: "type", label: "Type", options: TYPES, placeholder: "Select type" } },
    { input: { name: "startDate", label: "Start Date", type: "date" } },
    { input: { name: "endDate", label: "End Date", type: "date" } },
    { checkbox: { name: "active", label: "Active" } },
  ];

  return (
    <CommonCreateLayout title="Create Offer" onSubmit={handleSubmit(onSubmit)} submitDisabled={isSubmitting} onCancel={() => reset()}>
      <Fields fields={fields} commonProps={{ control }} />
    </CommonCreateLayout>
  );
}
