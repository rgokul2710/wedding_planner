import { CreditCard } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { EmptySummaryCard } from '@/components/dashboard/empty-summary-card'
import { isPaymentOverdue } from '@/features/payments/constants'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Payment } from '@/services/payments'

export function UpcomingPaymentsCard({ payments, currency }: { payments: Payment[]; currency: string }) {
  const upcoming = payments
    .filter((p) => p.due_date && p.payment_status !== 'fully_paid')
    .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <EmptySummaryCard
        title="Upcoming Payments"
        icon={CreditCard}
        description="No payments due yet — add a vendor payment to start tracking them."
        actionLabel="Go to payments"
        actionTo="/payments"
      />
    )
  }

  return (
    <DashboardCard title="Upcoming Payments" icon={CreditCard}>
      <ul className="space-y-2.5">
        {upcoming.map((payment) => {
          const overdue = isPaymentOverdue(payment.due_date, payment.payment_status)
          return (
            <li key={payment.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-ink-800 dark:text-ink-100">{payment.description}</span>
              <span className={cn('shrink-0 text-xs font-medium', overdue ? 'text-danger-500' : 'text-ink-400')}>
                {formatCurrency(payment.amount, currency)} · {formatDate(payment.due_date!)}
              </span>
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
}
