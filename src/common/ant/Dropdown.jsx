import React from "react";
import { Select } from "antd";
import PropTypes from "prop-types";

const SIZES = {
  small: "small",
  middle: "middle",
  large: "large",
};

const Dropdown = ({
  options = [],
  size = "middle",
  mode,
  allowClear,
  disabled,
  showSearch,
  placeholder,
  value,
  onChange,
  onSearch,
  dropdownRender,
  label,
  style,
  labelInValue = true,
  ...rest
}) => (
  <>
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <Select
      options={options}
      size={SIZES[size] || "middle"}
      mode={mode}
      allowClear={allowClear}
      disabled={disabled}
      showSearch={showSearch !== undefined ? showSearch : true}
      placeholder={placeholder || `Select ${label || ""}`}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      dropdownRender={dropdownRender}
      style={{ width: '100%', ...(style || {}) }}
      {...rest}
      labelInValue={labelInValue}
    />
    {rest.error && (
      <p className="text-xs text-red-600 mt-1">{rest.error}</p>
    )}
  </>
);

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  size: PropTypes.oneOf(["small", "middle", "large"]),
  mode: PropTypes.oneOf(["multiple", "tags"]),
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  showSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  dropdownRender: PropTypes.func,
};

export default Dropdown;
