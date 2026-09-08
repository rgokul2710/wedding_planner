import type * as React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'

export function SignupPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.info('Sign-up will be enabled once Supabase auth is connected (Phase 2).')
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="full-name">Full name</Label>
          <Input id="full-name" name="fullName" placeholder="Your name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" />
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-rose-500 hover:text-rose-600">
          Log in
        </Link>
      </p>
    </Card>
  )
}
