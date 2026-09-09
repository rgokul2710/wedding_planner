import { ListChecks } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { EmptySummaryCard } from '@/components/dashboard/empty-summary-card'
import { isTaskOverdue } from '@/features/tasks/constants'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Task } from '@/services/tasks'

export function UpcomingTasksCard({ tasks }: { tasks: Task[] }) {
  const upcoming = tasks
    .filter((t) => t.due_date && t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <EmptySummaryCard
        title="Upcoming Tasks"
        icon={ListChecks}
        description="Nothing due soon. Tasks with a due date will show up here."
        actionLabel="Go to tasks"
        actionTo="/tasks"
      />
    )
  }

  return (
    <DashboardCard title="Upcoming Tasks" icon={ListChecks}>
      <ul className="space-y-2.5">
        {upcoming.map((task) => {
          const overdue = isTaskOverdue(task)
          return (
            <li key={task.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-ink-800 dark:text-ink-100">{task.name}</span>
              <span className={cn('shrink-0 text-xs font-medium', overdue ? 'text-danger-500' : 'text-ink-400')}>
                {formatDate(task.due_date!)}
              </span>
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
}
