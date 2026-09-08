import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const DropdownMenu = DropdownPrimitive.Root
export const DropdownMenuTrigger = DropdownPrimitive.Trigger

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-44 rounded-xl border border-ink-100 bg-cream-25 p-1 shadow-soft-lg dark:border-ink-800 dark:bg-ink-800',
          'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out',
          className,
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  )
}

export function DropdownMenuItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-700 outline-none transition-colors',
        'data-[highlighted]:bg-cream-100 data-[highlighted]:text-ink-900',
        'dark:text-ink-100 dark:data-[highlighted]:bg-ink-700 dark:data-[highlighted]:text-ink-50',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>) {
  return <DropdownPrimitive.Separator className={cn('my-1 h-px bg-ink-100 dark:bg-ink-700', className)} {...props} />
}

export function DropdownMenuLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>) {
  return <DropdownPrimitive.Label className={cn('px-2.5 py-1.5 text-xs font-medium text-ink-400', className)} {...props} />
}
