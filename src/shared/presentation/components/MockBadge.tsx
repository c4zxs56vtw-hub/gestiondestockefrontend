import { FlaskConical } from 'lucide-react'

export function MockBadge() {
  if (import.meta.env.VITE_API_MODE !== 'mock') return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-light border border-warning-border text-warning-text text-xs font-medium px-2.5 py-1">
      <FlaskConical className="h-3.5 w-3.5" aria-hidden />
      Données simulées
    </span>
  )
}
