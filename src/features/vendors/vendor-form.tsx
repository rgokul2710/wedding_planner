import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormError } from '@/components/ui/form-error'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StarRating } from '@/components/ui/star-rating'
import { VENDOR_CATEGORIES, VENDOR_STATUSES } from '@/features/vendors/constants'
import { optionalNonNegativeNumber, optionalText } from '@/lib/zod-helpers'
import type { Vendor, VendorInput } from '@/services/vendors'

const vendorSchema = z.object({
  name: z.string().min(1, "Vendor's name is required"),
  category: z.string().min(1),
  contactPerson: optionalText,
  phone: optionalText,
  email: z.preprocess((v) => (v === '' ? undefined : v), z.string().email('Enter a valid email').optional()),
  website: optionalText,
  address: optionalText,
  quotedAmount: optionalNonNegativeNumber,
  finalAmount: optionalNonNegativeNumber,
  advancePaid: z.coerce.number().nonnegative('Must be zero or more'),
  rating: z.number().int().min(1).max(5).nullable(),
  status: z.enum(['considering', 'selected', 'rejected']),
  pros: optionalText,
  cons: optionalText,
  notes: optionalText,
})

type VendorFormValues = z.infer<typeof vendorSchema>

interface VendorFormProps {
  vendor?: Vendor
  onSubmit: (input: VendorInput) => Promise<unknown>
  onCancel: () => void
}

export function VendorForm({ vendor, onSubmit, onCancel }: VendorFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: vendor?.name ?? '',
      category: vendor?.category ?? VENDOR_CATEGORIES[VENDOR_CATEGORIES.length - 1],
      contactPerson: vendor?.contact_person ?? undefined,
      phone: vendor?.phone ?? undefined,
      email: vendor?.email ?? undefined,
      website: vendor?.website ?? undefined,
      address: vendor?.address ?? undefined,
      quotedAmount: vendor?.quoted_amount ?? undefined,
      finalAmount: vendor?.final_amount ?? undefined,
      advancePaid: vendor?.advance_paid ?? 0,
      rating: vendor?.rating ?? null,
      status: vendor?.status ?? 'considering',
      pros: vendor?.pros ?? undefined,
      cons: vendor?.cons ?? undefined,
      notes: vendor?.notes ?? undefined,
    },
  })

  async function handleFormSubmit(values: VendorFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        name: values.name,
        category: values.category,
        contactPerson: values.contactPerson ?? null,
        phone: values.phone ?? null,
        email: values.email ?? null,
        website: values.website ?? null,
        address: values.address ?? null,
        quotedAmount: values.quotedAmount ?? null,
        finalAmount: values.finalAmount ?? null,
        advancePaid: values.advancePaid,
        rating: values.rating,
        status: values.status,
        pros: values.pros ?? null,
        cons: values.cons ?? null,
        notes: values.notes ?? null,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && <FormError message={formError} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Vendor name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1.5 text-xs text-danger-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" {...register('contactPerson')} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register('phone')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" placeholder="https://…" {...register('website')} />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register('address')} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="quotedAmount">Quoted amount</Label>
          <Input id="quotedAmount" type="number" min={0} inputMode="decimal" {...register('quotedAmount')} />
        </div>
        <div>
          <Label htmlFor="finalAmount">Final amount</Label>
          <Input id="finalAmount" type="number" min={0} inputMode="decimal" {...register('finalAmount')} />
        </div>
        <div>
          <Label htmlFor="advancePaid">Advance paid</Label>
          <Input id="advancePaid" type="number" min={0} inputMode="decimal" {...register('advancePaid')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rating</Label>
          <Controller control={control} name="rating" render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_STATUSES.map((status) => (
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pros">Pros</Label>
          <Textarea id="pros" placeholder="What's good about them?" {...register('pros')} />
        </div>
        <div>
          <Label htmlFor="cons">Cons</Label>
          <Textarea id="cons" placeholder="What's the downside?" {...register('cons')} />
        </div>
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
          {vendor ? 'Save Changes' : 'Add Vendor'}
        </Button>
      </DialogFooter>
    </form>
  )
}
