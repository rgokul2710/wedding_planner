import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MORE_NAV_ITEMS } from '@/lib/nav'

export function MorePage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">More</h1>
      <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-cream-25 dark:divide-ink-800 dark:border-ink-800 dark:bg-ink-800/60">
        {MORE_NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-cream-100 dark:hover:bg-ink-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300">
              <item.icon className="size-4" />
            </div>
            <span className="flex-1 text-sm font-medium text-ink-700 dark:text-ink-100">{item.label}</span>
            <ChevronRight className="size-4 text-ink-300" />
          </Link>
        ))}
      </div>
    </div>
  )
}
