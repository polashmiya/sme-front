
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FormHeader({ title, right }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-1 rounded hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  )
}
