import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalElements, size, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = page * size + 1
  const end = Math.min((page + 1) * size, totalElements)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
      <p className="text-sm text-gray-500">
        {start}–{end} sur {totalElements.toLocaleString('fr-FR')} résultats
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary" size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
        <span className="px-3 text-sm text-gray-600">
          {page + 1} / {totalPages}
        </span>
        <Button
          variant="secondary" size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
