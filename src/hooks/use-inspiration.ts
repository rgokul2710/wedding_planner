import { useQuery } from '@tanstack/react-query'
import { listInspirationImages } from '@/services/inspiration'

export function inspirationQueryKey(weddingId: string) {
  return ['inspiration', weddingId] as const
}

export function useInspirationImages(weddingId: string) {
  return useQuery({
    queryKey: inspirationQueryKey(weddingId),
    queryFn: () => listInspirationImages(weddingId),
  })
}
