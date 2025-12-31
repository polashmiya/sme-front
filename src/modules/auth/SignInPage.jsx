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
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <div className="absolute inset-0 animate-light-purple-bg -z-10 rounded-none" />
      <div className="flex flex-col items-center justify-center w-full max-w-md px-8 py-12 z-10 animate-fade-in-left">
        <img src={logo} alt="Logo" className="drop-shadow mb-6 mt-2" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormInput
            name="email"
            control={control}
            label={<span className="text-white">{t("auth.email")}</span>}
            size="large"
            placeholder={t("auth.email")}
            inputClassName="signin-placeholder-black"
            type="email"
            suffix={<span>@</span>}
          />
          <FormInput
            name="password"
            control={control}
            label={<span className="text-white">{t("auth.password")}</span>}
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
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            }
          />
          <Button block size="large" type="primary" htmlType="submit">
            {t("auth.signIn")}
          </Button>
        </form>
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
          background: linear-gradient(135deg, #5a4f7a 0%, #000000 50%, #b197e9 100%);
          background-size: 200% 200%;
          animation: light-purple-bg 8s ease-in-out infinite;
          opacity: 0.97;
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}
