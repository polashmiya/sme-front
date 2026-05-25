import React from 'react';
import Card from './Card';

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    style={{ color: 'var(--text-secondary)' }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

export const HeaderWithOutCard = ({ title, onBack, right, className = '' }) => (
  <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap ${className}`}>
    <div className="flex items-center min-w-0 w-full sm:w-auto sm:mb-0">
      {onBack && <BackButton onClick={onBack} />}
      <h1
        className="text-lg sm:text-xl font-bold truncate leading-tight tracking-tight"
        style={{ color: 'var(--text-primary)', fontFamily: 'inherit' }}
      >
        {title}
      </h1>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap w-full sm:w-auto mt-0">
      {right}
    </div>
  </div>
);

export const Header = ({ title, onBack, right, className = '' }) => (
  <Card className="mb-1">
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap ${className}`}>
      <div className="flex items-center min-w-0 w-full sm:w-auto mb-2 sm:mb-0">
        {onBack && <BackButton onClick={onBack} />}
        <h1
          className="text-lg sm:text-xl font-bold truncate leading-tight tracking-tight"
          style={{ color: 'var(--text-primary)', fontFamily: 'inherit' }}
        >
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap w-full sm:w-auto mt-0">
        {right}
      </div>
    </div>
  </Card>
);

export default Header;
