import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonCreateLayout from "../../../../../common/components/CommonCreateLayout";
import { Fields } from "../../../../../common/components/FieldRenderer";

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
  isUser: yup.boolean(),
  password: yup.string().when("isUser", {
    is: true,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: yup.string().when("isUser", {
    is: true,
    then: (schema) =>
      schema
        .required("Confirm Password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function EmployeeCreate() {
  // Removed unused showPassword state
  const {
    control,
    handleSubmit,
    reset,
    watch,
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
      isUser: false,
      password: "",
      confirmPassword: "",
    },
  });

  const isUser = watch("isUser");

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
      {(() => {
        const fields = [
          {
            input: {
              name: "employeeCode",
              label: "Employee Code",
              placeholder: "Enter employee code",
            },
          },
          {
            input: {
              name: "employeeName",
              label: "Employee Name",
              placeholder: "Enter employee name",
            },
          },
          {
            input: {
              name: "email",
              label: "Email",
              placeholder: "Enter email",
              type: "email",
            },
          },
          {
            input: {
              name: "phone",
              label: "Phone No",
              placeholder: "Enter phone number",
              maxLength: 10,
            },
          },
          {
            ddl: {
              name: "designation",
              label: "Designation",
              options: designationOptions,
              placeholder: "Select designation",
            },
          },
          {
            ddl: {
              name: "department",
              label: "Department",
              options: departmentOptions,
              placeholder: "Select department",
            },
          },
          {
            input: { name: "joiningDate", label: "Joining Date", type: "date" },
          },
          {
            checkbox: {
              name: "isUser",
              label: "Create User Account",
              className: "pt-6",
            },
          },
          // Conditional password fields
          ...(isUser
            ? [
                {
                  input: {
                    name: "password",
                    label: "Password",
                    type: "password",
                    placeholder: "Enter password",
                  },
                },
                {
                  input: {
                    name: "confirmPassword",
                    label: "Confirm Password",
                    type: "password",
                    placeholder: "Confirm password",
                  },
                },
              ]
            : []),
        ];
        return <Fields fields={fields} commonProps={{ control }} />;
      })()}
    </CommonCreateLayout>
  );
}
