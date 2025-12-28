import React from 'react';
import { Controller } from 'react-hook-form';
import Dropdown from './Dropdown';

const FormDropdown = ({ name, control, label, onChange, ...dropdownProps }) => (
  <div>
    {label && <label className="text-sm font-medium">{label}</label>}
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Dropdown
          {...field}
          {...dropdownProps}
          value={field.value === '' || field.value === undefined ? null : field.value}
          error={fieldState.error?.message}
          onChange={value => {
            field.onChange(value);
            if (onChange) onChange(value);
          }}
        />
      )}
    />
    
  </div>
);

export default FormDropdown;
