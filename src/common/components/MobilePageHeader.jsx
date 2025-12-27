import { useNavigate } from 'react-router-dom';

export default function MobilePageHeader({ title, showBack = true }) {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 576;
  if (!isMobile) return null;
  return (
    <div className="flex items-center gap-2 w-full px-2 pb-2 relative">
      {showBack && (
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full z-10"
          style={{ backgroundColor: '#F3EDFF' }}
          onClick={() => navigate(-1)}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8C57FF' }} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      <span className="font-semibold text-lg text-gray-800 ml-2">{title}</span>
    </div>
  );
}
