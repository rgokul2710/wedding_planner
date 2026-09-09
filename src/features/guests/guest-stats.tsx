import * as React from 'react'
import type { Guest } from '@/services/guests'

function sumWhere(guests: Guest[], predicate: (g: Guest) => boolean) {
  return guests.filter(predicate).reduce((total, g) => total + g.total_guests, 0)
}

export function GuestStats({ guests }: { guests: Guest[] }) {
  const stats = React.useMemo(() => {
    const invited = guests.reduce((total, g) => total + g.total_guests, 0)
    const children = guests.reduce((total, g) => total + g.child_count, 0)
    return [
      { label: 'Invited', value: invited },
      { label: 'Confirmed', value: sumWhere(guests, (g) => g.rsvp_status === 'confirmed') },
      { label: 'Pending', value: sumWhere(guests, (g) => g.rsvp_status === 'pending') },
      { label: 'Declined', value: sumWhere(guests, (g) => g.rsvp_status === 'declined') },
      { label: 'Adults', value: invited - children },
      { label: 'Children', value: children },
      { label: 'Need Accommodation', value: sumWhere(guests, (g) => g.accommodation_required) },
      { label: 'Need Transportation', value: sumWhere(guests, (g) => g.transportation_required) },
    ]
  }, [guests])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-ink-100 bg-cream-25 px-3 py-2.5 dark:border-ink-800 dark:bg-ink-800/60">
          <p className="text-lg font-semibold text-ink-900 dark:text-ink-50">{stat.value}</p>
          <p className="text-xs text-ink-400">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
