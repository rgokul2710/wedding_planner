import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginForm) {
    setFormError(null)
    const { error } = await signIn(values.email, values.password)
    if (error) {
      setFormError(error)
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register('password')} />
          {errors.password && <p className="mt-1.5 text-xs text-danger-500">{errors.password.message}</p>}
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-rose-500 hover:text-rose-600">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
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
