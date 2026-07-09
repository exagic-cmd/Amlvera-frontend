/* eslint-disable react/prop-types -- no prop-types package; Zod validates data at the API boundary per AGENTS.md */
import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return <div className={cn('rounded-lg border border-border bg-surface shadow-sm', className)} {...props} />
}
