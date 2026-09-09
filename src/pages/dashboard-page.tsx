import { Loader2 } from 'lucide-react'
import { BudgetSummaryCard } from '@/components/dashboard/budget-summary-card'
import { CountdownHero } from '@/components/dashboard/countdown-hero'
import { GuestsSummaryCard } from '@/components/dashboard/guests-summary-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { TasksSummaryCard } from '@/components/dashboard/tasks-summary-card'
import { UpcomingPaymentsCard } from '@/components/dashboard/upcoming-payments-card'
import { UpcomingTasksCard } from '@/components/dashboard/upcoming-tasks-card'
import { WeddingTimelineCard } from '@/components/dashboard/wedding-timeline-card'
import { useBudgetItems } from '@/hooks/use-budget-items'
import { useEvents } from '@/hooks/use-events'
import { useGuests } from '@/hooks/use-guests'
import { usePayments } from '@/hooks/use-payments'
import { useTasks } from '@/hooks/use-tasks'
import { useWedding } from '@/hooks/use-wedding'
import { daysUntil } from '@/lib/format'

export function DashboardPage() {
  const { data: wedding, isPending: weddingPending } = useWedding()
  const { data: tasks, isPending: tasksPending } = useTasks(wedding?.id ?? '')
  const { data: guests, isPending: guestsPending } = useGuests(wedding?.id ?? '')
  const { data: budgetItems, isPending: budgetPending } = useBudgetItems(wedding?.id ?? '')
  const { data: payments, isPending: paymentsPending } = usePayments(wedding?.id ?? '')
  const { data: events, isPending: eventsPending } = useEvents(wedding?.id ?? '')

  if (weddingPending || tasksPending || guestsPending || budgetPending || paymentsPending || eventsPending) {
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
        <BudgetSummaryCard estimatedBudget={wedding.estimated_budget} currency={wedding.currency} budgetItems={budgetItems ?? []} />
        <TasksSummaryCard tasks={tasks ?? []} />
        <GuestsSummaryCard guests={guests ?? []} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WeddingTimelineCard
          engagementDate={wedding.engagement_date}
          weddingDate={wedding.wedding_date}
          receptionDate={wedding.reception_date}
          events={events ?? []}
        />
        <UpcomingTasksCard tasks={tasks ?? []} />
      </div>

      <UpcomingPaymentsCard payments={payments ?? []} currency={wedding.currency} />
    </div>
  )
}
