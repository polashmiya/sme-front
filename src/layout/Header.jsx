import { LogOut, User } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../common/components/LanguageSwitcher";
import { signOut } from "../auth/authSlice";
import Button from "../common/ant/Button";

export default function Header() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showUser, setShowUser] = React.useState(false);
  const userBtnRef = React.useRef(null);
  const userInfoRef = React.useRef(null);
  const isMobile = window.innerWidth <= 576;

  React.useEffect(() => {
    if (!showUser) return;
    function handleClickOutside(event) {
      if (
        userBtnRef.current && userBtnRef.current.contains(event.target)
      ) {
        // Clicked the user icon, let the handler toggle
        return;
      }
      if (
        userInfoRef.current && userInfoRef.current.contains(event.target)
      ) {
        // Clicked inside the user info, do nothing
        return;
      }
      setShowUser(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUser]);

  return (
    <header
      className="header-area bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-20 w-full"
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-2">
        {isMobile && (
          <span
            className="font-bold text-lg tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span style={{ color: '#8C57FF' }}>Core</span>lium
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        {/* <button className="btn-outline"><User size={16} /> Admin</button> */}
        <button
          ref={userBtnRef}
          className="flex items-center justify-center w-9 h-9 rounded-full"
          style={{ backgroundColor: '#F3EDFF' }}
          onClick={() => setShowUser((v) => !v)}
        >
          <User size={22} style={{ color: 'rgb(22 163 74)' }} />
        </button>
        {showUser && (
          <div
            ref={userInfoRef}
            className="absolute right-4 top-14 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[200px] flex flex-col "
          >
            <span className="font-semibold text-gray-800 mb-1">Md Polash Miya</span>
            <span className="text-xs text-gray-500 mb-2">Software Engineer</span>
            <span className="text-xs text-gray-500 mb-2">+880123456789</span>
           
            <Button
              type="button"
              className="btn-primary w-full mt-2"
              onClick={() => {
                setShowUser(false);
                dispatch(signOut());
              }}
            >
              <LogOut size={16} /> {t("auth.signOut")}
            </Button>
          </div>
        )}
        {/* <Button type="button" className="btn-primary" onClick={() => dispatch(signOut())}>
          <LogOut size={16} /> {t("auth.signOut")}
        </Button> */}
      </div>
    </header>
  );
}
