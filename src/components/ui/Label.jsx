/* eslint-disable react/prop-types -- no prop-types package; Zod validates data at the API boundary per AGENTS.md */
import { cn } from '../../lib/utils'

export function Label({ className, ...props }) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-text', className)} {...props} />
}
