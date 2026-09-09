import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormError } from '@/components/ui/form-error'
import { Input, Label } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INVITABLE_ROLES } from '@/features/family/constants'
import type { WeddingMemberRole } from '@/types/database'

const inviteSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.enum(['partner', 'family', 'viewer']),
})

type InviteFormValues = z.infer<typeof inviteSchema>

interface InviteFormProps {
  onSubmit: (email: string, role: WeddingMemberRole) => Promise<unknown>
  onCancel: () => void
}

export function InviteForm({ onSubmit, onCancel }: InviteFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'family' },
  })

  async function handleFormSubmit(values: InviteFormValues) {
    setFormError(null)
    try {
      await onSubmit(values.email, values.role)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && <FormError message={formError} />}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="them@example.com" {...register('email')} />
        {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INVITABLE_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label} — {role.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Send Invite
        </Button>
      </DialogFooter>
    </form>
  )
}
