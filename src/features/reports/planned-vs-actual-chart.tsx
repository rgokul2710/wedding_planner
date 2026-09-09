import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@/hooks/use-theme'
import { formatCurrency } from '@/lib/format'
import type { BudgetCategory } from '@/services/budget-categories'
import type { BudgetItem } from '@/services/budget-items'

function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean
  payload?: { value: number; name: string; payload: { name: string } }[]
  currency: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-ink-100 bg-cream-25 px-3 py-2 text-sm shadow-soft dark:border-ink-700 dark:bg-ink-800">
      <p className="mb-1 font-medium text-ink-800 dark:text-ink-100">{payload[0].payload.name}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-ink-400">
          {entry.name}: {formatCurrency(entry.value, currency)}
        </p>
      ))}
    </div>
  )
}

export function PlannedVsActualChart({
  items,
  categories,
  currency,
}: {
  items: BudgetItem[]
  categories: BudgetCategory[]
  currency: string
}) {
  const { theme } = useTheme()
  const plannedColor = theme === 'dark' ? '#8a7d76' : '#cdc3bd'
  const actualColor = theme === 'dark' ? '#c96652' : '#b0472f'
  const gridColor = theme === 'dark' ? '#423a35' : '#e7e2df'
  const textColor = '#8a7d76'

  const data = React.useMemo(() => {
    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]))
    const totals = new Map<string, { planned: number; actual: number }>()
    for (const item of items) {
      const name = item.category_id ? categoryNameById.get(item.category_id) ?? 'Uncategorized' : 'Uncategorized'
      const entry = totals.get(name) ?? { planned: 0, actual: 0 }
      entry.planned += item.planned_amount
      entry.actual += item.actual_amount ?? item.planned_amount
      totals.set(name, entry)
    }
    return Array.from(totals.entries())
      .map(([name, values]) => ({ name, ...values }))
      .filter((d) => d.planned > 0 || d.actual > 0)
      .sort((a, b) => b.actual - a.actual)
  }, [items, categories])

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-400">Add budget items to compare planned vs. actual spend.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }} barGap={2}>
        <CartesianGrid horizontal={false} stroke={gridColor} strokeWidth={1} />
        <XAxis
          type="number"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => formatCurrency(value, currency)}
        />
        <YAxis type="category" dataKey="name" width={110} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: gridColor, opacity: 0.4 }} />
        <Legend
          verticalAlign="top"
          height={28}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: textColor }}
        />
        <Bar dataKey="planned" name="Planned" fill={plannedColor} radius={[0, 4, 4, 0]} maxBarSize={16} />
        <Bar dataKey="actual" name="Actual" fill={actualColor} radius={[0, 4, 4, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  )
}
