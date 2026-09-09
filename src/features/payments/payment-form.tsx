import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/features/payments/constants'
import { optionalText } from '@/lib/zod-helpers'
import type { Payment, PaymentInput } from '@/services/payments'

const paymentSchema = z.object({
  vendor: optionalText,
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Must be greater than zero'),
  paymentDate: optionalText,
  paymentMethod: z.enum(['cash', 'upi', 'bank_transfer', 'card', 'other']).optional(),
  paymentStatus: z.enum(['not_paid', 'partially_paid', 'fully_paid']),
  dueDate: optionalText,
  referenceId: optionalText,
  notes: optionalText,
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  payment?: Payment
  onSubmit: (input: PaymentInput) => Promise<unknown>
  onCancel: () => void
}

export function PaymentForm({ payment, onSubmit, onCancel }: PaymentFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      vendor: payment?.vendor ?? undefined,
      description: payment?.description ?? '',
      amount: payment?.amount ?? 0,
      paymentDate: payment?.payment_date ?? undefined,
      paymentMethod: payment?.payment_method ?? undefined,
      paymentStatus: payment?.payment_status ?? 'not_paid',
      dueDate: payment?.due_date ?? undefined,
      referenceId: payment?.reference_id ?? undefined,
      notes: payment?.notes ?? undefined,
    },
  })

  async function handleFormSubmit(values: PaymentFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        vendor: values.vendor ?? null,
        description: values.description,
        amount: values.amount,
        paymentDate: values.paymentDate ?? null,
        paymentMethod: values.paymentMethod ?? null,
        paymentStatus: values.paymentStatus,
        dueDate: values.dueDate ?? null,
        referenceId: values.referenceId ?? null,
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
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register('description')} />
          {errors.description && <p className="mt-1.5 text-xs text-danger-500">{errors.description.message}</p>}
        </div>
        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <Input id="vendor" {...register('vendor')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min={0} inputMode="decimal" {...register('amount')} />
          {errors.amount && <p className="mt-1.5 text-xs text-danger-500">{errors.amount.message}</p>}
        </div>
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" {...register('dueDate')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentStatus">Payment status</Label>
          <Controller
            control={control}
            name="paymentStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="paymentStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((status) => (
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
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
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
          <Label htmlFor="paymentDate">Payment date</Label>
          <Input id="paymentDate" type="date" {...register('paymentDate')} />
        </div>
        <div>
          <Label htmlFor="referenceId">Reference / transaction ID</Label>
          <Input id="referenceId" {...register('referenceId')} />
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
          {payment ? 'Save Changes' : 'Add Payment'}
        </Button>
      </DialogFooter>
    </form>
  )
}
