import React from 'react';
import Card from './Card';

const Header = ({ title, onBack, right, className = '' }) => (
 <Card className={`mb-1`}>
   <div className={`flex items-center justify-between ${className}`}>
    <div className="flex items-center min-w-0">
      {onBack && (
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      <h1 className="text-lg font-semibold text-gray-800 truncate">{title}</h1>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">{right}</div>
  </div>
 </Card>
);

export default Header;
