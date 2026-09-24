import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import type { AppError } from '@/shared/infrastructure/http/problem-details'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'

interface ErrorStateProps {
  error: AppError | Error | unknown
  onRetry?: () => void
  title?: string
}

export function ErrorState({ error, onRetry, title = 'Une erreur est survenue' }: ErrorStateProps) {
  const message =
    error instanceof Error && 'code' in error
      ? getErrorMessage((error as AppError).code)
      : error instanceof Error
        ? error.message
        : 'Erreur inconnue'

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <AlertCircle className="h-10 w-10 text-danger" aria-hidden />
      <div>
        <p className="text-base font-semibold text-gray-800">{title}</p>
        <p className="mt-1 text-sm text-gray-500 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" aria-hidden />
          Réessayer
        </Button>
      )}
    </div>
  )
}
