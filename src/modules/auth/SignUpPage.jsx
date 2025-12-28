import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { signUp } from '../../auth/authSlice'
import Button from '../../common/ant/Button'
import Input from '../../common/ant/Input'

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
              <Input
                size="middle"
                placeholder={t('auth.name')}
                allowClear
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('auth.email')}</label>
              <Input
                size="middle"
                placeholder={t('auth.email')}
                allowClear
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('auth.password')}</label>
              <Input
                type="password"
                size="middle"
                placeholder={t('auth.password')}
                allowClear
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            <Button block size="middle" type="primary" htmlType="submit">
              {t('auth.signUp')}
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-4">Have an account? <Link className="text-blue-600" to="/auth/sign-in">{t('auth.signIn')}</Link></p>
        </div>
      </div>
  )
}
