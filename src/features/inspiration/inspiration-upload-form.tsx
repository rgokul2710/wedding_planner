import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormError } from '@/components/ui/form-error'
import { Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INSPIRATION_CATEGORIES } from '@/features/inspiration/constants'
import { MAX_FILE_SIZE_BYTES } from '@/lib/storage'
import { optionalText } from '@/lib/zod-helpers'
import type { InspirationInput } from '@/services/inspiration'

const inspirationSchema = z.object({
  category: z.string().min(1),
  notes: optionalText,
})

type InspirationFormValues = z.infer<typeof inspirationSchema>

interface InspirationUploadFormProps {
  onSubmit: (input: InspirationInput, file: File) => Promise<unknown>
  onCancel: () => void
}

function fileReducer(_state: File | null, action: File | null) {
  return action
}

export function InspirationUploadForm({ onSubmit, onCancel }: InspirationUploadFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [file, setFile] = React.useReducer(fileReducer, null)

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<InspirationFormValues>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: { category: INSPIRATION_CATEGORIES[INSPIRATION_CATEGORIES.length - 1] },
  })

  // Derived from `file`, not held in its own state, so there's exactly one
  // source of truth — the preview can't drift out of sync with the file
  // that's actually about to be uploaded.
  const previewUrl = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  // Revoke the previous blob: URL whenever it's replaced or the form unmounts,
  // so we don't leak object URLs for images that are never actually uploaded.
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) {
      setFormError('Please choose an image file.')
      e.target.value = ''
      return
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFormError('Image is too large — please choose one under 15MB.')
      e.target.value = ''
      return
    }
    setFormError(null)
    setFile(selected)
  }

  async function handleFormSubmit(values: InspirationFormValues) {
    setFormError(null)
    if (!file) {
      setFormError('Please choose an image to upload.')
      return
    }
    try {
      await onSubmit({ category: values.category, notes: values.notes ?? null }, file)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && <FormError message={formError} />}

      <div>
        <Label htmlFor="image">Image</Label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-cream-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-700 dark:text-ink-300 dark:file:bg-ink-700 dark:file:text-ink-100"
        />
        {previewUrl && previewUrl.startsWith('blob:') && (
          <img src={previewUrl} alt="Preview" className="mt-3 max-h-48 rounded-xl object-cover" />
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSPIRATION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Upload
        </Button>
      </DialogFooter>
    </form>
  )
}
