import type { Task } from '@/services/tasks'
import type { TaskPriority, TaskStatus } from '@/types/database'

export const TASK_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Decoration',
  'Invitations',
  'Clothing',
  'Jewellery',
  'Makeup',
  'Transportation',
  'Accommodation',
  'Documents',
  'Honeymoon',
  'Ceremony',
  'Reception',
  'Other',
] as const

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export function taskStatusLabel(status: TaskStatus) {
  return TASK_STATUSES.find((s) => s.value === status)?.label ?? status
}

export function taskPriorityLabel(priority: TaskPriority) {
  return TASK_PRIORITIES.find((p) => p.value === priority)?.label ?? priority
}

export function taskPriorityBadgeVariant(priority: TaskPriority): 'neutral' | 'gold' | 'warning' | 'danger' {
  switch (priority) {
    case 'low':
      return 'neutral'
    case 'medium':
      return 'gold'
    case 'high':
      return 'warning'
    case 'urgent':
      return 'danger'
  }
}

export function taskStatusBadgeVariant(status: TaskStatus): 'neutral' | 'rose' | 'success' | 'danger' {
  switch (status) {
    case 'not_started':
      return 'neutral'
    case 'in_progress':
      return 'rose'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
  }
}

export function isTaskOverdue(task: Task) {
  if (!task.due_date) return false
  if (task.status === 'completed' || task.status === 'cancelled') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = task.due_date.split('-').map(Number)
  return new Date(year, month - 1, day).getTime() < today.getTime()
}
