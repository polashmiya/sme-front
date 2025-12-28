import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import PropTypes from 'prop-types';

const SIZES = {
  small: 'small',
  middle: 'middle',
  large: 'large',
};

const Checkbox = ({ checked, onChange, disabled, indeterminate, children, size = 'small', ...rest }) => (
  <AntdCheckbox
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    indeterminate={indeterminate}
    style={{ fontSize: size === 'small' ? 14 : size === 'middle' ? 16 : 18 }}
    {...rest}
  >
    {children}
  </AntdCheckbox>
);

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  children: PropTypes.node,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
};

export default Checkbox;
