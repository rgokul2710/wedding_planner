import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormError } from '@/components/ui/form-error'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DOCUMENT_CATEGORIES } from '@/features/documents/constants'
import { MAX_FILE_SIZE_BYTES } from '@/lib/storage'
import { optionalText } from '@/lib/zod-helpers'
import type { Document, DocumentInput } from '@/services/documents'
import type { Vendor } from '@/services/vendors'

const documentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1),
  vendorId: optionalText,
  notes: optionalText,
})

type DocumentFormValues = z.infer<typeof documentSchema>

interface DocumentFormProps {
  document?: Document
  vendors: Vendor[]
  onSubmit: (input: DocumentInput, file: File | null) => Promise<unknown>
  onCancel: () => void
}

export function DocumentForm({ document, vendors, onSubmit, onCancel }: DocumentFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const isEditing = Boolean(document)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document?.name ?? '',
      category: document?.category ?? DOCUMENT_CATEGORIES[DOCUMENT_CATEGORIES.length - 1],
      vendorId: document?.vendor_id ?? undefined,
      notes: document?.notes ?? undefined,
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFormError('File is too large — please choose one under 15MB.')
      e.target.value = ''
      return
    }
    setFormError(null)
    setFile(selected)
    if (!document) setValue('name', selected.name)
  }

  async function handleFormSubmit(values: DocumentFormValues) {
    setFormError(null)
    if (!isEditing && !file) {
      setFormError('Please choose a file to upload.')
      return
    }
    try {
      await onSubmit(
        {
          name: values.name,
          category: values.category,
          vendorId: values.vendorId ?? null,
          notes: values.notes ?? null,
        },
        file,
      )
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {formError && <FormError message={formError} />}

      {!isEditing && (
        <div>
          <Label htmlFor="file">File</Label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-cream-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-700 dark:text-ink-300 dark:file:bg-ink-700 dark:file:text-ink-100"
          />
        </div>
      )}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="mt-1.5 text-xs text-danger-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                  {DOCUMENT_CATEGORIES.map((category) => (
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
          <Label htmlFor="vendor">Related vendor</Label>
          <Controller
            control={control}
            name="vendorId"
            render={({ field }) => (
              <Select value={field.value ?? 'none'} onValueChange={(v) => field.onChange(v === 'none' ? undefined : v)}>
                <SelectTrigger id="vendor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
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
          {isEditing ? 'Save Changes' : 'Upload Document'}
        </Button>
      </DialogFooter>
    </form>
  )
}
