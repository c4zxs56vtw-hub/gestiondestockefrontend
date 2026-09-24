import * as React from 'react'
import { cn } from './cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded border bg-white px-3 py-1 text-sm text-gray-900 shadow-none transition-colors placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-primary-500',
        error
          ? 'border-danger text-danger-text focus:ring-danger'
          : 'border-surface-border hover:border-gray-400',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
        className,
      )}
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
