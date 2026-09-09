import { useQuery } from '@tanstack/react-query'
import { listVendors } from '@/services/vendors'

export function vendorsQueryKey(weddingId: string) {
  return ['vendors', weddingId] as const
}

export function useVendors(weddingId: string) {
  return useQuery({
    queryKey: vendorsQueryKey(weddingId),
    queryFn: () => listVendors(weddingId),
  })
}
