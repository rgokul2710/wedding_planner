import { Heart } from 'lucide-react'

export function ConfigMissingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 px-4 text-center dark:bg-ink-900">
      <Heart className="size-10 text-rose-300" />
      <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Supabase isn't configured yet</h1>
      <p className="max-w-md text-sm text-ink-400">
        Copy <code className="rounded bg-cream-100 px-1.5 py-0.5 text-ink-600 dark:bg-ink-800 dark:text-ink-200">.env.example</code> to{' '}
        <code className="rounded bg-cream-100 px-1.5 py-0.5 text-ink-600 dark:bg-ink-800 dark:text-ink-200">.env</code>, fill in your Supabase
        project URL and anon key, and restart the dev server.
      </p>
    </div>
  )
}
