import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { WeddingDetailsForm } from '@/features/wedding/wedding-details-form'
import { WEDDING_QUERY_KEY, useWedding } from '@/hooks/use-wedding'
import { updateWedding } from '@/services/weddings'

export function SettingsPage() {
  const { data: wedding, isPending } = useWedding()
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: (input: Parameters<typeof updateWedding>[1]) => updateWedding(wedding!.id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(WEDDING_QUERY_KEY, updated)
      toast.success('Wedding details updated.')
    },
  })

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  if (!wedding) return null

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Wedding Settings</h1>
      <Card>
        <WeddingDetailsForm
          submitLabel="Save Changes"
          defaultValues={{
            brideName: wedding.bride_name,
            groomName: wedding.groom_name,
            weddingDate: wedding.wedding_date,
            engagementDate: wedding.engagement_date ?? undefined,
            receptionDate: wedding.reception_date ?? undefined,
            weddingVenue: wedding.wedding_venue ?? undefined,
            receptionVenue: wedding.reception_venue ?? undefined,
            city: wedding.city ?? undefined,
            expectedGuestCount: wedding.expected_guest_count ?? undefined,
            estimatedBudget: wedding.estimated_budget ?? undefined,
            currency: wedding.currency,
          }}
          onSubmit={(input) => mutateAsync(input)}
        />
      </Card>
    </div>
  )
}
