import { Heart } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled error in render tree:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 px-4 text-center dark:bg-ink-900">
        <Heart className="size-10 text-rose-300" />
        <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Something went wrong</h1>
        <p className="max-w-sm text-sm text-ink-400">
          An unexpected error occurred. Reloading the page usually fixes this — your data is safe either way.
        </p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    )
  }
}
