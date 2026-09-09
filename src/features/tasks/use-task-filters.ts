import * as React from 'react'
import type { Task } from '@/services/tasks'
import type { TaskPriority, TaskStatus } from '@/types/database'

export interface TaskFilterState {
  search: string
  status: TaskStatus | 'all'
  category: string
  priority: TaskPriority | 'all'
  sort: 'due_date' | 'priority' | 'created_at'
}

const DEFAULT_FILTERS: TaskFilterState = {
  search: '',
  status: 'all',
  category: 'all',
  priority: 'all',
  sort: 'due_date',
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = React.useState<TaskFilterState>(DEFAULT_FILTERS)

  function onChange(patch: Partial<TaskFilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const filteredTasks = React.useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    const filtered = tasks.filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) return false
      if (filters.category !== 'all' && task.category !== filters.category) return false
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      if (search) {
        const haystack = `${task.name} ${task.description ?? ''}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })

    return filtered.sort((a, b) => {
      if (filters.sort === 'priority') return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      if (filters.sort === 'created_at') return b.created_at.localeCompare(a.created_at)
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return a.due_date.localeCompare(b.due_date)
    })
  }, [tasks, filters])

  return { filters, onChange, filteredTasks }
}
