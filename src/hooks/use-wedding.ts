import { useQuery } from '@tanstack/react-query'
import { getMyWedding } from '@/services/weddings'

export const WEDDING_QUERY_KEY = ['wedding'] as const

export function useWedding() {
  return useQuery({
    queryKey: WEDDING_QUERY_KEY,
    queryFn: getMyWedding,
  })
}
