import React from 'react';
import { Button as AntdButton } from 'antd';
import PropTypes from 'prop-types';

const SIZES = {
  small: 'small',
  middle: 'middle',
  large: 'large',
};

const Button = ({ type = 'primary', size = 'middle', shape, icon, loading, block, danger, ghost, children, ...rest }) => (
  <AntdButton
    type={type}
    size={SIZES[size] || 'small'}
    shape={shape}
    icon={icon}
    loading={loading}
    block={block}
    danger={danger}
    ghost={ghost}
    {...rest}
  >
    {children}
  </AntdButton>
);

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'link', 'text', 'default']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  shape: PropTypes.oneOf(['circle', 'round']),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  danger: PropTypes.bool,
  ghost: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
