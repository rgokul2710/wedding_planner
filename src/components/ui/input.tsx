import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'h-10 w-full rounded-xl border border-ink-200 bg-cream-25 px-3 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition-colors',
          'focus-visible:border-rose-400 focus-visible:ring-2 focus-visible:ring-rose-400/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-ink-700 dark:bg-ink-800 dark:text-ink-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'min-h-24 w-full rounded-xl border border-ink-200 bg-cream-25 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition-colors',
          'focus-visible:border-rose-400 focus-visible:ring-2 focus-visible:ring-rose-400/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-ink-700 dark:bg-ink-800 dark:text-ink-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200', className)} {...props} />
  ),
)
Label.displayName = 'Label'
