import type * as React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'

export function LoginPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.info('Sign-in will be enabled once Supabase auth is connected (Phase 2).')
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-rose-500 hover:text-rose-600">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-400">
        New here?{' '}
        <Link to="/signup" className="font-medium text-rose-500 hover:text-rose-600">
          Create an account
        </Link>
      </p>
    </Card>
  )
}
