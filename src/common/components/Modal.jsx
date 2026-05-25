import React from 'react';

const Modal = ({ open, onClose, title, children, actions, className = '' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div
        className={`rounded-xl shadow-2xl max-w-md w-full p-6 relative ${className}`}
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {title && (
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        )}
        <div>{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
