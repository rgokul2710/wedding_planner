import { ListChecks } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { EmptySummaryCard } from '@/components/dashboard/empty-summary-card'
import { isTaskOverdue } from '@/features/tasks/constants'
import type { Task } from '@/services/tasks'

export function TasksSummaryCard({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <EmptySummaryCard
        title="Tasks"
        icon={ListChecks}
        description="No tasks yet — start planning by adding your first to-do."
        actionLabel="Add a task"
        actionTo="/tasks"
      />
    )
  }

  const completed = tasks.filter((t) => t.status === 'completed').length
  const overdue = tasks.filter(isTaskOverdue).length
  const pending = tasks.length - completed - tasks.filter((t) => t.status === 'cancelled').length

  return (
    <DashboardCard title="Tasks" icon={ListChecks}>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-ink-400">Completed</dt>
          <dd className="font-medium text-success-500">{completed}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Pending</dt>
          <dd className="font-medium text-ink-800 dark:text-ink-100">{pending}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Overdue</dt>
          <dd className={`font-medium ${overdue > 0 ? 'text-danger-500' : 'text-ink-800 dark:text-ink-100'}`}>{overdue}</dd>
        </div>
      </dl>
    </DashboardCard>
  )
}
