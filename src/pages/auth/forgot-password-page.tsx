import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormError } from '@/components/ui/form-error'
import { Input, Label } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [formError, setFormError] = React.useState<string | null>(null)
  const [sent, setSent] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(values: ForgotPasswordForm) {
    setFormError(null)
    const { error } = await requestPasswordReset(values.email)
    if (error) {
      setFormError(error)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 className="size-8 text-success-500" />
          <p className="text-sm text-ink-600 dark:text-ink-200">
            If an account exists for that email, we've sent a link to reset your password.
          </p>
          <Link to="/login" className="mt-2 text-sm font-medium text-rose-500 hover:text-rose-600">
            Back to log in
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && <FormError message={formError} />}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
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
