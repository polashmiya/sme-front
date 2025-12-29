import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import FormInput from "../../../../../common/ant/FormInput";
import FormDropdown from "../../../../../common/ant/FormDropdown";

const designationOptions = [
  { label: "Manager", value: "manager" },
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "HR", value: "hr" },
];
const departmentOptions = [
  { label: "IT", value: "it" },
  { label: "Finance", value: "finance" },
  { label: "Marketing", value: "marketing" },
  { label: "Operations", value: "operations" },
];

const schema = yup.object({
  employeeCode: yup.string().required("Employee Code is required"),
  employeeName: yup.string().required("Employee Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  designation: yup.string().required("Designation is required"),
  department: yup.string().required("Department is required"),
  joiningDate: yup.string().required("Joining Date is required"),
});

export default function EmployeeCreate() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      employeeCode: "",
      employeeName: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      joiningDate: "",
    },
  });

  const onSubmit = (data) => {
    // handle create logic here
    alert(JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <CommonCreateLayout
      title="Create Employee"
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={isSubmitting}
      onCancel={() => reset()}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          name="employeeCode"
          control={control}
          label="Employee Code"
          placeholder="Enter employee code"
        />
        <FormInput
          name="employeeName"
          control={control}
          label="Employee Name"
          placeholder="Enter employee name"
        />
        <FormInput
          name="email"
          control={control}
          label="Email"
          placeholder="Enter email"
          type="email"
        />
        <FormInput
          name="phone"
          control={control}
          label="Phone No"
          placeholder="Enter phone number"
          maxLength={10}
        />
        <FormDropdown
          name="designation"
          control={control}
          label="Designation"
          options={designationOptions}
          placeholder="Select designation"
          allowClear
        />
        <FormDropdown
          name="department"
          control={control}
          label="Department"
          options={departmentOptions}
          placeholder="Select department"
          allowClear
        />
        <FormInput
          name="joiningDate"
          control={control}
          label="Joining Date"
          type="date"
        />
      </div>
    </CommonCreateLayout>
  );
}
