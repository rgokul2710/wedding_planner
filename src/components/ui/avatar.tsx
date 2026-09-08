import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'
import { cn } from '@/lib/utils'

export function Avatar({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-9 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

export function AvatarImage(props: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className="aspect-square size-full object-cover" {...props} />
}

export function AvatarFallback({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center bg-rose-100 text-sm font-medium text-rose-600 dark:bg-rose-500/20 dark:text-rose-200',
        className,
      )}
      {...props}
    />
  )
}
