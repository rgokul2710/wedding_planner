import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
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

export function InspirationUploadForm({ onSubmit, onCancel }: InspirationUploadFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<InspirationFormValues>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: { category: INSPIRATION_CATEGORIES[INSPIRATION_CATEGORIES.length - 1] },
  })

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
    setPreviewUrl(URL.createObjectURL(selected))
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
      {formError && (
        <div className="flex items-start gap-2 rounded-xl bg-danger-500/10 px-3 py-2.5 text-sm text-danger-500">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div>
        <Label htmlFor="image">Image</Label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-cream-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-700 dark:text-ink-300 dark:file:bg-ink-700 dark:file:text-ink-100"
        />
        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-3 max-h-48 rounded-xl object-cover" />}
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
