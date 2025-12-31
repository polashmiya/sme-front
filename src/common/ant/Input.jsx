import React from 'react';
import { Input as AntdInput } from 'antd';
import PropTypes from 'prop-types';

const SIZES = {
  small: 'small',
  middle: 'middle',
  large: 'large',
};

const Input = ({
  type = 'text',
  size = 'middle',
  addonBefore,
  addonAfter,
  prefix,
  suffix,
  allowClear,
  disabled,
  bordered = true,
  placeholder,
  value,
  onChange,
  error,
  ...rest
}) => (
  <div>
    <AntdInput
      type={type}
      size={SIZES[size] || 'middle'}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      prefix={prefix}
      suffix={suffix}
      allowClear={allowClear}
      disabled={disabled}
      bordered={bordered}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      status={error ? 'error' : ''}
    
      {...rest}
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

Input.propTypes = {
  type: PropTypes.string,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  addonBefore: PropTypes.node,
  addonAfter: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  bordered: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
};

export default Input;
