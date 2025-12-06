import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../components/CommonCreateLayout";

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
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    alert("Submitted: " + JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <CommonCreateLayout
      title="Create Purchase Payment"
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => reset()}
      submitLabel="Save Payment"
    >
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col">
          <label htmlFor="poNo" className="font-medium mb-1">PO No</label>
          <input id="poNo" type="text" {...register("poNo")} className="border border-gray-300 rounded px-2 py-1" />
          {errors.poNo && <span className="text-red-600 text-xs mt-1">{errors.poNo.message}</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="supplier" className="font-medium mb-1">Supplier</label>
          <select id="supplier" {...register("supplier")} className="border border-gray-300 rounded px-2 py-1">
            <option value="">Select supplier</option>
            <option>Supplier A</option>
            <option>Supplier B</option>
            <option>Supplier C</option>
          </select>
          {errors.supplier && <span className="text-red-600 text-xs mt-1">{errors.supplier.message}</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="paymentDate" className="font-medium mb-1">Payment Date</label>
          <input id="paymentDate" type="date" {...register("paymentDate")} className="border border-gray-300 rounded px-2 py-1" />
          {errors.paymentDate && <span className="text-red-600 text-xs mt-1">{errors.paymentDate.message}</span>}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col">
          <label htmlFor="amount" className="font-medium mb-1">Amount</label>
          <input id="amount" type="number" min="0" step="0.01" {...register("amount")} className="border border-gray-300 rounded px-2 py-1" />
          {errors.amount && <span className="text-red-600 text-xs mt-1">{errors.amount.message}</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="method" className="font-medium mb-1">Method</label>
          <select id="method" {...register("method")} className="border border-gray-300 rounded px-2 py-1">
            <option value="">Select method</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Cheque</option>
          </select>
          {errors.method && <span className="text-red-600 text-xs mt-1">{errors.method.message}</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="remarks" className="font-medium mb-1">Remarks</label>
          <input id="remarks" type="text" {...register("remarks")} className="border border-gray-300 rounded px-2 py-1" />
        </div>
      </div>
    </CommonCreateLayout>
  );
}
