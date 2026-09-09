import type { Session, User } from '@supabase/supabase-js'
import * as React from 'react'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [loading, setLoading] = React.useState(true)
  const claimedUserId = React.useRef<string | null>(null)

  React.useEffect(() => {
    // Claim any pending family invite addressed to this email before anything
    // that depends on wedding membership (e.g. the onboarding redirect) runs.
    async function claimInvitesOnce(candidate: Session | null) {
      const userId = candidate?.user.id ?? null
      if (userId && claimedUserId.current !== userId) {
        claimedUserId.current = userId
        try {
          await supabase.rpc('claim_pending_invites')
        } catch {
          // Best-effort — a failed claim just means they stay on their own wedding (or onboarding).
        }
      }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      await claimInvitesOnce(data.session)
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      await claimInvitesOnce(newSession)
      setSession(newSession)
      setLoading(false)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const signIn = React.useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = React.useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error: error?.message ?? null, needsEmailConfirmation: !error && !data.session }
  }, [])

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const requestPasswordReset = React.useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}update-password`,
    })
    return { error: error?.message ?? null }
  }, [])

  const updatePassword = React.useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error?.message ?? null }
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
    }),
    [session, loading, signIn, signUp, signOut, requestPasswordReset, updatePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
