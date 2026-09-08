import type * as React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'

export function ForgotPasswordPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.info('Password reset will be enabled once Supabase auth is connected (Phase 2).')
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-400">
        <Link to="/login" className="font-medium text-rose-500 hover:text-rose-600">
          Back to log in
        </Link>
      </p>
    </Card>
  )
}
