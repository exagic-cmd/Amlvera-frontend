/* eslint-disable react/prop-types -- no prop-types package; Zod validates data at the API boundary per AGENTS.md */
import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'h-10 w-full rounded-md border bg-surface px-3 text-sm text-text placeholder:text-text-muted',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        error ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-brand-500',
        className,
      )}
      {...props}
    />
  )
})
