import { LayoutDashboard } from 'lucide-react'
import { PlaceholderPage } from '@/components/placeholder-page'

export function DashboardPage() {
  return (
    <PlaceholderPage
      icon={LayoutDashboard}
      title="Dashboard"
      description="Your wedding countdown, budget snapshot, tasks, guests, and upcoming payments will live here once Supabase and wedding setup are wired up."
    />
  )
}
