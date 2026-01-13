import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

const schema = yup
  .object({
    poNo: yup.string().required("PO No is required"),
    supplier: yup.string().required("Supplier is required"),
    paymentDate: yup.string().required("Payment Date is required"),
    amount: yup.number().typeError("Amount is required").min(0, "Amount cannot be negative").required(),
    method: yup.string().required("Method is required"),
  })
  .required();

export default function PurchasePaymentCreate() {
  const { control, handleSubmit, formState: { isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      poNo: "",
      supplier: "",
      paymentDate: "",
      amount: "",
      method: "",
      remarks: "",
    },
  });

  const onSubmit = (data) => {
    alert("Submitted: " + JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <CommonCreateLayout
      title="Create Purchase Payment"
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
      submitLabel="Save Payment"
    >
      {(() => {
        const fieldsTop = [
          { input: { name: "poNo", label: "PO No", placeholder: "PO-1001" } },
          {
            ddl: {
              name: "supplier",
              label: "Supplier",
              options: ["Supplier A", "Supplier B", "Supplier C"].map((s) => ({ label: s, value: s })),
              placeholder: "Select supplier",
            },
          },
          { input: { name: "paymentDate", label: "Payment Date", type: "date" } },
        ];
        const fieldsBottom = [
          { input: { name: "amount", label: "Amount", type: "number", placeholder: "0.00" } },
          {
            ddl: {
              name: "method",
              label: "Method",
              options: ["Cash", "Bank Transfer", "Cheque"].map((m) => ({ label: m, value: m })),
              placeholder: "Select method",
            },
          },
          { input: { name: "remarks", label: "Remarks", placeholder: "Optional" } },
        ];
        return (
          <>
            <Fields fields={fieldsTop} commonProps={{ control }} parentDivClassName="grid md:grid-cols-3 gap-4 text-sm" />
            <Fields fields={fieldsBottom} commonProps={{ control }} parentDivClassName="grid md:grid-cols-3 gap-4 text-sm mt-4" />
          </>
        );
      })()}
    </CommonCreateLayout>
  );
}
