import { findOrCreateGuestGroup } from '@/services/guest-groups'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type Guest = Database['public']['Tables']['guests']['Row']
type GuestUpdate = Database['public']['Tables']['guests']['Update']

export interface GuestInput {
  name: string
  groupName: string | null
  phone: string | null
  email: string | null
  totalGuests: number
  childCount: number
  rsvpStatus: Guest['rsvp_status']
  foodPreference: string | null
  accommodationRequired: boolean
  transportationRequired: boolean
  invitationStatus: Guest['invitation_status']
  notes: string | null
}

export async function listGuests(weddingId: string): Promise<Guest[]> {
  const { data, error } = await supabase.from('guests').select('*').eq('wedding_id', weddingId).order('name')
  if (error) throw error
  return data
}

async function resolveGroupId(weddingId: string, groupName: string | null) {
  if (!groupName) return null
  const group = await findOrCreateGuestGroup(weddingId, groupName)
  return group.id
}

export async function createGuest(weddingId: string, userId: string, input: GuestInput): Promise<Guest> {
  const guestGroupId = await resolveGroupId(weddingId, input.groupName)
  const { data, error } = await supabase
    .from('guests')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      guest_group_id: guestGroupId,
      name: input.name,
      phone: input.phone,
      email: input.email,
      total_guests: input.totalGuests,
      child_count: input.childCount,
      rsvp_status: input.rsvpStatus,
      food_preference: input.foodPreference,
      accommodation_required: input.accommodationRequired,
      transportation_required: input.transportationRequired,
      invitation_status: input.invitationStatus,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGuest(weddingId: string, id: string, input: GuestInput): Promise<Guest> {
  const guestGroupId = await resolveGroupId(weddingId, input.groupName)
  const patch: GuestUpdate = {
    guest_group_id: guestGroupId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    total_guests: input.totalGuests,
    child_count: input.childCount,
    rsvp_status: input.rsvpStatus,
    food_preference: input.foodPreference,
    accommodation_required: input.accommodationRequired,
    transportation_required: input.transportationRequired,
    invitation_status: input.invitationStatus,
    notes: input.notes,
  }
  const { data, error } = await supabase.from('guests').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) throw error
}

export async function deleteGuests(ids: string[]): Promise<void> {
  const { error } = await supabase.from('guests').delete().in('id', ids)
  if (error) throw error
}

export async function setGuestsRsvpStatus(ids: string[], rsvpStatus: Guest['rsvp_status']): Promise<void> {
  const { error } = await supabase.from('guests').update({ rsvp_status: rsvpStatus }).in('id', ids)
  if (error) throw error
}
