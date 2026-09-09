import { Heart, Loader2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { InspirationImage } from '@/services/inspiration'

interface InspirationCardProps {
  image: InspirationImage
  url?: string
  onToggleFavorite: (image: InspirationImage) => void
  onDelete: (image: InspirationImage) => void
}

export function InspirationCard({ image, url, onToggleFavorite, onDelete }: InspirationCardProps) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-ink-100 bg-cream-100 dark:border-ink-800 dark:bg-ink-800">
      {url ? (
        <img src={url} alt={image.notes ?? image.category} className="size-full object-cover" loading="lazy" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Loader2 className="size-5 animate-spin text-ink-300" />
        </div>
      )}

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onToggleFavorite(image)}
          className="flex size-8 items-center justify-center rounded-full bg-ink-900/50 text-cream-25 backdrop-blur-sm hover:bg-ink-900/70"
        >
          <Heart className={cn('size-4', image.is_favorite && 'fill-current text-rose-300')} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(image)}
          className="flex size-8 items-center justify-center rounded-full bg-ink-900/50 text-cream-25 backdrop-blur-sm hover:bg-danger-500/80"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {image.is_favorite && (
        <div className="absolute right-2 top-2 group-hover:hidden">
          <Heart className="size-4 fill-current text-rose-400 drop-shadow" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-2 pt-6">
        <Badge variant="neutral" className="bg-cream-25/90 text-ink-700">
          {image.category}
        </Badge>
      </div>
    </div>
  )
}
