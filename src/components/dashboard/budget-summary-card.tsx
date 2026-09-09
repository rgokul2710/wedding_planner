import { Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { formatCurrency } from '@/lib/format'
import type { BudgetItem } from '@/services/budget-items'

interface BudgetSummaryCardProps {
  estimatedBudget: number | null
  currency: string
  budgetItems: BudgetItem[]
}

export function BudgetSummaryCard({ estimatedBudget, currency, budgetItems }: BudgetSummaryCardProps) {
  if (!estimatedBudget) {
    return (
      <DashboardCard title="Budget" icon={Wallet}>
        <p className="text-sm text-ink-400">
          Add your estimated budget in{' '}
          <Link to="/settings" className="font-medium text-rose-500 hover:text-rose-600">
            Settings
          </Link>{' '}
          to track spending here.
        </p>
      </DashboardCard>
    )
  }

  const spent = budgetItems.reduce((total, item) => total + item.amount_paid, 0)
  const remaining = estimatedBudget - spent
  const spentPercent = Math.min(100, Math.round((spent / estimatedBudget) * 100))

  return (
    <DashboardCard title="Budget" icon={Wallet}>
      <div className="space-y-3">
        <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
          <div className="h-full rounded-full bg-rose-500" style={{ width: `${spentPercent}%` }} />
        </div>
        <dl className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <dt className="text-ink-400">Planned</dt>
            <dd className="font-medium text-ink-800 dark:text-ink-100">{formatCurrency(estimatedBudget, currency)}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Spent</dt>
            <dd className="font-medium text-ink-800 dark:text-ink-100">{formatCurrency(spent, currency)}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Remaining</dt>
            <dd className={`font-medium ${remaining < 0 ? 'text-danger-500' : 'text-ink-800 dark:text-ink-100'}`}>
              {formatCurrency(remaining, currency)}
            </dd>
          </div>
        </dl>
      </div>
    </DashboardCard>
  )
}
