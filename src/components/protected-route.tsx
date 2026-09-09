import { AlertCircle, Loader2 } from 'lucide-react'
import type * as React from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useWedding } from '@/hooks/use-wedding'

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 dark:bg-ink-900">
      <Loader2 className="size-6 animate-spin text-rose-400" />
    </div>
  )
}

function FullScreenError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-50 px-4 text-center dark:bg-ink-900">
      <AlertCircle className="size-8 text-danger-500" />
      <p className="text-sm text-ink-600 dark:text-ink-200">Couldn't load your wedding details.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <FullScreenLoader />
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <FullScreenLoader />
  if (session) return <Navigate to="/" replace />
  return <>{children}</>
}

export function RequireWedding({ children }: { children: React.ReactNode }) {
  const { data: wedding, isPending, isError, refetch } = useWedding()

  if (isPending) return <FullScreenLoader />
  if (isError) return <FullScreenError onRetry={() => refetch()} />
  if (!wedding) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export function RedirectIfHasWedding({ children }: { children: React.ReactNode }) {
  const { data: wedding, isPending, isError, refetch } = useWedding()

  if (isPending) return <FullScreenLoader />
  if (isError) return <FullScreenError onRetry={() => refetch()} />
  if (wedding) return <Navigate to="/" replace />
  return <>{children}</>
}
