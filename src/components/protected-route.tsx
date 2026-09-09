import { Loader2 } from 'lucide-react'
import type * as React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 dark:bg-ink-900">
      <Loader2 className="size-6 animate-spin text-rose-400" />
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
