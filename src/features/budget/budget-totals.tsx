import * as React from 'react'
import { formatCurrency } from '@/lib/format'
import type { BudgetItem } from '@/services/budget-items'

export function BudgetTotals({ items, currency }: { items: BudgetItem[]; currency: string }) {
  const totals = React.useMemo(() => {
    let planned = 0
    let actual = 0
    let paid = 0

    for (const item of items) {
      const effective = item.actual_amount ?? item.planned_amount
      planned += item.planned_amount
      actual += effective
      paid += item.amount_paid
    }

    return {
      planned,
      actual,
      paid,
      outstanding: actual - paid,
      overBudget: Math.max(0, actual - planned),
    }
  }, [items])

  const tiles = [
    { label: 'Total Planned', value: totals.planned },
    { label: 'Total Actual', value: totals.actual },
    { label: 'Total Paid', value: totals.paid },
    { label: 'Outstanding', value: totals.outstanding },
    { label: 'Over Budget', value: totals.overBudget, danger: totals.overBudget > 0 },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl border border-ink-100 bg-cream-25 px-3 py-2.5 dark:border-ink-800 dark:bg-ink-800/60">
          <p className={`text-lg font-semibold ${tile.danger ? 'text-danger-500' : 'text-ink-900 dark:text-ink-50'}`}>
            {formatCurrency(tile.value, currency)}
          </p>
          <p className="text-xs text-ink-400">{tile.label}</p>
        </div>
      ))}
    </div>
  )
}
