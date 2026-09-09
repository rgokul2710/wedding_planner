import { useQuery } from '@tanstack/react-query'
import { listEvents } from '@/services/events'

export function eventsQueryKey(weddingId: string) {
  return ['events', weddingId] as const
}

export function useEvents(weddingId: string) {
  return useQuery({
    queryKey: eventsQueryKey(weddingId),
    queryFn: () => listEvents(weddingId),
  })
}
