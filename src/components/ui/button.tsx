import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400',
  {
    variants: {
      variant: {
        primary:
          'bg-rose-500 text-cream-25 shadow-soft hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-400',
        secondary:
          'bg-cream-100 text-ink-800 hover:bg-cream-200 dark:bg-ink-800 dark:text-ink-50 dark:hover:bg-ink-700',
        outline:
          'border border-ink-200 bg-transparent text-ink-700 hover:bg-cream-100 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800',
        ghost: 'bg-transparent text-ink-700 hover:bg-cream-100 dark:text-ink-100 dark:hover:bg-ink-800',
        destructive: 'bg-danger-500 text-cream-25 hover:bg-danger-500/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'
