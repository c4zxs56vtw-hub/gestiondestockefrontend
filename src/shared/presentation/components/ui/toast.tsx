import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from './cn'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            open
            onOpenChange={(open) => { if (!open) setToasts((prev) => prev.filter((x) => x.id !== t.id)) }}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 shadow-panel w-80 bg-white',
              'data-[state=open]:animate-fade-in',
              t.variant === 'success' && 'border-success-border',
              t.variant === 'error' && 'border-danger-border',
              t.variant === 'warning' && 'border-warning-border',
              t.variant === 'info' && 'border-info-border',
            )}
          >
            <span aria-hidden className="mt-0.5 shrink-0">
              {t.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-success" />}
              {t.variant === 'error' && <AlertCircle className="h-5 w-5 text-danger" />}
              {t.variant === 'warning' && <AlertTriangle className="h-5 w-5 text-warning" />}
              {t.variant === 'info' && <Info className="h-5 w-5 text-info" />}
            </span>
            <ToastPrimitive.Description className="flex-1 text-sm text-gray-700">{t.message}</ToastPrimitive.Description>
            <ToastPrimitive.Close className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" aria-hidden />
              <span className="sr-only">Fermer</span>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
