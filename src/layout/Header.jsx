import { LogOut, User } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { signOut } from "../auth/authSlice";

export default function Header() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showUser, setShowUser] = React.useState(false);
  const isMobile = window.innerWidth <= 576;
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
            <span className="text-blue-600">Core</span>lium
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        {/* <button className="btn-outline"><User size={16} /> Admin</button> */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100"
          onClick={() => setShowUser((v) => !v)}
        >
          <User size={22} className="text-blue-600" />
        </button>
        {showUser && (
          <div className="absolute right-4 top-14 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[180px] flex flex-col items-center">
            <span className="font-semibold text-gray-800 mb-1">Admin</span>
            <span className="text-xs text-gray-500 mb-2">Designation</span>
            <button
              className="btn-primary w-full mt-2"
              onClick={() => dispatch(signOut())}
            >
              <LogOut size={16} /> {t("auth.signOut")}
            </button>
          </div>
        )}
        <button className="btn-primary" onClick={() => dispatch(signOut())}>
          <LogOut size={16} /> {t("auth.signOut")}
        </button>
      </div>
    </header>
  );
}
