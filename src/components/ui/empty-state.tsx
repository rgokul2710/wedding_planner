import type { LucideIcon } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 px-6 py-12 text-center dark:border-ink-700', className)}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-50">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
