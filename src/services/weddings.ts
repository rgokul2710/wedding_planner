import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type Wedding = Database['public']['Tables']['weddings']['Row']
type CreateWeddingArgs = Database['public']['Functions']['create_wedding']['Args']
type WeddingUpdate = Database['public']['Tables']['weddings']['Update']

export interface WeddingDetailsInput {
  brideName: string
  groomName: string
  weddingDate: string
  engagementDate: string | null
  receptionDate: string | null
  weddingVenue: string | null
  receptionVenue: string | null
  city: string | null
  expectedGuestCount: number | null
  estimatedBudget: number | null
  currency: string
}

export async function getMyWedding(): Promise<Wedding | null> {
  const { data, error } = await supabase.from('weddings').select('*').maybeSingle()
  if (error) throw error
  return data
}

export async function createWedding(input: WeddingDetailsInput): Promise<Wedding> {
  const args: CreateWeddingArgs = {
    p_bride_name: input.brideName,
    p_groom_name: input.groomName,
    p_wedding_date: input.weddingDate,
    p_engagement_date: input.engagementDate,
    p_reception_date: input.receptionDate,
    p_wedding_venue: input.weddingVenue,
    p_reception_venue: input.receptionVenue,
    p_city: input.city,
    p_expected_guest_count: input.expectedGuestCount,
    p_estimated_budget: input.estimatedBudget,
    p_currency: input.currency,
  }
  const { data, error } = await supabase.rpc('create_wedding', args)
  if (error) throw error
  return data
}

export async function updateWedding(id: string, input: WeddingDetailsInput): Promise<Wedding> {
  const patch: WeddingUpdate = {
    bride_name: input.brideName,
    groom_name: input.groomName,
    wedding_date: input.weddingDate,
    engagement_date: input.engagementDate,
    reception_date: input.receptionDate,
    wedding_venue: input.weddingVenue,
    reception_venue: input.receptionVenue,
    city: input.city,
    expected_guest_count: input.expectedGuestCount,
    estimated_budget: input.estimatedBudget,
    currency: input.currency,
  }
  const { data, error } = await supabase.from('weddings').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}
