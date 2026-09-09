import { supabase } from '@/lib/supabase'

export type StorageBucket = 'documents' | 'inspiration'

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024 // 15MB — generous for a scan/photo, cheap on free-tier storage

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function uploadToBucket(bucket: StorageBucket, weddingId: string, file: File) {
  const path = `${weddingId}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type })
  if (error) throw error
  return { path, size: file.size, mimeType: file.type || 'application/octet-stream' }
}

export async function deleteFromBucket(bucket: StorageBucket, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

export async function getSignedUrl(bucket: StorageBucket, path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}

export async function getSignedUrls(bucket: StorageBucket, paths: string[], expiresIn = 3600) {
  if (paths.length === 0) return new Map<string, string>()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresIn)
  if (error) throw error
  const entries = data
    .filter((entry) => entry.path != null && entry.signedUrl != null)
    .map((entry) => [entry.path as string, entry.signedUrl as string] as const)
  return new Map(entries)
}

/** Resizes and re-encodes an image client-side so inspiration uploads stay small. */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  if (!blob) return file

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], newName, { type: 'image/jpeg' })
}
