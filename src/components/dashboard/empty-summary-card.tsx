import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardCard } from '@/components/dashboard/dashboard-card'

interface EmptySummaryCardProps {
  title: string
  icon: LucideIcon
  description: string
  actionLabel: string
  actionTo: string
}

export function EmptySummaryCard({ title, icon, description, actionLabel, actionTo }: EmptySummaryCardProps) {
  return (
    <DashboardCard title={title} icon={icon}>
      <p className="text-sm text-ink-400">{description}</p>
      <Link to={actionTo} className="mt-3 inline-block text-sm font-medium text-rose-500 hover:text-rose-600">
        {actionLabel} →
      </Link>
    </DashboardCard>
  )
}
