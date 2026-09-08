import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface PlaceholderPageProps {
  icon: LucideIcon
  title: string
  description: string
}

export function PlaceholderPage({ icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">{title}</h1>
      <EmptyState icon={icon} title="Coming up next" description={description} className="py-16" />
    </div>
  )
}
