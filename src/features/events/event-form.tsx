import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { optionalText } from '@/lib/zod-helpers'
import type { EventInput, WeddingEvent } from '@/services/events'

const eventSchema = z
  .object({
    name: z.string().min(1, 'Event name is required'),
    eventDate: z.string().min(1, 'Date is required'),
    startTime: optionalText,
    endTime: optionalText,
    venue: optionalText,
    description: optionalText,
    responsiblePerson: optionalText,
    notes: optionalText,
  })
  .refine((data) => !data.startTime || !data.endTime || data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
  event?: WeddingEvent
  defaultDate?: string
  onSubmit: (input: EventInput) => Promise<unknown>
  onCancel: () => void
}

export function EventForm({ event, defaultDate, onSubmit, onCancel }: EventFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name ?? '',
      eventDate: event?.event_date ?? defaultDate ?? '',
      startTime: event?.start_time ?? undefined,
      endTime: event?.end_time ?? undefined,
      venue: event?.venue ?? undefined,
      description: event?.description ?? undefined,
      responsiblePerson: event?.responsible_person ?? undefined,
      notes: event?.notes ?? undefined,
    },
  })

  async function handleFormSubmit(values: EventFormValues) {
    setFormError(null)
    try {
      await onSubmit({
        name: values.name,
        eventDate: values.eventDate,
        startTime: values.startTime ?? null,
        endTime: values.endTime ?? null,
        venue: values.venue ?? null,
        description: values.description ?? null,
        responsiblePerson: values.responsiblePerson ?? null,
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

      <div>
        <Label htmlFor="name">Event name</Label>
        <Input id="name" placeholder="e.g. Mehendi" {...register('name')} />
        {errors.name && <p className="mt-1.5 text-xs text-danger-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="eventDate">Date</Label>
          <Input id="eventDate" type="date" {...register('eventDate')} />
          {errors.eventDate && <p className="mt-1.5 text-xs text-danger-500">{errors.eventDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="startTime">Start time</Label>
          <Input id="startTime" type="time" {...register('startTime')} />
        </div>
        <div>
          <Label htmlFor="endTime">End time</Label>
          <Input id="endTime" type="time" {...register('endTime')} />
          {errors.endTime && <p className="mt-1.5 text-xs text-danger-500">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" {...register('venue')} />
        </div>
        <div>
          <Label htmlFor="responsiblePerson">Responsible person</Label>
          <Input id="responsiblePerson" {...register('responsiblePerson')} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
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
          {event ? 'Save Changes' : 'Add Event'}
        </Button>
      </DialogFooter>
    </form>
  )
}
