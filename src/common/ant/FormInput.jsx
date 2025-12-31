import { Controller } from 'react-hook-form';
import Input from './Input';

/**
 * AntFormInput: A reusable form input for Ant Design + react-hook-form
 * Props:
 * - name: field name
 * - control: react-hook-form control
 * - label: label text (optional)
 * - onChange: custom onChange handler (optional)
 * - ...inputProps: all other Input props
 */
const FormInput = ({ name, control, label, onChange, inputClassName, ...inputProps }) => (
  <div>
    {label && <label className="text-sm font-medium">{label}</label>}
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...inputProps}
          className={inputClassName}
          error={fieldState.error?.message}
          onChange={e => {
            field.onChange(e);
            if (onChange) onChange(e);
          }}
        />
      )}
    />
  </div>
);

export default FormInput;
