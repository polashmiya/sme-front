import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', open, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  const color = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-500 text-gray-900',
  }[type] || 'bg-gray-800';

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white ${color}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">&times;</button>
    </div>
  );
};

export default Toast;
