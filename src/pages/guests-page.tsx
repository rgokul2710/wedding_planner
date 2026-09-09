import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Users } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { GuestBulkActions } from '@/features/guests/guest-bulk-actions'
import { GuestFilters } from '@/features/guests/guest-filters'
import { GuestForm } from '@/features/guests/guest-form'
import { GuestRow } from '@/features/guests/guest-row'
import { GuestStats } from '@/features/guests/guest-stats'
import { useGuestFilters } from '@/features/guests/use-guest-filters'
import { useAuth } from '@/hooks/use-auth'
import { guestGroupsQueryKey, useGuestGroups } from '@/hooks/use-guest-groups'
import { guestsQueryKey, useGuests } from '@/hooks/use-guests'
import { useWedding } from '@/hooks/use-wedding'
import { createGuest, deleteGuest, deleteGuests, setGuestsRsvpStatus, updateGuest } from '@/services/guests'
import type { Guest } from '@/services/guests'
import type { RsvpStatus } from '@/types/database'

export function GuestsPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: guests, isPending: guestsPending } = useGuests(weddingId)
  const { data: groups, isPending: groupsPending } = useGuestGroups(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingGuest, setEditingGuest] = React.useState<Guest | undefined>(undefined)
  const [deletingGuest, setDeletingGuest] = React.useState<Guest | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const { filters, onChange, filteredGuests } = useGuestFilters(guests ?? [])

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: guestsQueryKey(weddingId) })
    queryClient.invalidateQueries({ queryKey: guestGroupsQueryKey(weddingId) })
  }

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createGuest>[2]) => createGuest(weddingId, user!.id, input),
    onSuccess: () => {
      invalidateAll()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateGuest>[2]) => updateGuest(weddingId, editingGuest!.id, input),
    onSuccess: () => {
      invalidateAll()
      setFormOpen(false)
      setEditingGuest(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (guest: Guest) => deleteGuest(guest.id),
    onSuccess: () => {
      invalidateAll()
      setDeletingGuest(null)
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteGuests(ids),
    onSuccess: () => {
      invalidateAll()
      setSelectedIds(new Set())
      setBulkDeleteOpen(false)
    },
  })

  const bulkRsvpMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: RsvpStatus }) => setGuestsRsvpStatus(ids, status),
    onSuccess: () => {
      invalidateAll()
      setSelectedIds(new Set())
    },
  })

  function openCreateForm() {
    setEditingGuest(undefined)
    setFormOpen(true)
  }

  function openEditForm(guest: Guest) {
    setEditingGuest(guest)
    setFormOpen(true)
  }

  function toggleSelected(guest: Guest) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(guest.id)) next.delete(guest.id)
      else next.add(guest.id)
      return next
    })
  }

  if (guestsPending || groupsPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allGuests = guests ?? []
  const allGroups = groups ?? []
  const groupNameById = new Map(allGroups.map((g) => [g.id, g.name]))
  const hasNoGuestsAtAll = allGuests.length === 0
  const editingGroupName = editingGuest?.guest_group_id ? groupNameById.get(editingGuest.guest_group_id) : undefined

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Guests</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Add Guest
        </Button>
      </div>

      {hasNoGuestsAtAll ? (
        <EmptyState
          icon={Users}
          title="No guests yet"
          description="Start building your guest list to track RSVPs, food preferences, and travel needs."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Add Guest
            </Button>
          }
        />
      ) : (
        <>
          <GuestStats guests={allGuests} />
          <GuestFilters filters={filters} groups={allGroups} onChange={onChange} />

          {selectedIds.size > 0 && (
            <GuestBulkActions
              count={selectedIds.size}
              isLoading={bulkRsvpMutation.isPending || bulkDeleteMutation.isPending}
              onSetRsvp={(status) => bulkRsvpMutation.mutate({ ids: Array.from(selectedIds), status })}
              onDelete={() => setBulkDeleteOpen(true)}
              onClear={() => setSelectedIds(new Set())}
            />
          )}

          {filteredGuests.length === 0 ? (
            <EmptyState icon={Users} title="No guests match your filters" description="Try adjusting the search or filters above." />
          ) : (
            <div className="space-y-3">
              {filteredGuests.map((guest) => (
                <GuestRow
                  key={guest.id}
                  guest={guest}
                  groupName={guest.guest_group_id ? groupNameById.get(guest.guest_group_id) : undefined}
                  selected={selectedIds.has(guest.id)}
                  onToggleSelected={toggleSelected}
                  onEdit={openEditForm}
                  onDelete={setDeletingGuest}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
          </DialogHeader>
          <GuestForm
            guest={editingGuest}
            groups={allGroups}
            currentGroupName={editingGroupName}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input) => (editingGuest ? updateMutation.mutateAsync(input) : createMutation.mutateAsync(input))}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingGuest)}
        onOpenChange={(open) => !open && setDeletingGuest(null)}
        title="Delete this guest?"
        description={`"${deletingGuest?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Guest"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingGuest && deleteMutation.mutate(deletingGuest)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.size} guests?`}
        description="These guests will be permanently removed. This can't be undone."
        confirmLabel="Delete Selected"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
      />
    </div>
  )
}
