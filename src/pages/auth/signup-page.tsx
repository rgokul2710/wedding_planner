import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignupForm = z.infer<typeof signupSchema>

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(values: SignupForm) {
    setFormError(null)
    const { error, needsEmailConfirmation } = await signUp(values.email, values.password, values.fullName)
    if (error) {
      setFormError(error)
      return
    }
    if (needsEmailConfirmation) {
      toast.success('Account created — check your email to confirm it, then log in.')
      navigate('/login', { replace: true })
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && (
          <div className="flex items-start gap-2 rounded-xl bg-danger-500/10 px-3 py-2.5 text-sm text-danger-500">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        <div>
          <Label htmlFor="full-name">Full name</Label>
          <Input id="full-name" placeholder="Your name" autoComplete="name" {...register('fullName')} />
          {errors.fullName && <p className="mt-1.5 text-xs text-danger-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" {...register('password')} />
          {errors.password && <p className="mt-1.5 text-xs text-danger-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
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
