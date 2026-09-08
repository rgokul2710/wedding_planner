import { CreditCard } from 'lucide-react'
import { PlaceholderPage } from '@/components/placeholder-page'

export function PaymentsPage() {
  return (
    <PlaceholderPage
      icon={CreditCard}
      title="Payments"
      description="Track every payment made to vendors, with upcoming due dates and overdue alerts."
    />
  )
}
