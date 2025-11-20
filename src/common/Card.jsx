import React from 'react';

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white shadow-sm border border-gray-200 p-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
