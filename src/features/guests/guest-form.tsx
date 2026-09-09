import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FOOD_PREFERENCES, INVITATION_STATUSES, RSVP_STATUSES } from '@/features/guests/constants'
import { optionalText } from '@/lib/zod-helpers'
import type { GuestGroup } from '@/services/guest-groups'
import type { Guest, GuestInput } from '@/services/guests'

const guestSchema = z
  .object({
    name: z.string().min(1, "Guest's name is required"),
    groupName: optionalText,
    phone: optionalText,
    email: z.preprocess((v) => (v === '' ? undefined : v), z.string().email('Enter a valid email').optional()),
    totalGuests: z.coerce.number().int().min(1, 'Must be at least 1'),
    childCount: z.coerce.number().int().min(0, 'Cannot be negative'),
    rsvpStatus: z.enum(['pending', 'confirmed', 'declined']),
    foodPreference: optionalText,
    accommodationRequired: z.boolean(),
    transportationRequired: z.boolean(),
    invitationStatus: z.enum(['not_sent', 'sent', 'delivered']),
    notes: optionalText,
  })
  .refine((data) => data.childCount <= data.totalGuests, {
    message: "Can't exceed the number of guests",
    path: ['childCount'],
  })

type GuestFormValues = z.infer<typeof guestSchema>

interface GuestFormProps {
  guest?: Guest
  groups: GuestGroup[]
  currentGroupName?: string
  onSubmit: (input: GuestInput) => Promise<unknown>
  onCancel: () => void
}

export function GuestForm({ guest, groups, currentGroupName, onSubmit, onCancel }: GuestFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name ?? '',
      groupName: currentGroupName ?? undefined,
      phone: guest?.phone ?? undefined,
      email: guest?.email ?? undefined,
      totalGuests: guest?.total_guests ?? 1,
      childCount: guest?.child_count ?? 0,
      rsvpStatus: guest?.rsvp_status ?? 'pending',
      foodPreference: guest?.food_preference ?? undefined,
      accommodationRequired: guest?.accommodation_required ?? false,
      transportationRequired: guest?.transportation_required ?? false,
      invitationStatus: guest?.invitation_status ?? 'not_sent',
      notes: guest?.notes ?? undefined,
    },
  })

  async function handleFormSubmit(values: GuestFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        name: values.name,
        groupName: values.groupName ?? null,
        phone: values.phone ?? null,
        email: values.email ?? null,
        totalGuests: values.totalGuests,
        childCount: values.childCount,
        rsvpStatus: values.rsvpStatus,
        foodPreference: values.foodPreference ?? null,
        accommodationRequired: values.accommodationRequired,
        transportationRequired: values.transportationRequired,
        invitationStatus: values.invitationStatus,
        notes: values.notes ?? null,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && (
        <div className="flex items-start gap-2 rounded-xl bg-danger-500/10 px-3 py-2.5 text-sm text-danger-500">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Guest name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1.5 text-xs text-danger-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="groupName">Family / Group</Label>
          <Input id="groupName" list="guest-group-suggestions" placeholder="e.g. Sharma Family" {...register('groupName')} />
          <datalist id="guest-group-suggestions">
            {groups.map((group) => (
              <option key={group.id} value={group.name} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register('phone')} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalGuests">Number of guests</Label>
          <Input id="totalGuests" type="number" min={1} inputMode="numeric" {...register('totalGuests')} />
          {errors.totalGuests && <p className="mt-1.5 text-xs text-danger-500">{errors.totalGuests.message}</p>}
        </div>
        <div>
          <Label htmlFor="childCount">Of which, children</Label>
          <Input id="childCount" type="number" min={0} inputMode="numeric" {...register('childCount')} />
          {errors.childCount && <p className="mt-1.5 text-xs text-danger-500">{errors.childCount.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rsvpStatus">RSVP status</Label>
          <Controller
            control={control}
            name="rsvpStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="rsvpStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RSVP_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label htmlFor="invitationStatus">Invitation status</Label>
          <Controller
            control={control}
            name="invitationStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="invitationStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVITATION_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="foodPreference">Food preference</Label>
        <Controller
          control={control}
          name="foodPreference"
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger id="foodPreference">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {FOOD_PREFERENCES.map((pref) => (
                  <SelectItem key={pref} value={pref}>
                    {pref}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <Controller
          control={control}
          name="accommodationRequired"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Accommodation required
            </label>
          )}
        />
        <Controller
          control={control}
          name="transportationRequired"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Transportation required
            </label>
          )}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {guest ? 'Save Changes' : 'Add Guest'}
        </Button>
      </DialogFooter>
    </form>
  )
}
