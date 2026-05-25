import { LogOut, Moon, Sun, User } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../common/components/LanguageSwitcher";
import { signOut } from "../auth/authSlice";
import Button from "../common/ant/Button";
import { toggleDarkMode } from "../ui/uiSlice";

export default function Header() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector(s => s.ui.darkMode);

  const [showUser, setShowUser] = React.useState(false);
  const userBtnRef = React.useRef(null);
  const userInfoRef = React.useRef(null);
  const isMobile = window.innerWidth <= 576;

  React.useEffect(() => {
    if (!showUser) return;
    function handleClickOutside(event) {
      if (userBtnRef.current && userBtnRef.current.contains(event.target)) return;
      if (userInfoRef.current && userInfoRef.current.contains(event.target)) return;
      setShowUser(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUser]);

  return (
    <header
      className="header-area px-4 flex items-center justify-between sticky top-0 z-20 w-full"
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-2">
        {isMobile && (
          <span
            className="font-bold text-lg tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span style={{ color: '#8C57FF' }}>Core</span>
            <span style={{ color: 'var(--text-primary)' }}>lium</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Dark / light mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-outline w-9 h-9 !px-0 flex items-center justify-center"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {darkMode
            ? <Sun size={15} style={{ color: '#f59e0b' }} />
            : <Moon size={15} style={{ color: 'var(--text-secondary)' }} />
          }
        </button>

        <LanguageSwitcher />

        {/* User avatar */}
        <button
          ref={userBtnRef}
          className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
          style={{ backgroundColor: darkMode ? '#2d3f55' : '#F3EDFF' }}
          onClick={() => setShowUser(v => !v)}
          aria-label="User menu"
        >
          <User size={20} style={{ color: 'rgb(22 163 74)' }} />
        </button>

        {/* User dropdown */}
        {showUser && (
          <div
            ref={userInfoRef}
            className="absolute right-4 top-14 rounded-xl shadow-xl border p-4 z-50 min-w-[200px] flex flex-col"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border)',
            }}
          >
            <span className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Md Polash Miya
            </span>
            <span className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
              Software Engineer
            </span>
            <span className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              +880123456789
            </span>
            <Button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                setShowUser(false);
                dispatch(signOut());
              }}
            >
              <LogOut size={14} /> {t("auth.signOut")}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
