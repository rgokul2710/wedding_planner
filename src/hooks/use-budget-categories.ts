import { useQuery } from '@tanstack/react-query'
import { listBudgetCategories } from '@/services/budget-categories'

export function budgetCategoriesQueryKey(weddingId: string) {
  return ['budget-categories', weddingId] as const
}

export function useBudgetCategories(weddingId: string) {
  return useQuery({
    queryKey: budgetCategoriesQueryKey(weddingId),
    queryFn: () => listBudgetCategories(weddingId),
  })
}
