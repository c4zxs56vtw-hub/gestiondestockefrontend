import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        success: 'bg-success-light text-success-text',
        warning: 'bg-warning-light text-warning-text',
        danger: 'bg-danger-light text-danger-text',
        info: 'bg-info-light text-info-text',
        secondary: 'bg-gray-100 text-gray-600',
        outline: 'border border-surface-border text-gray-600 bg-transparent',
      },
    },
    defaultVariants: { variant: 'secondary' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
