import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from './cn'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-sm font-medium text-gray-700 leading-none cursor-pointer', className)}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-danger" aria-hidden>*</span>}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
