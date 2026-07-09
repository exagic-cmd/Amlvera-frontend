/* eslint-disable react/prop-types -- no prop-types package; Zod validates data at the API boundary per AGENTS.md */
import { cn } from '../../lib/utils'

export function Logo({ className, ...props }) {
  return <img src="/amlvera.png" alt="Amlvera" className={cn('h-8 w-auto', className)} {...props} />
}
