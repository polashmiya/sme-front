import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Button from "../../common/ant/Button";
import FormInput from "../../common/ant/FormInput";
import logo from "../../assets/erpLogo.png";
import { signIn } from "../../auth/authSlice";
import { Eye, EyeOff, Zap, Shield, BarChart3, Users } from "lucide-react";
import React, { useState } from "react";

const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(4).required("Password is required"),
});

const features = [
  { icon: Zap, label: "Real-time analytics & insights" },
  { icon: Shield, label: "Enterprise-grade security" },
  { icon: BarChart3, label: "Advanced reporting tools" },
  { icon: Users, label: "Seamless team collaboration" },
];

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
    <div className="signin-root">
      {/* ── Left brand panel ── */}
      <aside className="signin-brand">
        <div className="signin-blob signin-blob-1" />
        <div className="signin-blob signin-blob-2" />
        <div className="signin-blob signin-blob-3" />
        <div className="signin-grid-mesh" />

        {/* Logo */}
        <div className="signin-brand-logo">
          <img src={logo} alt="Corelium logo" className="h-8 drop-shadow brightness-0 invert" />
          <span className="signin-brand-name">Corelium</span>
        </div>

        {/* Hero copy */}
        <div className="signin-brand-hero">
          <div className="signin-badge">
            <span>Enterprise ERP Platform</span>
          </div>
          <h2 className="signin-brand-headline">
            Everything you need,<br />
            <em className="signin-brand-em">all in one place.</em>
          </h2>
          <p className="signin-brand-sub">
            Streamline operations, gain powerful insights, and collaborate
            seamlessly — built for modern teams.
          </p>

          <ul className="signin-features">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="signin-feature-item">
                <span className="signin-feature-icon">
                  <Icon size={14} />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <blockquote className="signin-testimonial">
          <p>
            "Corelium transformed how our team operates. The insights we get are
            absolutely invaluable."
          </p>
          <footer className="signin-testimonial-footer">
            <span className="signin-avatar">AR</span>
            <div>
              <strong>Alex Rahman</strong>
              <span>CEO, TechCorp Ltd.</span>
            </div>
          </footer>
        </blockquote>
      </aside>

      {/* ── Right form panel ── */}
      <main className="signin-form-panel">
        {/* Mobile-only logo */}
        <div className="signin-mobile-logo">
          <img src={logo} alt="Corelium" className="h-9" />
          <span>Corelium</span>
        </div>

        <div className="signin-card">
          <div className="signin-card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your Corelium workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
            {/* Email */}
            <div className="signin-field">
              <label className="signin-label" htmlFor="email">
                Email address
              </label>
              <FormInput
                name="email"
                control={control}
                size="large"
                placeholder="you@company.com"
                inputClassName="si-input"
                type="email"
              />
            </div>

            {/* Password */}
            <div className="signin-field">
              <label className="signin-label" htmlFor="password">
                Password
              </label>
              <FormInput
                name="password"
                control={control}
                type={showPassword ? "text" : "password"}
                size="large"
                placeholder="••••••••"
                inputClassName="si-input"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="si-eye-btn"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                }
              />
            </div>

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              className="si-submit-btn"
            >
              {t("auth.signIn")}
            </Button>
          </form>
        </div>

        <footer className="signin-footer">
          © {new Date().getFullYear()} Corelium. All rights reserved.
        </footer>
      </main>

      <style>{`
        /* ── Root layout ───────────────────────────────────────── */
        .signin-root {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* ── Brand panel ───────────────────────────────────────── */
        .signin-brand {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          padding: 48px;
          width: 52%;
          flex-shrink: 0;
          background: linear-gradient(150deg,
            #022c22 0%,
            #064e3b 25%,
            #065f46 55%,
            #047857 80%,
            #059669 100%
          );
        }
        @media (min-width: 1024px) {
          .signin-brand { display: flex; }
        }

        /* Animated blobs */
        .signin-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          will-change: transform;
        }
        .signin-blob-1 {
          width: 520px; height: 520px;
          background: rgba(16, 185, 129, 0.3);
          top: -160px; left: -120px;
          animation: blobDrift 14s ease-in-out infinite;
        }
        .signin-blob-2 {
          width: 420px; height: 420px;
          background: rgba(5, 150, 105, 0.35);
          bottom: -100px; right: -100px;
          animation: blobDrift 17s ease-in-out infinite reverse;
        }
        .signin-blob-3 {
          width: 300px; height: 300px;
          background: rgba(52, 211, 153, 0.22);
          top: 42%; left: 28%;
          animation: blobDrift 11s ease-in-out infinite 4s;
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(18px, -28px) scale(1.04); }
          66%  { transform: translate(-14px, 14px) scale(0.97); }
        }

        /* Grid mesh overlay */
        .signin-grid-mesh {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }

        /* Logo row */
        .signin-brand-logo {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .signin-brand-name {
          color: #ffffff;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: -0.3px;
        }

        /* Hero copy */
        .signin-brand-hero {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
        }
        .signin-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 100px;
          backdrop-filter: blur(8px);
          margin-bottom: 20px;
          width: fit-content;
        }
        .signin-badge span {
          color: #a7f3d0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .signin-brand-headline {
          font-size: clamp(28px, 3.2vw, 44px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin: 0 0 16px;
          font-style: normal;
        }
        .signin-brand-em {
          color: #6ee7b7;
          font-style: normal;
        }
        .signin-brand-sub {
          color: rgba(209, 250, 229, 0.75);
          font-size: 15px;
          line-height: 1.65;
          max-width: 340px;
          margin: 0 0 36px;
        }

        /* Feature list */
        .signin-features {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .signin-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(236, 253, 245, 0.88);
          font-size: 14px;
        }
        .signin-feature-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #6ee7b7;
        }

        /* Testimonial */
        .signin-testimonial {
          position: relative;
          z-index: 1;
          margin: 0;
          padding: 20px 24px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 16px;
          backdrop-filter: blur(12px);
        }
        .signin-testimonial p {
          color: rgba(255,255,255,0.88);
          font-size: 13.5px;
          line-height: 1.6;
          font-style: italic;
          margin: 0 0 14px;
        }
        .signin-testimonial-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .signin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 11px;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.25);
        }
        .signin-testimonial-footer strong {
          display: block;
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
        }
        .signin-testimonial-footer span {
          color: rgba(167, 243, 208, 0.65);
          font-size: 11.5px;
        }

        /* ── Form panel ────────────────────────────────────────── */
        .signin-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          position: relative;
          padding: 40px 24px;
        }
        .dark .signin-form-panel { background: #0f172a; }

        /* Mobile logo */
        .signin-mobile-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
        }
        .signin-mobile-logo span {
          font-weight: 700;
          font-size: 20px;
          color: #111827;
        }
        .dark .signin-mobile-logo span { color: #f1f5f9; }
        @media (min-width: 1024px) {
          .signin-mobile-logo { display: none; }
        }

        /* Card */
        .signin-card {
          width: 100%;
          max-width: 380px;
          animation: fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .signin-card-header { margin-bottom: 32px; }
        .signin-card-header h1 {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin: 0 0 6px;
          line-height: 1.15;
        }
        .dark .signin-card-header h1 { color: #f1f5f9; }
        .signin-card-header p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .dark .signin-card-header p { color: #94a3b8; }

        /* Form */
        .signin-form { display: flex; flex-direction: column; gap: 20px; }

        .signin-field { display: flex; flex-direction: column; }

        .signin-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 7px;
        }
        .dark .signin-label { color: #cbd5e1; }

        /* Ant Design input overrides */
        .si-input .ant-input-affix-wrapper,
        .si-input .ant-input {
          border-radius: 10px !important;
          border-color: #e2e8f0 !important;
          background: #f8fafc !important;
          font-size: 14px !important;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s !important;
        }
        .si-input .ant-input-affix-wrapper:hover {
          border-color: #94a3b8 !important;
        }
        .si-input .ant-input-affix-wrapper:focus-within {
          border-color: rgb(22, 163, 74) !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12) !important;
        }
        .si-input .ant-input::placeholder,
        .si-input .ant-input-affix-wrapper input::placeholder {
          color: #94a3b8 !important;
          opacity: 1 !important;
        }
        .dark .si-input .ant-input-affix-wrapper,
        .dark .si-input .ant-input {
          background: #1e293b !important;
          border-color: #334155 !important;
          color: #f1f5f9 !important;
        }
        .dark .si-input .ant-input-affix-wrapper:focus-within {
          background: #263245 !important;
          border-color: rgb(22, 163, 74) !important;
        }

        /* Eye button */
        .si-eye-btn {
          background: none;
          border: none;
          padding: 0 2px;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
          border-radius: 4px;
          transition: color 0.15s;
        }
        .si-eye-btn:hover { color: #475569; }

        /* Submit button */
        .si-submit-btn {
          margin-top: 4px;
          height: 48px !important;
          border-radius: 12px !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          letter-spacing: 0.01em !important;
          transition: transform 0.18s, box-shadow 0.18s !important;
        }
        .si-submit-btn.ant-btn-primary {
          background: linear-gradient(135deg, rgb(22, 163, 74) 0%, rgb(5, 150, 105) 100%) !important;
          border: none !important;
          box-shadow: 0 6px 22px rgba(22, 163, 74, 0.38), 0 2px 8px rgba(22, 163, 74, 0.18) !important;
        }
        .si-submit-btn.ant-btn-primary:hover {
          background: linear-gradient(135deg, rgb(20, 148, 68) 0%, rgb(4, 136, 79) 100%) !important;
          box-shadow: 0 10px 28px rgba(22, 163, 74, 0.48), 0 4px 12px rgba(22, 163, 74, 0.22) !important;
          transform: translateY(-2px) !important;
        }
        .si-submit-btn.ant-btn-primary:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.28) !important;
        }

        /* Footer */
        .signin-footer {
          position: absolute;
          bottom: 20px;
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
        }
        .dark .signin-footer { color: #475569; }
      `}</style>
    </div>
  );
}
