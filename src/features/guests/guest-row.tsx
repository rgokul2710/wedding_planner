import { Car, Home, Mail, MoreVertical, Pencil, Phone, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { invitationBadgeVariant, invitationStatusLabel, rsvpBadgeVariant, rsvpStatusLabel } from '@/features/guests/constants'
import type { Guest } from '@/services/guests'

interface GuestRowProps {
  guest: Guest
  groupName?: string
  selected: boolean
  onToggleSelected: (guest: Guest) => void
  onEdit: (guest: Guest) => void
  onDelete: (guest: Guest) => void
}

export function GuestRow({ guest, groupName, selected, onToggleSelected, onEdit, onDelete }: GuestRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <Checkbox checked={selected} onCheckedChange={() => onToggleSelected(guest)} className="mt-0.5" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-ink-800 dark:text-ink-100">{guest.name}</p>
            {groupName && <p className="text-xs text-ink-400">{groupName}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(guest)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(guest)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant={rsvpBadgeVariant(guest.rsvp_status)}>{rsvpStatusLabel(guest.rsvp_status)}</Badge>
          <Badge variant={invitationBadgeVariant(guest.invitation_status)}>{invitationStatusLabel(guest.invitation_status)}</Badge>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Users className="size-3.5" />
            {guest.total_guests} {guest.child_count > 0 && `(${guest.child_count} children)`}
          </span>
          {guest.accommodation_required && (
            <span className="flex items-center gap-1 text-xs text-ink-400">
              <Home className="size-3.5" /> Accommodation
            </span>
          )}
          {guest.transportation_required && (
            <span className="flex items-center gap-1 text-xs text-ink-400">
              <Car className="size-3.5" /> Transport
            </span>
          )}
        </div>

        {(guest.phone || guest.email) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-400">
            {guest.phone && (
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" /> {guest.phone}
              </span>
            )}
            {guest.email && (
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" /> {guest.email}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
