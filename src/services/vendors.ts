import { supabase } from '@/lib/supabase'
import type { Database, VendorStatus } from '@/types/database'

export type Vendor = Database['public']['Tables']['vendors']['Row']
type VendorUpdate = Database['public']['Tables']['vendors']['Update']

export interface VendorInput {
  name: string
  category: string
  contactPerson: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  quotedAmount: number | null
  finalAmount: number | null
  advancePaid: number
  rating: number | null
  notes: string | null
  status: VendorStatus
  pros: string | null
  cons: string | null
}

const SELECTED_VENDOR_CONFLICT_MESSAGE =
  "Another vendor in this category is already marked Selected. Use \"Mark as Selected\" on the vendor list instead — it switches the selection automatically."

export async function listVendors(weddingId: string): Promise<Vendor[]> {
  const { data, error } = await supabase.from('vendors').select('*').eq('wedding_id', weddingId).order('name')
  if (error) throw error
  return data
}

export async function createVendor(weddingId: string, userId: string, input: VendorInput): Promise<Vendor> {
  const { data, error } = await supabase
    .from('vendors')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      name: input.name,
      category: input.category,
      contact_person: input.contactPerson,
      phone: input.phone,
      email: input.email,
      website: input.website,
      address: input.address,
      quoted_amount: input.quotedAmount,
      final_amount: input.finalAmount,
      advance_paid: input.advancePaid,
      rating: input.rating,
      notes: input.notes,
      status: input.status,
      pros: input.pros,
      cons: input.cons,
    })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error(SELECTED_VENDOR_CONFLICT_MESSAGE)
    throw error
  }
  return data
}

export async function updateVendor(id: string, input: VendorInput): Promise<Vendor> {
  const patch: VendorUpdate = {
    name: input.name,
    category: input.category,
    contact_person: input.contactPerson,
    phone: input.phone,
    email: input.email,
    website: input.website,
    address: input.address,
    quoted_amount: input.quotedAmount,
    final_amount: input.finalAmount,
    advance_paid: input.advancePaid,
    rating: input.rating,
    notes: input.notes,
    status: input.status,
    pros: input.pros,
    cons: input.cons,
  }
  const { data, error } = await supabase.from('vendors').update(patch).eq('id', id).select().single()
  if (error) {
    if (error.code === '23505') throw new Error(SELECTED_VENDOR_CONFLICT_MESSAGE)
    throw error
  }
  return data
}

export async function deleteVendor(id: string): Promise<void> {
  const { error } = await supabase.from('vendors').delete().eq('id', id)
  if (error) throw error
}

/** Atomically marks this vendor "selected" and demotes any other selected vendor in the same category. */
export async function selectVendor(id: string): Promise<void> {
  const { error } = await supabase.rpc('select_vendor', { p_vendor_id: id })
  if (error) throw error
}

export async function unselectVendor(id: string): Promise<void> {
  const { error } = await supabase.from('vendors').update({ status: 'considering' }).eq('id', id)
  if (error) throw error
}
