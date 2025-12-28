import React from 'react';
import { Controller } from 'react-hook-form';
import Checkbox from './Checkbox';

const FormCheckbox = ({ name, control, label, onChange, ...checkboxProps }) => (
  <div>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Checkbox
          {...field}
          {...checkboxProps}
          checked={!!field.value}
          onChange={e => {
            field.onChange(e.target.checked);
            if (onChange) onChange(e.target.checked);
          }}
        >
          {label}
        </Checkbox>
      )}
    />
    {checkboxProps.error && (
      <p className="text-xs text-red-600 mt-1">{checkboxProps.error}</p>
    )}
  </div>
);

export default FormCheckbox;
