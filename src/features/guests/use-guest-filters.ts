import * as React from 'react'
import type { Guest } from '@/services/guests'
import type { RsvpStatus } from '@/types/database'

export interface GuestFilterState {
  search: string
  rsvpStatus: RsvpStatus | 'all'
  groupId: string | 'all' | 'ungrouped'
}

const DEFAULT_FILTERS: GuestFilterState = {
  search: '',
  rsvpStatus: 'all',
  groupId: 'all',
}

export function useGuestFilters(guests: Guest[]) {
  const [filters, setFilters] = React.useState<GuestFilterState>(DEFAULT_FILTERS)

  function onChange(patch: Partial<GuestFilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const filteredGuests = React.useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return guests.filter((guest) => {
      if (filters.rsvpStatus !== 'all' && guest.rsvp_status !== filters.rsvpStatus) return false
      if (filters.groupId === 'ungrouped' && guest.guest_group_id) return false
      if (filters.groupId !== 'all' && filters.groupId !== 'ungrouped' && guest.guest_group_id !== filters.groupId) return false
      if (search) {
        const haystack = `${guest.name} ${guest.phone ?? ''} ${guest.email ?? ''}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [guests, filters])

  return { filters, onChange, filteredGuests }
}
