import { useQuery } from '@tanstack/react-query'
import { listBudgetItems } from '@/services/budget-items'

export function budgetItemsQueryKey(weddingId: string) {
  return ['budget-items', weddingId] as const
}

export function useBudgetItems(weddingId: string) {
  return useQuery({
    queryKey: budgetItemsQueryKey(weddingId),
    queryFn: () => listBudgetItems(weddingId),
  })
}
