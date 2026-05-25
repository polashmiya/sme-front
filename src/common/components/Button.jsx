import React from 'react';

const VARIANTS = {
  primary:   'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
  secondary: 'hover:opacity-90',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  outline:   '',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  const inlineStyle = {};
  if (isOutline) {
    inlineStyle.background = 'var(--bg-surface)';
    inlineStyle.border = '1px solid var(--border-strong)';
    inlineStyle.color = 'var(--text-secondary)';
  } else if (isSecondary) {
    inlineStyle.background = 'var(--bg-elevated)';
    inlineStyle.color = 'var(--text-primary)';
  }

  return (
    <button
      className={`px-4 rounded font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${VARIANTS[variant] || VARIANTS.primary} ${className} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      style={{ height: '30px', ...inlineStyle }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2 w-full">{children}</span>
      )}
    </button>
  );
};

export default Button;
