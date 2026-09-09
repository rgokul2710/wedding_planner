import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormError } from '@/components/ui/form-error'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '@/features/tasks/constants'
import { optionalNonNegativeNumber, optionalText } from '@/lib/zod-helpers'
import type { Task, TaskInput } from '@/services/tasks'

const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: optionalText,
  category: z.string().min(1),
  assignedTo: optionalText,
  dueDate: optionalText,
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['not_started', 'in_progress', 'completed', 'cancelled']),
  estimatedCost: optionalNonNegativeNumber,
  actualCost: optionalNonNegativeNumber,
  notes: optionalText,
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task
  onSubmit: (input: TaskInput) => Promise<unknown>
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name ?? '',
      description: task?.description ?? undefined,
      category: task?.category ?? TASK_CATEGORIES[TASK_CATEGORIES.length - 1],
      assignedTo: task?.assigned_to ?? undefined,
      dueDate: task?.due_date ?? undefined,
      priority: task?.priority ?? 'medium',
      status: task?.status ?? 'not_started',
      estimatedCost: task?.estimated_cost ?? undefined,
      actualCost: task?.actual_cost ?? undefined,
      notes: task?.notes ?? undefined,
    },
  })

  async function handleFormSubmit(values: TaskFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        name: values.name,
        description: values.description ?? null,
        category: values.category,
        assignedTo: values.assignedTo ?? null,
        dueDate: values.dueDate ?? null,
        priority: values.priority,
        status: values.status,
        estimatedCost: values.estimatedCost ?? null,
        actualCost: values.actualCost ?? null,
        notes: values.notes ?? null,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && <FormError message={formError} />}

      <div>
        <Label htmlFor="name">Task name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="mt-1.5 text-xs text-danger-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                  {TASK_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label htmlFor="assignedTo">Assigned to</Label>
          <Input id="assignedTo" placeholder="e.g. Priya" {...register('assignedTo')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" {...register('dueDate')} />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
                  {TASK_STATUSES.map((status) => (
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
          <Label htmlFor="estimatedCost">Estimated cost</Label>
          <Input id="estimatedCost" type="number" min={0} inputMode="decimal" {...register('estimatedCost')} />
        </div>
        <div>
          <Label htmlFor="actualCost">Actual cost</Label>
          <Input id="actualCost" type="number" min={0} inputMode="decimal" {...register('actualCost')} />
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
          {task ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogFooter>
    </form>
  )
}
