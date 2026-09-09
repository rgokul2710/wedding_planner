import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number | null
  onChange?: (value: number | null) => void
  size?: 'sm' | 'md'
}

export function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'size-3.5' : 'size-5'
  const interactive = Boolean(onChange)

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value != null && star <= value
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            aria-pressed={filled}
            onClick={() => onChange?.(value === star ? null : star)}
            className={cn(
              'transition-colors',
              interactive ? 'cursor-pointer' : 'cursor-default',
              filled ? 'text-gold-400' : 'text-ink-200 dark:text-ink-600',
            )}
          >
            <Star className={starSize} fill={filled ? 'currentColor' : 'none'} />
          </button>
        )
      })}
    </div>
  )
}
