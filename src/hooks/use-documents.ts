import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '@/services/documents'

export function documentsQueryKey(weddingId: string) {
  return ['documents', weddingId] as const
}

export function useDocuments(weddingId: string) {
  return useQuery({
    queryKey: documentsQueryKey(weddingId),
    queryFn: () => listDocuments(weddingId),
  })
}
