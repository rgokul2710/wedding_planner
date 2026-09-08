import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-100',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200',
        gold: 'bg-gold-50 text-gold-600 dark:bg-gold-500/15 dark:text-gold-200',
        success: 'bg-success-500/10 text-success-500',
        warning: 'bg-warning-500/10 text-warning-500',
        danger: 'bg-danger-500/10 text-danger-500',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
