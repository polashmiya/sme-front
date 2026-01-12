import React from "react";
import FormInput from "../ant/FormInput";
import FormDropdown from "../ant/FormDropdown";
import FormCheckbox from "../ant/FormCheckbox";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Input from "./Input";

/**
 * FieldRenderer: Render a heterogeneous list of fields using project components.
 * Supports react-hook-form via `control`, or a simple values/setValue fallback.
 *
 * Field schema examples:
 * - { jsx: <Custom /> }
 * - { input: { name: 'code', label: 'Code', type: 'text' } }
 * - { ddl: { name: 'type', label: 'Type', options: [{label:'Cash', value:'cash'}] } }
 * - { checkbox: { name: 'active', label: 'Active' } }
 * - { button: { label: 'Search', onClick: fn, variant: 'primary' } }
 * - { commonField: { component: MyComponent, props: { ... } } } // pass component ref
 */
const FieldRenderer = ({ field, control, values, setValue, errors }) => {
  // 1) Custom JSX
  if (field?.jsx) {
    return <>{field.jsx}</>;
  }

  // 2) Common component reference
  if (field?.commonField?.component) {
    const CommonComp = field.commonField.component;
    return (
      <CommonComp
        control={control}
        values={values}
        setValue={setValue}
        errors={errors}
        {...(field.commonField.props || {})}
      />
    );
  }

  // 3) Dropdown (single-select)
  if (field?.ddl) {
    const p = field.ddl;
    if (control) {
      return (
        <div className={p.divClassName || "w-full"}>
          <FormDropdown
            name={p.name}
            control={control}
            label={p.label}
            options={p.options || []}
            placeholder={p.placeholder || "Select..."}
            searchable={p.searchable ?? true}
            onChange={(val) => {
              if (p.onChange) p.onChange(val);
            }}
          />
        </div>
      );
    }
    // Fallback without react-hook-form
    return (
      <div className={p.divClassName || "w-full"}>
        <Dropdown
          label={p.label}
          options={p.options || []}
          value={values?.[p.name] || null}
          placeholder={p.placeholder || "Select..."}
          searchable={p.searchable ?? true}
          onChange={(val) => {
            if (p.onChange) p.onChange(val);
            else if (setValue) setValue(p.name, val);
          }}
        />
      </div>
    );
  }

  // 4) Input
  if (field?.input) {
    const p = field.input;
    if (control) {
      return (
        <div className={p.divClassName || "w-full"}>
          <FormInput
            name={p.name}
            control={control}
            label={p.label}
            type={p.type}
            inputClassName={p.className}
            onChange={(e) => {
              if (p.onChange) p.onChange(e);
            }}
            {...p}
          />
        </div>
      );
    }
    // Fallback without react-hook-form
    return (
      <div className={p.divClassName || "w-full"}>
        <Input
          label={p.label}
          type={p.type || "text"}
          className={p.className}
          value={values?.[p.name] ?? ""}
          onChange={(e) => {
            if (p.onChange) p.onChange(e);
            else if (setValue) setValue(p.name, e?.target?.value ?? "");
          }}
          {...p}
        />
      </div>
    );
  }

  // 5) Checkbox
  if (field?.checkbox) {
    const p = field.checkbox;
    if (control) {
      return (
        <div className={p.divClassName || "w-full"}>
          <FormCheckbox
            name={p.name}
            control={control}
            label={p.label}
            onChange={(checked) => {
              if (p.onChange) p.onChange(checked);
            }}
            {...p}
          />
        </div>
      );
    }
    // Fallback without react-hook-form
    return (
      <div className={p.divClassName || "w-full"}>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!values?.[p.name]}
            onChange={(e) => {
              const checked = !!e.target.checked;
              if (p.onChange) p.onChange(checked);
              else if (setValue) setValue(p.name, checked);
            }}
          />
          {p.label}
        </label>
      </div>
    );
  }

  // 6) Button
  if (field?.button) {
    const p = field.button;
    return (
      <div className={p.divClassName || "w-full"} style={p.style}>
        <Button
          variant={p.variant || "primary"}
          className={p.className}
          disabled={p.disabled}
          loading={p.loading}
          onClick={p.onClick}
          type={p.type || "button"}
        >
          {p.label || "Button"}
        </Button>
      </div>
    );
  }

  // Unknown field
  return null;
};

/**
 * Fields: Render a list of fields
 */
export const Fields = ({ fields, commonProps = {}, parentDivClassName }) => {
  const { control, values, setValue, errors } = commonProps;
  return (
    <div
      className={
        parentDivClassName ||
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      }
    >
      {fields?.map((field, idx) => (
        <React.Fragment
          key={
            field?.key ||
            field?.input?.name ||
            field?.ddl?.name ||
            field?.checkbox?.name ||
            idx
          }
        >
          <FieldRenderer
            field={field}
            control={control}
            values={values}
            setValue={setValue}
            errors={errors}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default FieldRenderer;
