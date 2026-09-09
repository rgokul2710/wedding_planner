import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type WeddingEvent = Database['public']['Tables']['events']['Row']
type EventUpdate = Database['public']['Tables']['events']['Update']

export interface EventInput {
  name: string
  eventDate: string
  startTime: string | null
  endTime: string | null
  venue: string | null
  description: string | null
  responsiblePerson: string | null
  notes: string | null
}

export async function listEvents(weddingId: string): Promise<WeddingEvent[]> {
  const { data, error } = await supabase.from('events').select('*').eq('wedding_id', weddingId).order('event_date')
  if (error) throw error
  return data
}

export async function createEvent(weddingId: string, userId: string, input: EventInput): Promise<WeddingEvent> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      name: input.name,
      event_date: input.eventDate,
      start_time: input.startTime,
      end_time: input.endTime,
      venue: input.venue,
      description: input.description,
      responsible_person: input.responsiblePerson,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateEvent(id: string, input: EventInput): Promise<WeddingEvent> {
  const patch: EventUpdate = {
    name: input.name,
    event_date: input.eventDate,
    start_time: input.startTime,
    end_time: input.endTime,
    venue: input.venue,
    description: input.description,
    responsible_person: input.responsiblePerson,
    notes: input.notes,
  }
  const { data, error } = await supabase.from('events').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}
