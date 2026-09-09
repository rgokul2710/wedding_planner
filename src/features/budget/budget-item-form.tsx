import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { optionalNonNegativeNumber, optionalText } from '@/lib/zod-helpers'
import type { BudgetCategory } from '@/services/budget-categories'
import type { BudgetItem, BudgetItemInput } from '@/services/budget-items'

const budgetItemSchema = z.object({
  categoryId: optionalText,
  description: z.string().min(1, 'Description is required'),
  vendor: optionalText,
  plannedAmount: z.coerce.number().nonnegative('Must be zero or more'),
  actualAmount: optionalNonNegativeNumber,
  amountPaid: z.coerce.number().nonnegative('Must be zero or more'),
  dueDate: optionalText,
  notes: optionalText,
})

type BudgetItemFormValues = z.infer<typeof budgetItemSchema>

interface BudgetItemFormProps {
  item?: BudgetItem
  categories: BudgetCategory[]
  onSubmit: (input: BudgetItemInput) => Promise<unknown>
  onCancel: () => void
}

export function BudgetItemForm({ item, categories, onSubmit, onCancel }: BudgetItemFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BudgetItemFormValues>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      categoryId: item?.category_id ?? undefined,
      description: item?.description ?? '',
      vendor: item?.vendor ?? undefined,
      plannedAmount: item?.planned_amount ?? 0,
      actualAmount: item?.actual_amount ?? undefined,
      amountPaid: item?.amount_paid ?? 0,
      dueDate: item?.due_date ?? undefined,
      notes: item?.notes ?? undefined,
    },
  })

  async function handleFormSubmit(values: BudgetItemFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        categoryId: values.categoryId ?? null,
        description: values.description,
        vendor: values.vendor ?? null,
        plannedAmount: values.plannedAmount,
        actualAmount: values.actualAmount ?? null,
        amountPaid: values.amountPaid,
        dueDate: values.dueDate ?? null,
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
          <Label htmlFor="category">Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="vendor">Vendor</Label>
        <Input id="vendor" {...register('vendor')} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="plannedAmount">Planned amount</Label>
          <Input id="plannedAmount" type="number" min={0} inputMode="decimal" {...register('plannedAmount')} />
          {errors.plannedAmount && <p className="mt-1.5 text-xs text-danger-500">{errors.plannedAmount.message}</p>}
        </div>
        <div>
          <Label htmlFor="actualAmount">Actual amount</Label>
          <Input id="actualAmount" type="number" min={0} inputMode="decimal" {...register('actualAmount')} />
        </div>
        <div>
          <Label htmlFor="amountPaid">Amount paid</Label>
          <Input id="amountPaid" type="number" min={0} inputMode="decimal" {...register('amountPaid')} />
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate">Due date</Label>
        <Input id="dueDate" type="date" {...register('dueDate')} />
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
          {item ? 'Save Changes' : 'Add Budget Item'}
        </Button>
      </DialogFooter>
    </form>
  )
}
