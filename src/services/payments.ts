import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type Payment = Database['public']['Tables']['payments']['Row']
type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export interface PaymentInput {
  vendor: string | null
  description: string
  amount: number
  paymentDate: string | null
  paymentMethod: Payment['payment_method']
  paymentStatus: Payment['payment_status']
  dueDate: string | null
  referenceId: string | null
  notes: string | null
}

export async function listPayments(weddingId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('due_date', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data
}

export async function createPayment(weddingId: string, userId: string, input: PaymentInput): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      vendor: input.vendor,
      description: input.description,
      amount: input.amount,
      payment_date: input.paymentDate,
      payment_method: input.paymentMethod,
      payment_status: input.paymentStatus,
      due_date: input.dueDate,
      reference_id: input.referenceId,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePayment(id: string, input: PaymentInput): Promise<Payment> {
  const patch: PaymentUpdate = {
    vendor: input.vendor,
    description: input.description,
    amount: input.amount,
    payment_date: input.paymentDate,
    payment_method: input.paymentMethod,
    payment_status: input.paymentStatus,
    due_date: input.dueDate,
    reference_id: input.referenceId,
    notes: input.notes,
  }
  const { data, error } = await supabase.from('payments').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePayment(id: string): Promise<void> {
  const { error } = await supabase.from('payments').delete().eq('id', id)
  if (error) throw error
}
