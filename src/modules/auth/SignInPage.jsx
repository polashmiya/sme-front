import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Button from "../../common/ant/Button";
import FormInput from "../../common/ant/FormInput";
import logo from "../../assets/erpLogo.png";
import { signIn } from "../../auth/authSlice";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(4).required("Password is required"),
});

export default function SignInPage() {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values) => {
    dispatch(signIn({ email: values.email, name: values.email.split("@")[0] }));
    const dest = loc.state?.from?.pathname || "/";
    nav(dest, { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 animate-light-purple-bg -z-10" />
      <div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 bg-emerald-400/40 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -top-24 -right-10 h-72 w-72 bg-purple-400/40 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md px-6 sm:px-8 py-8 sm:py-10 animate-fade-in-right">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl shadow-emerald-500/20 rounded-2xl px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img
              src={logo}
              alt="Logo"
              className="h-10 sm:h-12 mb-1 drop-shadow"
            />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              {t("auth.signIn")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 text-center max-w-xs">
              Securely access your Corelium workspace to continue where you left
              off.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full mt-2">
            <FormInput
              name="email"
              control={control}
              label={t("auth.email")}
              size="large"
              placeholder={t("auth.email")}
              inputClassName="signin-placeholder-black"
              type="email"
              suffix={
                <span className="text-slate-400 text-xs sm:text-sm">@</span>
              }
            />
            <FormInput
              name="password"
              control={control}
              label={t("auth.password")}
              type={showPassword ? "text" : "password"}
              size="large"
              placeholder={t("auth.password")}
              inputClassName="signin-placeholder-black"
              suffix={
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </span>
              }
            />

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              className="!h-11 rounded-lg text-[15px] font-semibold shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t("auth.signIn")}
            </Button>
          </form>

          {/* <div className="mt-6 flex flex-col items-center gap-1 text-xs sm:text-sm text-slate-500">
            <span>
              New to Corelium?
              <Link
                className="ml-1 text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                to="/auth/sign-up"
              >
                {t("auth.signUp")}
              </Link>
            </span>
          </div> */}
        </div>
      </div>

      <style>{`
        .signin-placeholder-black .ant-input::placeholder,
        .signin-placeholder-black .ant-input-affix-wrapper input::placeholder {
          color: #000 !important;
          opacity: 1 !important;
        }

        @keyframes light-purple-bg {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-light-purple-bg {
          background: linear-gradient(135deg, #ede7ff 0%, #bbaaff 50%, #9767FF 100%);
          background-size: 200% 200%;
          animation: light-purple-bg 8s ease-in-out infinite;
          opacity: 0.97;
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right { animation: fade-in-right 1s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}
