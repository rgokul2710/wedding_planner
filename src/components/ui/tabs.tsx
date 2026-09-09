import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex items-center gap-1 rounded-xl bg-cream-100 p-1 dark:bg-ink-800', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-lg px-3.5 py-1.5 text-sm font-medium text-ink-500 transition-colors',
        'data-[state=active]:bg-cream-25 data-[state=active]:text-rose-600 data-[state=active]:shadow-soft',
        'dark:text-ink-300 dark:data-[state=active]:bg-ink-700 dark:data-[state=active]:text-rose-200',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-4 focus-visible:outline-none', className)} {...props} />
}
