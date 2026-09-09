import { Users } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { EmptySummaryCard } from '@/components/dashboard/empty-summary-card'
import type { Guest } from '@/services/guests'

export function GuestsSummaryCard({ guests }: { guests: Guest[] }) {
  if (guests.length === 0) {
    return (
      <EmptySummaryCard
        title="Guests"
        icon={Users}
        description="No guests added yet — build your list to track RSVPs."
        actionLabel="Add a guest"
        actionTo="/guests"
      />
    )
  }

  const invited = guests.reduce((total, g) => total + g.total_guests, 0)
  const sum = (predicate: (g: Guest) => boolean) => guests.filter(predicate).reduce((total, g) => total + g.total_guests, 0)

  return (
    <DashboardCard title="Guests" icon={Users}>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-ink-400">Invited</dt>
          <dd className="font-medium text-ink-800 dark:text-ink-100">{invited}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Confirmed</dt>
          <dd className="font-medium text-success-500">{sum((g) => g.rsvp_status === 'confirmed')}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Pending</dt>
          <dd className="font-medium text-ink-800 dark:text-ink-100">{sum((g) => g.rsvp_status === 'pending')}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Declined</dt>
          <dd className="font-medium text-danger-500">{sum((g) => g.rsvp_status === 'declined')}</dd>
        </div>
      </dl>
    </DashboardCard>
  )
}
