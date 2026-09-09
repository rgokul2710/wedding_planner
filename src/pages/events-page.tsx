import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Loader2, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EventCalendar } from '@/features/events/event-calendar'
import { EventForm } from '@/features/events/event-form'
import { EventRow } from '@/features/events/event-row'
import { useAuth } from '@/hooks/use-auth'
import { eventsQueryKey, useEvents } from '@/hooks/use-events'
import { useWedding } from '@/hooks/use-wedding'
import { createEvent, deleteEvent, updateEvent } from '@/services/events'
import type { WeddingEvent } from '@/services/events'

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function EventsPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: events, isPending } = useEvents(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<WeddingEvent | undefined>(undefined)
  const [deletingEvent, setDeletingEvent] = React.useState<WeddingEvent | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<string>(todayKey())

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: eventsQueryKey(weddingId) })
  }

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createEvent>[2]) => createEvent(weddingId, user!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateEvent>[1]) => updateEvent(editingEvent!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
      setEditingEvent(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (event: WeddingEvent) => deleteEvent(event.id),
    onSuccess: () => {
      invalidate()
      setDeletingEvent(null)
    },
  })

  function openCreateForm() {
    setEditingEvent(undefined)
    setFormOpen(true)
  }

  function openEditForm(event: WeddingEvent) {
    setEditingEvent(event)
    setFormOpen(true)
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allEvents = events ?? []
  const hasNoEventsAtAll = allEvents.length === 0
  const today = todayKey()
  const upcomingEvents = allEvents.filter((e) => e.event_date >= today)
  const eventsOnSelectedDate = allEvents.filter((e) => e.event_date === selectedDate)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Events &amp; Timeline</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Add Event
        </Button>
      </div>

      {hasNoEventsAtAll ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Add every ceremony and function — engagement, haldi, sangeet, reception — to see them here."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Add Event
            </Button>
          }
        />
      ) : (
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="space-y-3">
              {allEvents.map((event) => (
                <EventRow key={event.id} event={event} isPast={event.event_date < today} onEdit={openEditForm} onDelete={setDeletingEvent} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="space-y-4">
              <EventCalendar events={allEvents} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              <div className="space-y-3">
                {eventsOnSelectedDate.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="No events on this day"
                    action={
                      <Button size="sm" onClick={openCreateForm}>
                        <Plus className="size-4" />
                        Add Event
                      </Button>
                    }
                  />
                ) : (
                  eventsOnSelectedDate.map((event) => (
                    <EventRow key={event.id} event={event} onEdit={openEditForm} onDelete={setDeletingEvent} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            {upcomingEvents.length === 0 ? (
              <EmptyState icon={CalendarDays} title="No upcoming events" description="Everything on your list is in the past." />
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventRow key={event.id} event={event} onEdit={openEditForm} onDelete={setDeletingEvent} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent}
            defaultDate={selectedDate}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input) => (editingEvent ? updateMutation.mutateAsync(input) : createMutation.mutateAsync(input))}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingEvent)}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        title="Delete this event?"
        description={`"${deletingEvent?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Event"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingEvent && deleteMutation.mutate(deletingEvent)}
      />
    </div>
  )
}
