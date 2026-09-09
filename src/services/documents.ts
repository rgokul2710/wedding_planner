import { deleteFromBucket, uploadToBucket } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type Document = Database['public']['Tables']['documents']['Row']
type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export interface DocumentInput {
  name: string
  category: string
  vendorId: string | null
  notes: string | null
}

export async function listDocuments(weddingId: string): Promise<Document[]> {
  const { data, error } = await supabase.from('documents').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadDocument(weddingId: string, userId: string, file: File, input: DocumentInput): Promise<Document> {
  const uploaded = await uploadToBucket('documents', weddingId, file)
  const { data, error } = await supabase
    .from('documents')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      vendor_id: input.vendorId,
      name: input.name,
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

export async function updateDocument(id: string, input: DocumentInput): Promise<Document> {
  const patch: DocumentUpdate = {
    vendor_id: input.vendorId,
    name: input.name,
    category: input.category,
    notes: input.notes,
  }
  const { data, error } = await supabase.from('documents').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteDocument(document: Document): Promise<void> {
  await deleteFromBucket('documents', document.storage_path)
  const { error } = await supabase.from('documents').delete().eq('id', document.id)
  if (error) throw error
}
