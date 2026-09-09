import { useQuery } from '@tanstack/react-query'
import { listPayments } from '@/services/payments'

export function paymentsQueryKey(weddingId: string) {
  return ['payments', weddingId] as const
}

export function usePayments(weddingId: string) {
  return useQuery({
    queryKey: paymentsQueryKey(weddingId),
    queryFn: () => listPayments(weddingId),
  })
}
