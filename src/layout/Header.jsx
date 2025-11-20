import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Search, User, LogOut } from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { signOut } from '../features/auth/authSlice'

export default function Header() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
  <header className="header-area bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
          <input className="pl-8 pr-3 py-2 rounded-md border border-gray-300 text-sm w-[320px]" placeholder={t('common.search')} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button className="btn-outline"><User size={16} /> Admin</button>
        <button className="btn-primary" onClick={() => dispatch(signOut())}><LogOut size={16} /> {t('auth.signOut')}</button>
      </div>
    </header>
  )
}
