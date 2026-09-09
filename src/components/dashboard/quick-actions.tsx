import { CalendarPlus, ListPlus, ReceiptText, Store, UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const ACTIONS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Add Task', to: '/tasks', icon: ListPlus },
  { label: 'Add Guest', to: '/guests', icon: UserPlus },
  { label: 'Add Expense', to: '/budget', icon: ReceiptText },
  { label: 'Add Vendor', to: '/vendors', icon: Store },
  { label: 'Add Event', to: '/events', icon: CalendarPlus },
]

export function QuickActions() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {ACTIONS.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-xl border border-ink-200 bg-cream-25 px-3.5 py-2.5 text-sm font-medium text-ink-700 transition-colors',
            'hover:border-rose-300 hover:text-rose-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:hover:border-rose-500/50 dark:hover:text-rose-300',
          )}
        >
          <action.icon className="size-4 text-rose-500" />
          {action.label}
        </Link>
      ))}
    </div>
  )
}
