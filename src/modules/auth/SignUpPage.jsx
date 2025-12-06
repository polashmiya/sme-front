import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { signUp } from '../../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md card">
        <h1 className="page-title mb-6">{t('auth.signUp')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t('auth.name')}</label>
            <input className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" {...register('name')} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">{t('auth.email')}</label>
            <input className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">{t('auth.password')}</label>
            <input type="password" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" {...register('password')} />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button className="btn-primary w-full" type="submit">{t('auth.signUp')}</button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Have an account? <Link className="text-blue-600" to="/auth/sign-in">{t('auth.signIn')}</Link></p>
      </div>
    </div>
  )
}
