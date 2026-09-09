import { useQuery } from '@tanstack/react-query'
import { listTasks } from '@/services/tasks'

export function tasksQueryKey(weddingId: string) {
  return ['tasks', weddingId] as const
}

export function useTasks(weddingId: string) {
  return useQuery({
    queryKey: tasksQueryKey(weddingId),
    queryFn: () => listTasks(weddingId),
  })
}
