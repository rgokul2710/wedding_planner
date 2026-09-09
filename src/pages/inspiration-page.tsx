import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, Image as ImageIcon, Loader2, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INSPIRATION_CATEGORIES } from '@/features/inspiration/constants'
import { InspirationCard } from '@/features/inspiration/inspiration-card'
import { InspirationUploadForm } from '@/features/inspiration/inspiration-upload-form'
import { useAuth } from '@/hooks/use-auth'
import { inspirationQueryKey, useInspirationImages } from '@/hooks/use-inspiration'
import { useInspirationUrls } from '@/hooks/use-inspiration-urls'
import { useWedding } from '@/hooks/use-wedding'
import { deleteInspirationImage, setInspirationFavorite, uploadInspirationImage } from '@/services/inspiration'
import type { InspirationImage } from '@/services/inspiration'

export function InspirationPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: images, isPending } = useInspirationImages(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [deletingImage, setDeletingImage] = React.useState<InspirationImage | null>(null)
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [favoritesOnly, setFavoritesOnly] = React.useState(false)

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: inspirationQueryKey(weddingId) })
  }

  const uploadMutation = useMutation({
    mutationFn: ({ input, file }: { input: Parameters<typeof uploadInspirationImage>[3]; file: File }) =>
      uploadInspirationImage(weddingId, user!.id, file, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const favoriteMutation = useMutation({
    mutationFn: (image: InspirationImage) => setInspirationFavorite(image.id, !image.is_favorite),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (image: InspirationImage) => deleteInspirationImage(image),
    onSuccess: () => {
      invalidate()
      setDeletingImage(null)
    },
  })

  const allImages = images ?? []
  const visibleImages = allImages.filter((img) => {
    if (favoritesOnly && !img.is_favorite) return false
    if (categoryFilter !== 'all' && img.category !== categoryFilter) return false
    return true
  })

  const { data: urlMap } = useInspirationUrls(visibleImages.map((img) => img.storage_path))

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const hasNoImagesAtAll = allImages.length === 0

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Inspiration</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          Add Image
        </Button>
      </div>

      {hasNoImagesAtAll ? (
        <EmptyState
          icon={ImageIcon}
          title="No inspiration yet"
          description="Collect decoration, outfit, and venue ideas in one lightweight moodboard."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Add Image
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {INSPIRATION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant={favoritesOnly ? 'primary' : 'outline'} size="sm" onClick={() => setFavoritesOnly((v) => !v)}>
              <Heart className="size-4" fill={favoritesOnly ? 'currentColor' : 'none'} />
              Favorites Only
            </Button>
          </div>

          {visibleImages.length === 0 ? (
            <EmptyState icon={ImageIcon} title="Nothing matches these filters" description="Try a different category or clear favorites." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleImages.map((image) => (
                <InspirationCard
                  key={image.id}
                  image={image}
                  url={urlMap?.get(image.storage_path)}
                  onToggleFavorite={(img) => favoriteMutation.mutate(img)}
                  onDelete={setDeletingImage}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inspiration Image</DialogTitle>
          </DialogHeader>
          <InspirationUploadForm onCancel={() => setFormOpen(false)} onSubmit={(input, file) => uploadMutation.mutateAsync({ input, file })} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingImage)}
        onOpenChange={(open) => !open && setDeletingImage(null)}
        title="Delete this image?"
        description="This image will be permanently removed from storage. This can't be undone."
        confirmLabel="Delete Image"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingImage && deleteMutation.mutate(deletingImage)}
      />
    </div>
  )
}
