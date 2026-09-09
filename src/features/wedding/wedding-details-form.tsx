import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { Input, Label } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CURRENCIES, DEFAULT_CURRENCY } from '@/lib/currencies'
import { optionalNonNegativeNumber, optionalPositiveInt, optionalText } from '@/lib/zod-helpers'
import type { WeddingDetailsInput } from '@/services/weddings'

const weddingDetailsSchema = z.object({
  brideName: z.string().min(1, "Bride's name is required"),
  groomName: z.string().min(1, "Groom's name is required"),
  weddingDate: z.string().min(1, 'Wedding date is required'),
  engagementDate: optionalText,
  receptionDate: optionalText,
  weddingVenue: optionalText,
  receptionVenue: optionalText,
  city: optionalText,
  expectedGuestCount: optionalPositiveInt,
  estimatedBudget: optionalNonNegativeNumber,
  currency: z.string().min(1),
})

export type WeddingDetailsFormValues = z.infer<typeof weddingDetailsSchema>

interface WeddingDetailsFormProps {
  defaultValues?: Partial<WeddingDetailsFormValues>
  submitLabel: string
  onSubmit: (input: WeddingDetailsInput) => Promise<unknown>
}

export function WeddingDetailsForm({ defaultValues, submitLabel, onSubmit }: WeddingDetailsFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WeddingDetailsFormValues>({
    resolver: zodResolver(weddingDetailsSchema),
    defaultValues: { currency: DEFAULT_CURRENCY, ...defaultValues },
  })

  async function handleFormSubmit(values: WeddingDetailsFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        brideName: values.brideName,
        groomName: values.groomName,
        weddingDate: values.weddingDate,
        engagementDate: values.engagementDate ?? null,
        receptionDate: values.receptionDate ?? null,
        weddingVenue: values.weddingVenue ?? null,
        receptionVenue: values.receptionVenue ?? null,
        city: values.city ?? null,
        expectedGuestCount: values.expectedGuestCount ?? null,
        estimatedBudget: values.estimatedBudget ?? null,
        currency: values.currency,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && <FormError message={formError} />}

      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">The Couple</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="brideName">Bride's name</Label>
            <Input id="brideName" {...register('brideName')} />
            {errors.brideName && <p className="mt-1.5 text-xs text-danger-500">{errors.brideName.message}</p>}
          </div>
          <div>
            <Label htmlFor="groomName">Groom's name</Label>
            <Input id="groomName" {...register('groomName')} />
            {errors.groomName && <p className="mt-1.5 text-xs text-danger-500">{errors.groomName.message}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Key Dates</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="engagementDate">Engagement date</Label>
            <Input id="engagementDate" type="date" {...register('engagementDate')} />
          </div>
          <div>
            <Label htmlFor="weddingDate">Wedding date</Label>
            <Input id="weddingDate" type="date" {...register('weddingDate')} />
            {errors.weddingDate && <p className="mt-1.5 text-xs text-danger-500">{errors.weddingDate.message}</p>}
          </div>
          <div>
            <Label htmlFor="receptionDate">Reception date</Label>
            <Input id="receptionDate" type="date" {...register('receptionDate')} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Venues &amp; City</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="weddingVenue">Wedding venue</Label>
            <Input id="weddingVenue" {...register('weddingVenue')} />
          </div>
          <div>
            <Label htmlFor="receptionVenue">Reception venue</Label>
            <Input id="receptionVenue" {...register('receptionVenue')} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Guests &amp; Budget</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="expectedGuestCount">Expected guest count</Label>
            <Input id="expectedGuestCount" type="number" min={1} inputMode="numeric" {...register('expectedGuestCount')} />
            {errors.expectedGuestCount && <p className="mt-1.5 text-xs text-danger-500">{errors.expectedGuestCount.message}</p>}
          </div>
          <div>
            <Label htmlFor="estimatedBudget">Estimated total budget</Label>
            <Input id="estimatedBudget" type="number" min={0} inputMode="decimal" {...register('estimatedBudget')} />
            {errors.estimatedBudget && <p className="mt-1.5 text-xs text-danger-500">{errors.estimatedBudget.message}</p>}
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

      <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
