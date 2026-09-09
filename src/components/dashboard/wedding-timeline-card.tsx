import { CalendarDays } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { EmptySummaryCard } from '@/components/dashboard/empty-summary-card'
import { daysUntil, formatDate } from '@/lib/format'
import type { WeddingEvent } from '@/services/events'

interface Milestone {
  label: string
  date: string
}

interface WeddingTimelineCardProps {
  engagementDate: string | null
  weddingDate: string
  receptionDate: string | null
  events: WeddingEvent[]
}

export function WeddingTimelineCard({ engagementDate, weddingDate, receptionDate, events }: WeddingTimelineCardProps) {
  const milestones: Milestone[] = [
    engagementDate && { label: 'Engagement', date: engagementDate },
    { label: 'Wedding', date: weddingDate },
    receptionDate && { label: 'Reception', date: receptionDate },
    ...events.map((event) => ({ label: event.name, date: event.event_date })),
  ].filter((m): m is Milestone => Boolean(m))

  const upcoming = milestones.filter((m) => daysUntil(m.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <EmptySummaryCard
        title="Wedding Timeline"
        icon={CalendarDays}
        description="No upcoming dates — every milestone on your list is in the past."
        actionLabel="Go to events"
        actionTo="/events"
      />
    )
  }

  return (
    <DashboardCard title="Wedding Timeline" icon={CalendarDays}>
      <ol className="space-y-4">
        {upcoming.map((milestone, index) => {
          const remaining = daysUntil(milestone.date)
          const relative = remaining === 0 ? 'today' : `in ${remaining} days`

          return (
            <li key={`${milestone.label}-${milestone.date}-${index}`} className="flex items-center gap-3">
              <span className="flex size-2.5 shrink-0 rounded-full bg-rose-500" />
              <div className="flex flex-1 items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{milestone.label}</span>
                <span className="text-xs text-ink-400">
                  {formatDate(milestone.date)} · {relative}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </DashboardCard>
  )
}
