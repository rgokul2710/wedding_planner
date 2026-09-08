import { MoreHorizontal } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { MORE_NAV_ITEMS, PRIMARY_NAV_ITEMS } from '@/lib/nav'

export function BottomNav() {
  const location = useLocation()
  const isMoreActive = MORE_NAV_ITEMS.some((item) => location.pathname.startsWith(item.path))

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-100 bg-cream-25/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm dark:border-ink-800 dark:bg-ink-900/95 lg:hidden"
      aria-label="Primary"
    >
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-400 transition-colors',
              isActive && 'text-rose-500',
            )
          }
        >
          <item.icon className="size-5" />
          {item.label}
        </NavLink>
      ))}
      <NavLink
        to="/more"
        className={cn(
          'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-400 transition-colors',
          isMoreActive && 'text-rose-500',
        )}
      >
        <MoreHorizontal className="size-5" />
        More
      </NavLink>
    </nav>
  )
}
