import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@/hooks/use-theme'
import { formatCurrency } from '@/lib/format'
import type { BudgetCategory } from '@/services/budget-categories'
import type { BudgetItem } from '@/services/budget-items'

interface CategorySpendChartProps {
  items: BudgetItem[]
  categories: BudgetCategory[]
  currency: string
}

function ChartTooltip({ active, payload, currency }: { active?: boolean; payload?: { value: number; payload: { name: string } }[]; currency: string }) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  return (
    <div className="rounded-lg border border-ink-100 bg-cream-25 px-3 py-2 text-sm shadow-soft dark:border-ink-700 dark:bg-ink-800">
      <p className="font-medium text-ink-800 dark:text-ink-100">{point.payload.name}</p>
      <p className="text-ink-400">{formatCurrency(point.value, currency)}</p>
    </div>
  )
}

export function CategorySpendChart({ items, categories, currency }: CategorySpendChartProps) {
  const { theme } = useTheme()
  const barColor = theme === 'dark' ? '#c96652' : '#b0472f'
  const gridColor = theme === 'dark' ? '#423a35' : '#e7e2df'
  const textColor = '#8a7d76'

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

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-400">Add planned or actual amounts to see spending by category.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
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
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={barColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
