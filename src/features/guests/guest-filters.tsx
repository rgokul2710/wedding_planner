import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RSVP_STATUSES } from '@/features/guests/constants'
import type { GuestFilterState } from '@/features/guests/use-guest-filters'
import type { GuestGroup } from '@/services/guest-groups'

interface GuestFiltersProps {
  filters: GuestFilterState
  groups: GuestGroup[]
  onChange: (patch: Partial<GuestFilterState>) => void
}

export function GuestFilters({ filters, groups, onChange }: GuestFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <Input
          placeholder="Search guests…"
          className="pl-9"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <Select value={filters.rsvpStatus} onValueChange={(value) => onChange({ rsvpStatus: value as GuestFilterState['rsvpStatus'] })}>
          <SelectTrigger className="w-36 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All RSVPs</SelectItem>
            {RSVP_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.groupId} onValueChange={(value) => onChange({ groupId: value })}>
          <SelectTrigger className="w-40 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Families/Groups</SelectItem>
            <SelectItem value="ungrouped">Ungrouped</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
