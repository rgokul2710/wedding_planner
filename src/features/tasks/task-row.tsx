import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isTaskOverdue, taskPriorityBadgeVariant, taskPriorityLabel, taskStatusBadgeVariant, taskStatusLabel } from '@/features/tasks/constants'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Task } from '@/services/tasks'

interface TaskRowProps {
  task: Task
  currency: string
  onToggleComplete: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskRow({ task, currency, onToggleComplete, onEdit, onDelete }: TaskRowProps) {
  const overdue = isTaskOverdue(task)
  const isCompleted = task.status === 'completed'

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <Checkbox checked={isCompleted} onCheckedChange={() => onToggleComplete(task)} className="mt-0.5" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('font-medium text-ink-800 dark:text-ink-100', isCompleted && 'text-ink-400 line-through')}>
            {task.name}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(task)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(task)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && <p className="mt-1 text-sm text-ink-400">{task.description}</p>}

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{task.category}</Badge>
          <Badge variant={taskPriorityBadgeVariant(task.priority)}>{taskPriorityLabel(task.priority)}</Badge>
          <Badge variant={taskStatusBadgeVariant(task.status)}>{taskStatusLabel(task.status)}</Badge>
          {task.due_date && (
            <span className={cn('text-xs font-medium', overdue ? 'text-danger-500' : 'text-ink-400')}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.due_date)}
            </span>
          )}
          {task.assigned_to && <span className="text-xs text-ink-400">· {task.assigned_to}</span>}
          {(task.estimated_cost || task.actual_cost) && (
            <span className="text-xs text-ink-400">
              · {formatCurrency(task.actual_cost ?? task.estimated_cost ?? 0, currency)}
              {task.actual_cost == null && ' (est.)'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
