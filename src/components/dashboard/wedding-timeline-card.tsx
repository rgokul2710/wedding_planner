import { CalendarDays } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { daysUntil, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Milestone {
  label: string
  date: string
}

interface WeddingTimelineCardProps {
  engagementDate: string | null
  weddingDate: string
  receptionDate: string | null
}

export function WeddingTimelineCard({ engagementDate, weddingDate, receptionDate }: WeddingTimelineCardProps) {
  const milestones: Milestone[] = [
    engagementDate && { label: 'Engagement', date: engagementDate },
    { label: 'Wedding', date: weddingDate },
    receptionDate && { label: 'Reception', date: receptionDate },
  ].filter((m): m is Milestone => Boolean(m))

  milestones.sort((a, b) => a.date.localeCompare(b.date))

  return (
    <DashboardCard title="Wedding Timeline" icon={CalendarDays}>
      <ol className="space-y-4">
        {milestones.map((milestone) => {
          const remaining = daysUntil(milestone.date)
          const relative = remaining > 0 ? `in ${remaining} days` : remaining === 0 ? 'today' : `${Math.abs(remaining)} days ago`
          const isPast = remaining < 0

          return (
            <li key={milestone.label} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-2.5 shrink-0 rounded-full',
                  isPast ? 'bg-ink-200 dark:bg-ink-600' : 'bg-rose-500',
                )}
              />
              <div className="flex flex-1 items-baseline justify-between gap-2">
                <span className={cn('text-sm font-medium', isPast ? 'text-ink-400' : 'text-ink-800 dark:text-ink-100')}>
                  {milestone.label}
                </span>
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
