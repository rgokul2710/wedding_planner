import { Heart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/nav'

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-cream-25 px-4 py-6 dark:border-ink-800 dark:bg-ink-800/40 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500 text-cream-25">
          <Heart className="size-5" fill="currentColor" />
        </div>
        <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Our Wedding</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors',
                'hover:bg-cream-100 dark:text-ink-300 dark:hover:bg-ink-700',
                isActive && 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200',
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
