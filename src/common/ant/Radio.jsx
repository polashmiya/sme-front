import React from 'react';
import { Radio as AntdRadio } from 'antd';
import PropTypes from 'prop-types';

const SIZES = {
  small: 'small',
  middle: 'middle',
  large: 'large',
};

const Radio = ({ checked, onChange, disabled, children, size = 'middle', ...rest }) => (
  <AntdRadio
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    style={{ fontSize: size === 'small' ? 14 : size === 'middle' ? 16 : 18 }}
    {...rest}
  >
    {children}
  </AntdRadio>
);

Radio.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
};

export default Radio;
