import { MapPin, MoreVertical, Pencil, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { WeddingEvent } from '@/services/events'

interface EventRowProps {
  event: WeddingEvent
  isPast?: boolean
  onEdit: (event: WeddingEvent) => void
  onDelete: (event: WeddingEvent) => void
}

export function EventRow({ event, isPast, onEdit, onDelete }: EventRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn('font-medium', isPast ? 'text-ink-400' : 'text-ink-800 dark:text-ink-100')}>{event.name}</p>
            <p className="text-xs text-ink-400">
              {formatDate(event.event_date)}
              {event.start_time && ` · ${formatTime(event.start_time)}${event.end_time ? ` – ${formatTime(event.end_time)}` : ''}`}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(event)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(event)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {event.description && <p className="mt-1.5 text-sm text-ink-400">{event.description}</p>}

        {(event.venue || event.responsible_person) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-400">
            {event.venue && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {event.venue}
              </span>
            )}
            {event.responsible_person && (
              <span className="flex items-center gap-1">
                <User className="size-3.5" /> {event.responsible_person}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
