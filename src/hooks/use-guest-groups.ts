import { useQuery } from '@tanstack/react-query'
import { listGuestGroups } from '@/services/guest-groups'

export function guestGroupsQueryKey(weddingId: string) {
  return ['guest-groups', weddingId] as const
}

export function useGuestGroups(weddingId: string) {
  return useQuery({
    queryKey: guestGroupsQueryKey(weddingId),
    queryFn: () => listGuestGroups(weddingId),
  })
}
