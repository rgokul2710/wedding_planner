import type { LucideIcon } from 'lucide-react'
import type * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardCardProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}

export function DashboardCard({ title, icon: Icon, children, className }: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="mb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300">
            <Icon className="size-4" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
