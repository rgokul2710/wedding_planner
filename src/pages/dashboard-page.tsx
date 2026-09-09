import { CreditCard, Loader2, Users } from 'lucide-react'
import { BudgetSummaryCard } from '@/components/dashboard/budget-summary-card'
import { CountdownHero } from '@/components/dashboard/countdown-hero'
import { EmptySummaryCard } from '@/components/dashboard/empty-summary-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { TasksSummaryCard } from '@/components/dashboard/tasks-summary-card'
import { UpcomingTasksCard } from '@/components/dashboard/upcoming-tasks-card'
import { WeddingTimelineCard } from '@/components/dashboard/wedding-timeline-card'
import { useTasks } from '@/hooks/use-tasks'
import { useWedding } from '@/hooks/use-wedding'
import { daysUntil } from '@/lib/format'

export function DashboardPage() {
  const { data: wedding, isPending: weddingPending } = useWedding()
  const { data: tasks, isPending: tasksPending } = useTasks(wedding?.id ?? '')

  if (weddingPending || tasksPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  if (!wedding) return null

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <CountdownHero
        brideName={wedding.bride_name}
        groomName={wedding.groom_name}
        weddingDate={wedding.wedding_date}
        daysUntil={daysUntil(wedding.wedding_date)}
      />

      <QuickActions />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BudgetSummaryCard estimatedBudget={wedding.estimated_budget} currency={wedding.currency} />
        <TasksSummaryCard tasks={tasks ?? []} />
        <EmptySummaryCard
          title="Guests"
          icon={Users}
          description="No guests added yet — build your list to track RSVPs."
          actionLabel="Add a guest"
          actionTo="/guests"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WeddingTimelineCard
          engagementDate={wedding.engagement_date}
          weddingDate={wedding.wedding_date}
          receptionDate={wedding.reception_date}
        />
        <UpcomingTasksCard tasks={tasks ?? []} />
      </div>

      <EmptySummaryCard
        title="Upcoming Payments"
        icon={CreditCard}
        description="No payments due yet — add a vendor or budget item to start tracking them."
        actionLabel="Go to payments"
        actionTo="/payments"
      />
    </div>
  )
}
