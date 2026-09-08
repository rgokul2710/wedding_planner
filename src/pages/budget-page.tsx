import { Wallet } from 'lucide-react'
import { PlaceholderPage } from '@/components/placeholder-page'

export function BudgetPage() {
  return (
    <PlaceholderPage
      icon={Wallet}
      title="Budget"
      description="Track planned vs. actual spend by category, with charts and payment status at a glance."
    />
  )
}
