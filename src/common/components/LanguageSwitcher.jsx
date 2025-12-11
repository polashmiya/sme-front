import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('bn') ? 'bn' : 'en'

  const toggle = () => {
    const next = current === 'en' ? 'bn' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.lang = next
  }

  return (
    <button onClick={toggle} className="btn-outline" title={current.toUpperCase()}>
      <Globe size={16} /> {current === 'en' ? 'EN' : 'BN'}
    </button>
  )
}
