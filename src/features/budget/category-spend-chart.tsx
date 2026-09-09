import * as React from 'react'
import { CurrencyBarChart } from '@/components/charts/currency-bar-chart'
import type { BudgetCategory } from '@/services/budget-categories'
import type { BudgetItem } from '@/services/budget-items'

interface CategorySpendChartProps {
  items: BudgetItem[]
  categories: BudgetCategory[]
  currency: string
}

export function CategorySpendChart({ items, categories, currency }: CategorySpendChartProps) {
  const data = React.useMemo(() => {
    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]))
    const totals = new Map<string, number>()
    for (const item of items) {
      const name = item.category_id ? categoryNameById.get(item.category_id) ?? 'Uncategorized' : 'Uncategorized'
      const effective = item.actual_amount ?? item.planned_amount
      totals.set(name, (totals.get(name) ?? 0) + effective)
    }
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [items, categories])

  return <CurrencyBarChart data={data} currency={currency} emptyMessage="Add planned or actual amounts to see spending by category." />
}
