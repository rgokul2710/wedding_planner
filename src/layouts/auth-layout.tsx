import { Heart } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-10 dark:bg-ink-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-cream-25">
            <Heart className="size-6" fill="currentColor" />
          </div>
          <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Our Wedding Planner</h1>
          <p className="text-sm text-ink-400">A private space to plan every detail, together.</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
