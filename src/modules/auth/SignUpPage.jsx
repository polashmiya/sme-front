import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { signUp } from '../../auth/authSlice'
import Button from '../../common/ant/Button'
import Input from '../../common/ant/Input'
import { AUTH_DASHBOARD_IMAGE } from './authBgImage'

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
})

export default function SignUpPage() {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const dispatch = useDispatch()
  const nav = useNavigate()

  const onSubmit = (values) => {
    dispatch(signUp({ email: values.email, name: values.name }))
    nav('/', { replace: true })
  }
  return (
    <div className="min-h-screen w-full flex items-stretch">
      {/* Left: Form with blackish animated background */}
      <div className="flex flex-col justify-center items-center w-full max-w-xl px-8 py-12 relative z-10 animate-fade-in-left">
        <div className="absolute inset-0 animate-light-purple-bg -z-10 rounded-none" />
        <h1 className="text-3xl font-bold text-white mb-8 drop-shadow">{t('auth.signUp')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div>
            <label className="text-sm font-medium text-gray-200">{t('auth.name')}</label>
            <Input
              size="middle"
              placeholder={t('auth.name')}
              allowClear
              {...register('name')}
              error={errors.name?.message}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200">{t('auth.email')}</label>
            <Input
              size="middle"
              placeholder={t('auth.email')}
              allowClear
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200">{t('auth.password')}</label>
            <Input
              type="password"
              size="middle"
              placeholder={t('auth.password')}
              allowClear
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
          <Button block size="middle" type="primary" htmlType="submit" className="transition-transform duration-300 hover:scale-105">
            {t('auth.signUp')}
          </Button>
        </form>
        <p className="text-sm text-gray-200 mt-8">
          Have an account?
          <Link className="ml-1 text-blue-400 hover:underline" to="/auth/sign-in">{t('auth.signIn')}</Link>
        </p>
      </div>
      {/* Right: Centered Dashboard Image with padding and shadow and lighter purple background */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden animate-fade-in-right animate-light-purple-bg">
        <img
          src={AUTH_DASHBOARD_IMAGE}
          alt="Dashboard Preview"
          className="relative z-10 max-w-[80%] max-h-[80%] rounded-2xl shadow-2xl border-4 border-white/30 bg-white/10 p-4"
          style={{ objectFit: 'contain' }}
        />
      </div>
      {/* Animations */}
      <style>{`
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
  )
}
