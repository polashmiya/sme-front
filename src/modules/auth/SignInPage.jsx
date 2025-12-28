import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { signIn } from '../../auth/authSlice'
import Button from '../../common/ant/Button'
import FormInput from '../../common/ant/FormInput'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
})

export default function SignInPage() {
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm({ resolver: yupResolver(schema) })
  const dispatch = useDispatch()
  const nav = useNavigate()
  const loc = useLocation()

  const onSubmit = (values) => {
    dispatch(signIn({ email: values.email, name: values.email.split('@')[0] }))
    const dest = loc.state?.from?.pathname || '/'
    nav(dest, { replace: true })
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md card">
          <h1 className="page-title mb-6">{t('auth.signIn')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="email"
              control={control}
              label={t('auth.email')}
              size="middle"
              placeholder={t('auth.email')}
              allowClear
            />
            <FormInput
              name="password"
              control={control}
              label={t('auth.password')}
              type="password"
              size="middle"
              placeholder={t('auth.password')}
              allowClear
            />
            <Button block size="middle" type="primary" htmlType="submit">
              {t('auth.signIn')}
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-4">No account? <Link className="text-blue-600" to="/auth/sign-up">{t('auth.signUp')}</Link></p>
        </div>
      </div>
  )
}
