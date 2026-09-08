import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 px-4 text-center dark:bg-ink-900">
      <Heart className="size-10 text-rose-300" />
      <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-400">
        This page doesn't exist, or the link may be out of date.
      </p>
      <Button asChild>
        <Link to="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
