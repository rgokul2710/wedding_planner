import { useQuery } from '@tanstack/react-query'
import { listGuests } from '@/services/guests'

export function guestsQueryKey(weddingId: string) {
  return ['guests', weddingId] as const
}

export function useGuests(weddingId: string) {
  return useQuery({
    queryKey: guestsQueryKey(weddingId),
    queryFn: () => listGuests(weddingId),
  })
}
