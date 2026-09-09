import { useQuery } from '@tanstack/react-query'
import { listMembers } from '@/services/family'

export function membersQueryKey(weddingId: string) {
  return ['members', weddingId] as const
}

export function useMembers(weddingId: string) {
  return useQuery({
    queryKey: membersQueryKey(weddingId),
    queryFn: () => listMembers(weddingId),
  })
}
