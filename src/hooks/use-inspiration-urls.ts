import { useQuery } from '@tanstack/react-query'
import { getSignedUrls } from '@/lib/storage'

export function useInspirationUrls(paths: string[]) {
  return useQuery({
    queryKey: ['inspiration-urls', [...paths].sort()],
    queryFn: () => getSignedUrls('inspiration', paths),
    enabled: paths.length > 0,
    staleTime: 50 * 60 * 1000, // signed URLs are valid for 60 minutes
  })
}
