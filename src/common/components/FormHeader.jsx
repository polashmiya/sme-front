import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FormHeader({ title, right }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  )
}
