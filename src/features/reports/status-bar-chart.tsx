import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface StatusBarDatum {
  name: string
  value: number
  color: string
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: { name: string } }[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  return (
    <div className="rounded-lg border border-ink-100 bg-cream-25 px-3 py-2 text-sm shadow-soft dark:border-ink-700 dark:bg-ink-800">
      <p className="font-medium text-ink-800 dark:text-ink-100">{point.payload.name}</p>
      <p className="text-ink-400">{point.value}</p>
    </div>
  )
}

export function StatusBarChart({ data }: { data: StatusBarDatum[] }) {
  const gridColor = '#e7e2df'
  const textColor = '#8a7d76'

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={gridColor} strokeWidth={1} />
        <XAxis type="number" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={90} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: gridColor, opacity: 0.4 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
