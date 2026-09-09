import { compressImage, deleteFromBucket, uploadToBucket } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type InspirationImage = Database['public']['Tables']['inspiration_images']['Row']

export interface InspirationInput {
  category: string
  notes: string | null
}

export async function listInspirationImages(weddingId: string): Promise<InspirationImage[]> {
  const { data, error } = await supabase
    .from('inspiration_images')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadInspirationImage(
  weddingId: string,
  userId: string,
  file: File,
  input: InspirationInput,
): Promise<InspirationImage> {
  const optimized = await compressImage(file)
  const uploaded = await uploadToBucket('inspiration', weddingId, optimized)
  const { data, error } = await supabase
    .from('inspiration_images')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      category: input.category,
      storage_path: uploaded.path,
      file_size: uploaded.size,
      mime_type: uploaded.mimeType,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setInspirationFavorite(id: string, isFavorite: boolean): Promise<void> {
  const { error } = await supabase.from('inspiration_images').update({ is_favorite: isFavorite }).eq('id', id)
  if (error) throw error
}

export async function deleteInspirationImage(image: InspirationImage): Promise<void> {
  await deleteFromBucket('inspiration', image.storage_path)
  const { error } = await supabase.from('inspiration_images').delete().eq('id', image.id)
  if (error) throw error
}
