import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormError } from '@/components/ui/form-error'
import { Input, Label } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>

export function UpdatePasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({ resolver: zodResolver(updatePasswordSchema) })

  async function onSubmit(values: UpdatePasswordForm) {
    setFormError(null)
    const { error } = await updatePassword(values.password)
    if (error) {
      setFormError(error)
      return
    }
    toast.success('Password updated.')
    navigate('/', { replace: true })
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && <FormError message={formError} />}
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" {...register('password')} />
          {errors.password && <p className="mt-1.5 text-xs text-danger-500">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input id="confirm-password" type="password" placeholder="Re-enter password" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-danger-500">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Update Password
        </Button>
      </form>
    </Card>
  )
}
