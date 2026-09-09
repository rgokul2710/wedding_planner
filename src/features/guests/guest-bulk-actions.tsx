import { Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RsvpStatus } from '@/types/database'

interface GuestBulkActionsProps {
  count: number
  onSetRsvp: (status: RsvpStatus) => void
  onDelete: () => void
  onClear: () => void
  isLoading?: boolean
}

export function GuestBulkActions({ count, onSetRsvp, onDelete, onClear, isLoading }: GuestBulkActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm dark:border-rose-500/30 dark:bg-rose-500/10">
      <span className="font-medium text-rose-600 dark:text-rose-200">{count} selected</span>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" disabled={isLoading} onClick={() => onSetRsvp('confirmed')}>
          Mark Confirmed
        </Button>
        <Button size="sm" variant="outline" disabled={isLoading} onClick={() => onSetRsvp('declined')}>
          Mark Declined
        </Button>
        <Button size="sm" variant="destructive" isLoading={isLoading} onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
