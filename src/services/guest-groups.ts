import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type GuestGroup = Database['public']['Tables']['guest_groups']['Row']

export async function listGuestGroups(weddingId: string): Promise<GuestGroup[]> {
  const { data, error } = await supabase.from('guest_groups').select('*').eq('wedding_id', weddingId).order('name')
  if (error) throw error
  return data
}

/** Looks up a group by exact name, creating it if it doesn't exist yet. */
export async function findOrCreateGuestGroup(weddingId: string, name: string): Promise<GuestGroup> {
  const trimmed = name.trim()
  const { data: existing, error: findError } = await supabase
    .from('guest_groups')
    .select('*')
    .eq('wedding_id', weddingId)
    .eq('name', trimmed)
    .maybeSingle()
  if (findError) throw findError
  if (existing) return existing

  const { data: created, error: createError } = await supabase
    .from('guest_groups')
    .insert({ wedding_id: weddingId, name: trimmed })
    .select()
    .single()
  if (createError) throw createError
  return created
}
