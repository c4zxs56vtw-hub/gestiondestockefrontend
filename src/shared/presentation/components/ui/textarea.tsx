import * as React from 'react'
import { cn } from './cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        error ? 'border-danger' : 'border-surface-border hover:border-gray-400',
        'disabled:cursor-not-allowed disabled:bg-gray-50',
        'resize-y',
        className,
      )}
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export { Textarea }
