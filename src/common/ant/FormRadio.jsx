import React from 'react';
import { Controller } from 'react-hook-form';
import Radio from './Radio';

const FormRadio = ({ name, control, label, onChange, ...radioProps }) => (
  <div>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Radio
          {...field}
          {...radioProps}
          checked={field.value}
          onChange={e => {
            field.onChange(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
        >
          {label}
        </Radio>
      )}
    />
    {radioProps.error && (
      <p className="text-xs text-red-600 mt-1">{radioProps.error}</p>
    )}
  </div>
);

export default FormRadio;
