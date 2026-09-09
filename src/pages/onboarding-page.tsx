import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { WeddingDetailsForm } from '@/features/wedding/wedding-details-form'
import { WEDDING_QUERY_KEY } from '@/hooks/use-wedding'
import { createWedding } from '@/services/weddings'

export function OnboardingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: createWedding,
    onSuccess: (wedding) => {
      queryClient.setQueryData(WEDDING_QUERY_KEY, wedding)
      navigate('/', { replace: true })
    },
  })

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-cream-25">
          <Heart className="size-6" fill="currentColor" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Let's set up your wedding</h1>
        <p className="max-w-sm text-sm text-ink-400">
          A few details to get your dashboard, budget, and guest list ready. You can change any of this later.
        </p>
      </div>

      <Card>
        <WeddingDetailsForm submitLabel="Create Our Wedding" onSubmit={(input) => mutateAsync(input)} />
      </Card>
    </div>
  )
}
